import moment from 'moment'
import parseDuration from 'duration-parser'
import log from 'winston'

import { sleep } from './utils'
import { createSmsClient } from './sms-client'
import { createAdtClient } from './adt-client'
import { createDoorTracker } from './door-tracker'

export async function main(env) {
  const {
    ALERT_PHONE,
    ADT_USERNAME,
    ADT_PASSWORD,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_MESSAGING_SERVICE_SID,
  } = env
  const STALE_AFTER_MS = parseDuration(env.STALE_AFTER)
  const REMIND_INTERVAL_MS = parseDuration(env.REMIND_INTERVAL)
  const SESSION_KEEPALIVE_INTERVAL_MS = parseDuration(env.SESSION_KEEPALIVE_INTERVAL)
  const PING_INTERVAL_MS = parseDuration(env.PING_INTERVAL)

  const adtClient = await createAdtClient(ADT_USERNAME, ADT_PASSWORD)
  const smsClient = await createSmsClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID)

  const doors = createDoorTracker(
    adtClient,
    STALE_AFTER_MS,

    // on change handler
    (name, current, prev) => {
      if (!prev) log.info('initialized', name, 'as', current)
      else log.info(name, prev, '->', current)
    },

    // on left open handler
    async (name, ms) => {
      doors.muteUntil(name, Date.now() + REMIND_INTERVAL_MS)
      const msInHuman = moment.duration(ms).humanize()
      await smsClient.sendMessage(ALERT_PHONE, `${name} has been open for ${msInHuman}`)
    },
  )

  let nextDashboardLoad = 0
  while (true) {
    /* eslint-disable no-await-in-loop */
    if (Date.now() >= nextDashboardLoad) {
      await adtClient.pullDashboard()
      nextDashboardLoad = Date.now() + SESSION_KEEPALIVE_INTERVAL_MS
    }

    await doors.poll()
    await sleep(PING_INTERVAL_MS)
    /* eslint-enable no-await-in-loop */
  }
}
