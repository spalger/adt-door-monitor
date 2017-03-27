import parseDuration from 'duration-parser'
import moment from 'moment'

async function isSubscribed(db, phone, args, respond) {
  if (!await db.has(phone)) {
    respond('not subscribed')
  }
}

export const commands = [
  {
    triggers: ['sub', 'start'],
    async exec(db, phone, args, respond) {
      if (await db.has(phone)) {
        return respond('already subscribed')
      }

      await db.set(phone, { phone })
      return respond('subscribed')
    },
  },

  {
    triggers: ['unsub'],
    checks: [isSubscribed],
    async exec(db, phone, args, respond) {
      await db.delete(phone)
      return respond('unsubscribed')
    },
  },

  {
    triggers: ['mute'],
    checks: [isSubscribed],
    async exec(db, phone, args, respond) {
      let ms
      try {
        ms = parseDuration(args.join(' '))
      } catch (err) {
        respond('invalid duration, command should be `mute [duration]`. Try "3h", or "2 days"')
        return
      }

      const subscriber = await db.get(phone)
      subscriber.muteUntil = Date.now() + ms
      await db.set(phone, subscriber)
      respond(`notifications muted for ${moment.duration(ms).humanize()}`)
    },
  },

  {
    triggers: ['unmute'],
    checks: [isSubscribed],
    async exec(db, phone, args, respond) {
      const subscriber = await db.get(phone)
      if (!subscriber.muteUntil || subscriber.muteUntil < Date.now()) {
        respond('notifications are not muted')
        return
      }

      subscriber.muteUntil = 0
      await db.set(phone, subscriber)
      respond('notifications no longer muted')
    },
  },
]
