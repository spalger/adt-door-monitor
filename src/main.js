import { resolve } from 'path'

import parseDuration from 'duration-parser'
import log from 'winston'

import { createSmsClient } from './sms-client'
import { createAdtClient } from './adt-client'
import { createDb } from './db'
import { eventValuesOfType } from './events'
import { createAdtEvents } from './adt-events'
import { createIssuesForDoors } from './issues'
import { createSmsResponder } from './sms-responder'

export async function main(env) {
  const {
    ADT_USERNAME,
    ADT_PASSWORD,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_MESSAGING_SERVICE_SID,
    DATA_DIR,
  } = env
  const PORT = parseInt(env.PORT, 10)
  const STALE_AFTER_MS = parseDuration(env.STALE_AFTER)
  const REMIND_INTERVAL_MS = parseDuration(env.REMIND_INTERVAL)
  const SESSION_KEEPALIVE_INTERVAL_MS = parseDuration(env.SESSION_KEEPALIVE_INTERVAL)
  const PING_INTERVAL_MS = parseDuration(env.PING_INTERVAL)

  const adtClient = await createAdtClient(ADT_USERNAME, ADT_PASSWORD)
  const smsClient = await createSmsClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID)
  const subscriberDb = await createDb(resolve(DATA_DIR, 'subscribers'))
  const smsResponder = await createSmsResponder(subscriberDb, TWILIO_AUTH_TOKEN, PORT)

  const adtEvents = createAdtEvents({
    adtClient,
    keepAliveInterval: SESSION_KEEPALIVE_INTERVAL_MS,
    pingInterval: PING_INTERVAL_MS,
  })

  const getDoors = () => eventValuesOfType(adtEvents.share(), 'door')

  await Promise.all([
    // run the smsResponder server
    smsResponder.listen(),

    // log adt fetch errors
    eventValuesOfType(adtEvents.share(), 'error')
      .forEach(error => {
        log.info('ADT ERROR', error)
      }),

    // log doors discovered
    getDoors()
      .groupBy(door => door.name)
      .mergeMap(group =>
          group
            .first()
            .forEach(door => {
              log.info('discovered door %j', door)
            }),
        )
      .toPromise(),

    // send issues to subscribers
    createIssuesForDoors(getDoors(), { initialDelay: STALE_AFTER_MS, reminderInterval: REMIND_INTERVAL_MS })
      .mergeMap(issue =>
        subscriberDb
          .getAll()
          .filter(s => !s.muteUntil || s.muteUntil < Date.now())
          .mergeMap(subscriber => smsClient.sendMessage(
            subscriber.phone,
            issue.text,
          )),
      )
      .toPromise(),
  ])
}
