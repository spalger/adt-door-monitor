import Rx from 'rxjs/Rx'
import moment from 'moment'

export function createIssuesForDoor(door, opts = {}) {
  const { initialDelay, reminderInterval } = opts
  if (door.closed) {
    return Rx.Observable.from([])
  }

  const start = Date.now()
  let count = 0

  return Rx.Observable.timer(initialDelay, reminderInterval)
    .map(() => {
      const ms = Date.now() - start
      const text = moment.duration(ms).humanize()
      count += 1

      return {
        door,
        count,
        text: `${door.name} has been open for ${text}`,
        duration: { ms, text },
      }
    })
}
