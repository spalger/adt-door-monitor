import { readFileSync } from 'fs'

import log from 'winston'
import { parse } from 'dotenv'

export function parseEnvFile(path) {
  try {
    return parse(readFileSync(path, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      log.info('env file %j missing', path)
      return {}
    }

    throw err
  }
}

export function createEnv(src) {
  return new Proxy({}, {
    get(target, prop) {
      if (!src[prop]) {
        throw new Error(`Missing ${prop} environment variable`)
      }

      return src[prop]
    },
  })
}
