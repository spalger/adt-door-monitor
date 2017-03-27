import Rx from 'rxjs/Rx'

// import * as IssuesForDoor from './issues-for-door'
import { createIssuesForDoors } from './issues-for-doors'

const delay = new Rx.Observable(o => {
  setTimeout(() => o.complete(), 100)
})

describe('createIssuesForDoors()', () => {
  it('emits issues for each door as needed', async () => {
    const doors = Rx.Observable.concat(
      [
        { name: 'front', closed: true },
        { name: 'back', closed: true },
      ],
      delay,
      [
        { name: 'front', closed: true },
        { name: 'back', closed: true },
      ],
      delay,
      [
        { name: 'front', closed: false },
        { name: 'back', closed: true },
      ],
      delay,
      [
        { name: 'front', closed: false },
        { name: 'back', closed: true },
      ],
      delay,
      [
        { name: 'front', closed: false },
        { name: 'back', closed: false },
      ],
      delay,
    )

    const issues = await createIssuesForDoors(doors, { initialDelay: 80, reminderInterval: 80 })
      .toArray()
      .toPromise()

    expect(issues).toHaveLength(4)
    expect(issues.map(i => i.door.name)).toEqual([
      'front',
      'front',
      'front',
      'back',
    ])
  })
})
