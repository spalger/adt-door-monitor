import Rx from 'rxjs/Rx'
import { createIssuesForDoor } from './issues-for-door'

export function createIssuesForDoors(doors, opts = {}) {
  return doors
    .groupBy(door => door.name)
    .mergeMap(group => (
      new Rx.Observable(observer => {
        let currentSub

        const unsub = () => {
          if (!currentSub) return

          currentSub.unsubscribe()
          currentSub = null
        }

        const sub = str => {
          unsub()
          currentSub = str.subscribe({
            next: v => observer.next(v),
            complete: () => unsub(),
            error: e => {
              unsub()
              observer.error(e)
            },
          })
        }

        group
          .distinctUntilKeyChanged('closed')
          .subscribe({
            next: door => sub(createIssuesForDoor(door, opts)),
            error: err => {
              unsub()
              observer.error(err)
            },
            complete: () => {
              if (currentSub) {
                unsub()
              }

              observer.complete()
            },
          })
      })
    ))
}
