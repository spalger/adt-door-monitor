import Rx from 'rxjs/Rx'

import { createEvent } from './events'

export function createAdtEvents({ adtClient, keepAliveInterval, pingInterval }) {
  const dashboardUpdates = Rx.Observable.interval(keepAliveInterval)
    .mergeMap(async () => {
      try {
        await adtClient.pullDashboard()
        return createEvent('dashboard-update')
      } catch (error) {
        return createEvent('error', error)
      }
    })

  const homeViews = dashboardUpdates.share().first()
    .mergeMap(() => Rx.Observable.interval(pingInterval).startWith(-1))
    .mergeMap(() => adtClient.getHomeView())
    .mergeMap(homeView => (
      homeView.items
      .filter(i => i.name.includes('Door'))
      .map(({ name, state }) => {
        const closed = state.statusTxt.includes('Closed')
        return createEvent('door', { name, closed })
      })
    ))

  return Rx.Observable.merge(homeViews, dashboardUpdates)
}
