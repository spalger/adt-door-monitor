import sinon from 'sinon'

import { createAdtEvents } from './adt-events'

describe('createAdtEvents()', () => {
  it('waits for the first dashboard-update, does homeView fetch immediately', async () => {
    const opts = {
      adtClient: {
        pullDashboard: sinon.spy(async () => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return {}
        }),
        getHomeView: sinon.spy(async () => ({
          items: [
            {
              name: 'Front Door',
              state: {
                statusTxt: 'Closed',
              },
            },
            {
              name: 'Back Door',
              state: {
                statusTxt: 'Closed',
              },
            },
            {
              name: 'Side Door',
              state: {
                statusTxt: 'Closed',
              },
            },
          ],
        })),
      },
      keepAliveInterval: 3000,
      pingInterval: 250,
    }

    const start = Date.now()
    const adtEvents = await createAdtEvents(opts)
      .take(5)
      .toArray()
      .toPromise()

    expect(adtEvents[0].type).toBe('dashboard-update')
    expect(adtEvents[0].time - start).toBeGreaterThanOrEqual(1000)
    expect(adtEvents[1].type).toBe('door')
    expect(adtEvents[1].time).toBeGreaterThanOrEqual(adtEvents[0].time)
    expect(adtEvents[1].time).toBeLessThan(adtEvents[0].time + 250)
    expect(adtEvents[2].type).toBe('door')
    expect(adtEvents[2].time).toBeGreaterThanOrEqual(adtEvents[0].time)
    expect(adtEvents[2].time).toBeLessThan(adtEvents[0].time + 250)
    expect(adtEvents[3].type).toBe('door')
    expect(adtEvents[3].time).toBeGreaterThanOrEqual(adtEvents[0].time)
    expect(adtEvents[3].time).toBeLessThan(adtEvents[0].time + 250)
    expect(adtEvents[4].type).toBe('door')
    expect(adtEvents[4].time).toBeGreaterThanOrEqual(adtEvents[3].time + 250)
  })
})
