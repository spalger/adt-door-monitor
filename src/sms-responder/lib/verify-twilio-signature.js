import { format as formatUrl } from 'url'

import log from 'winston'
import Boom from 'boom'

import { signTwilioRequest } from './sign-twilio-request'

export function verifyTwilioSignature(authToken, req) {
  const host = formatUrl({
    host: req.get('X-Forwarded-Host'),
    protocol: req.get('X-Forwarded-Proto'),
  })
  const url = `${host}${req.originalUrl}`

  const expected = signTwilioRequest(url, req.body, authToken)
  const provided = req.get('X-Twilio-Signature')
  if (expected !== provided) {
    throw Boom.unauthorized('Invalid Signature')
  }
}
