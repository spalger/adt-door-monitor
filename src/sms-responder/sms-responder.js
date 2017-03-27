import { createServer } from 'http'

import express from 'express'
import bodyParser from 'body-parser'

import { fromNode, nextify } from '../utils'

import {
  verifyTwilioSignature,
  respondToMessage,
  errorHandler,
} from './lib'

export async function createSmsResponder(db, authToken, port) {
  const app = express()
  const server = createServer(app)

  // trust X-Forwarded-For header
  app.set('trust proxy', true)

  // webhook handler
  app.post('/sms/reply',
    bodyParser.urlencoded({
      inflate: true,
      extended: false,
    }),
    nextify((req) => verifyTwilioSignature(authToken, req)),
    (req, res, next) => respondToMessage(db, req, res, next),
  )

  app.use(errorHandler)

  class SmsResponder {
    async listen() {
      await fromNode(cb => server.listen(port, cb))
    }
  }

  return new SmsResponder()
}
