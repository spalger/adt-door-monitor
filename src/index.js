import 'dotenv/config'
import { resolve as resolveUrl } from 'url'

import { sendMessage } from './twilio'
import { createRequest, uniq, sleep } from './utils'

(async function () {
  const PING_INTERVAL = parseInt(process.env.PING_INTERVAL, 10)
  const ALERT_PHONE = process.env.ALERT_PHONE
  const ADT_USERNAME = process.env.ADT_USERNAME
  const ADT_PASSWORD = process.env.ADT_PASSWORD

  const { get, post } = createRequest()
  const loginPageResp = await get('https://portal.adtpulse.com/')
  const loginPageUrl = loginPageResp.request.href
  const dashboardPageResp = await post(loginPageUrl, {
    form: {
      usernameForm: ADT_USERNAME,
      passwordForm: ADT_PASSWORD
    }
  })
  const dashboardPageUrl = dashboardPageResp.request.href
  const ajaxUrl = resolveUrl(dashboardPageUrl, '../ajax/homeViewDevAjax.jsp')

  function getNextDashboardLoadTime () {
    return Date.now() + (((Math.random() * 120) + 60) * 1000)
  }

  async function getDoorStatus () {
    const ajaxResp = await post(ajaxUrl)
    const homeView = JSON.parse(ajaxResp.body.trim())
    return homeView.items
      .filter(i => i.name.includes('Door'))
      .reduce(
        (acc, { name, state }) => Object.assign(acc, {
          [name]: state.statusTxt.includes('Closed') ? 'closed' : 'open'
        }),
        {}
      )
  }

  const doorHistory = [{}, {}]
  let nextDashboardLoad = 0
  while (true) {
    if (nextDashboardLoad <= Date.now()) {
      await get(dashboardPageUrl)
      nextDashboardLoad = getNextDashboardLoadTime()
    }

    doorHistory.unshift(await getDoorStatus())
    doorHistory.length = 2

    const [current, prev] = doorHistory
    const doorNames = uniq([
      ...Object.keys(current),
      ...Object.keys(prev)
    ])

    for (const doorName of doorNames) {
      if (!prev[doorName]) {
        console.log('initialized', doorName)
        continue
      }

      if (current[doorName] === prev[doorName]) {
        continue
      }

      console.log(doorName, ':', prev[doorName], '->', current[doorName])
      await sendMessage(ALERT_PHONE, `${doorName} is now ${current[doorName]}`)
    }

    await sleep(PING_INTERVAL)
  }
}())
.catch(err => console.log('FATAL ERROR', err.stack || err.message || err))
