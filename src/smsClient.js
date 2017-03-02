import Twilio from 'twilio'

import { fromNode } from './utils'

export function createSmsClient (sid, authToken, msgServiceSid) {
  const client = new Twilio(sid, authToken)

  class SmsClient {
    async sendMessage (to, message) {
      return fromNode(cb => {
        client.sendMessage({
          to: to,
          messagingServiceSid: msgServiceSid,
          body: message
        }, cb)
      })
    }
  }

  return new SmsClient()
}
