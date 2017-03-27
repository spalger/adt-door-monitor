/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { TwimlResponse } from 'twilio'

import { commands } from './commands'

export async function respondToMessage(db, req, res, next) {
  try {
    const params = req.body

    let responded = false
    const respond = (message) => {
      responded = true
      const twiml = new TwimlResponse()
      twiml.message(message)
      res.type('xml').end(twiml.toString())
    }

    const bodyParts = params.Body.trim().split(' ')
    const trigger = bodyParts[0].toLowerCase()
    const command = commands.find(c => c.triggers.includes(trigger))
    const args = [db, params.From, bodyParts.slice(1), respond]

    if (!command) {
      respond(`unknown command "${trigger}"`)
      return
    }

    if (command.checks) {
      for (const check of command.checks) {
        await check(...args)
        if (responded) return
      }
    }

    await command.exec(...args)
  } catch (err) {
    next(err)
  }
}
