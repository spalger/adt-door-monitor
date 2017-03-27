import { createIssuesForDoor } from './issues-for-door'

describe('createIssuesForDoor()', () => {
  it('emits no issues if door is closed', async () => {
    const door = { name: 'front', closed: true }
    const issues = await createIssuesForDoor(door).toArray().toPromise()
    expect(issues).toEqual([])
  })

  it('emits first issue after initialDelay, then more at reminderInterval', async () => {
    const door = { name: 'front', closed: false }
    const issues = await createIssuesForDoor(door, { initialDelay: 100, reminderInterval: 10 })
      .take(10)
      .toArray()
      .toPromise()

    expect(issues).toEqual(expect.any(Array))
    expect(issues).toHaveLength(10)

    issues.forEach((issue, i) => {
      expect(issue).toHaveProperty('door', door)
      expect(issue).toHaveProperty('count', i + 1)
      expect(issue).toHaveProperty('duration')

      if (i === 0) {
        expect(issue.duration.ms).toBeGreaterThanOrEqual(100)
        expect(issue.duration.ms).toBeLessThan(110)
      } else {
        expect(issue.duration.ms).toBeGreaterThanOrEqual(issues[i - 1].duration.ms + 10)
      }
    })
  })
})
