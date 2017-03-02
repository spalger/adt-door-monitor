import Twilio from 'twilio'

import { fromNode } from './utils'

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendMessage (to, message) {
  return fromNode(cb => {
    client.sendMessage({
      to: to,
      from: process.env.TWILIO_PHONE,
      body: message
    }, cb)
  })
}
