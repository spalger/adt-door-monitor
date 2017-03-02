import moment from 'moment'
import parseDuration from 'duration-parser'

import { sleep, MINUTE } from './utils'
import { createSmsClient } from './smsClient'
import { createAdtClient } from './adtClient'
import { createDoorTracker } from './doorTracker'

export async function main (env) {
  const {
    ALERT_PHONE,
    ADT_USERNAME,
    ADT_PASSWORD,
    TWILIO_PHONE,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  } = env
  const STALE_AFTER_MS = parseDuration(env.STALE_AFTER)
  const PING_INTERVAL_MS = parseDuration(env.PING_INTERVAL)

  const adtClient = await createAdtClient(ADT_USERNAME, ADT_PASSWORD)
  const smsClient = await createSmsClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE)

  const doors = createDoorTracker(
    adtClient,
    STALE_AFTER_MS,

    // on change handler
    (name, current, prev) => {
      if (!prev) console.log('initialized', name, 'as', current)
      else console.log(name, prev, '->', current)
    },

    // on left open handler
    async (name, ms) => {
      doors.muteUntil(name, Date.now() + MINUTE)
      const msInHuman = moment.duration(ms).humanize()
      await smsClient.sendMessage(ALERT_PHONE, `${name} has been open for ${msInHuman}`)
    }
  )

  let nextDashboardLoad = 0
  while (true) {
    if (Date.now() >= nextDashboardLoad) {
      await adtClient.pullDashboard()
      const betweenOneAndThree = 1 + (Math.random() * 2)
      nextDashboardLoad = Date.now() + Math.round(MINUTE * betweenOneAndThree)
    }

    await doors.poll()
    await sleep(PING_INTERVAL_MS)
  }
}
