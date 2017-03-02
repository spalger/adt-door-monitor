import { resolve } from 'path'

import { createEnv, parseEnvFile } from './env'
import { main } from './main'

const env = createEnv(Object.assign(
  {},
  parseEnvFile(resolve(__dirname, '../.env.default')),
  parseEnvFile(resolve(__dirname, '../.env')),
  process.env
))

main(env).catch(err => {
  console.log('FATAL ERROR', err.stack || err.message || err)
  process.exitCode = 1
})
