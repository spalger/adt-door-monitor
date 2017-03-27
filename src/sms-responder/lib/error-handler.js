import Boom from 'boom'
import log from 'winston'

export function errorHandler(e, req, res, next) { // eslint-disable-line no-unused-vars
  const err = e && e.isBoom ? e : Boom.wrap(e)

  if (res.headersSent) {
    log.error('POST-RESPONSE ROUTE ERROR', err)
    return
  }

  if (err.isServer) {
    log.error('ROUTE ERROR', err)
  }

  res
    .status(err.output.statusCode)
    .set(err.output.headers)
    .send(err.output.payload)
}
