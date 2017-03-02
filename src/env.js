import { readFileSync } from 'fs'

import { parse } from 'dotenv'

export function parseEnvFile (path) {
  return parse(readFileSync(path, 'utf8'))
}

export function createEnv (src) {
  return new Proxy({}, {
    get (target, prop) {
      if (!src[prop]) {
        throw new Error(`Missing ${prop} environment variable`)
      }

      return src[prop]
    }
  })
}
