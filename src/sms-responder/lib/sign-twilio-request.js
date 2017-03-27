import { format } from 'util'
import { createHmac } from 'crypto'

export function signTwilioRequest(url, params, authToken) {
  if (typeof params !== 'object') {
    throw new TypeError(format('expected params to be an object, got', params))
  }

  if (typeof url !== 'string') {
    throw new TypeError(format('expected url to be a string, got', url))
  }

  if (typeof authToken !== 'string') {
    throw new TypeError('expected authToken to be a string')
  }

  const sortedBodyPairs = Object.keys(params)
    .sort()
    .reduce((acc, key) => `${acc}${key}${params[key]}`, '')

  const hmac = createHmac('sha1', authToken)
  hmac.update(url)
  hmac.update(sortedBodyPairs)
  return hmac.digest('base64')
}
