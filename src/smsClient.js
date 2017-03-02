import Twilio from 'twilio'

import { fromNode } from './utils'

export function createSmsClient (sid, authToken, fromPhone) {
  const client = new Twilio(sid, authToken)

  class SmsClient {
    async sendMessage (to, message) {
      return fromNode(cb => {
        client.sendMessage({
          to: to,
          from: fromPhone,
          body: message
        }, cb)
      })
    }
  }

  return new SmsClient()
}
