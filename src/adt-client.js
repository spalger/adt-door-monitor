import { resolve as resolveUrl } from 'url'

import { createRequest } from './utils'

export async function createAdtClient(username, password) {
  const { get, post } = createRequest()
  const loginPageResp = await get('https://portal.adtpulse.com/')
  const loginPageUrl = loginPageResp.request.href
  const dashboardPageResp = await post(loginPageUrl, {
    form: {
      usernameForm: username,
      passwordForm: password,
    },
  })
  const dashboardPageUrl = dashboardPageResp.request.href
  const ajaxUrl = resolveUrl(dashboardPageUrl, '../ajax/homeViewDevAjax.jsp')

  class AdtClient {
    async getHomeView() {
      const ajaxResp = await post(ajaxUrl)
      return JSON.parse(ajaxResp.body.trim())
    }

    async pullDashboard() {
      await get(dashboardPageUrl)
    }
  }

  return new AdtClient()
}
