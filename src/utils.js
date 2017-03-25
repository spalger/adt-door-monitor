import nodeRequest from 'request'

const CHROME_UA = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3)',
  'AppleWebKit/537.36 (KHTML, like Gecko)',
  'Chrome/56.0.2924.87',
  'Safari/537.36',
].join(' ')

export const uniq = arr => (
  arr.reduce((uniqs, a) => (
    uniqs.includes(a) ? uniqs : [...uniqs, a]
  ), [])
)

export const fromNode = fn => new Promise((resolve, reject) => {
  fn((err, value) => (
    err ? reject(err) : resolve(value)
  ))
})

export const createRequest = () => {
  const jar = nodeRequest.jar()
  const req = (method, url, { body, form } = {}) => fromNode(cb => {
    nodeRequest({
      method,
      url,
      body,
      jar,
      form,
      followRedirect: true,
      followAllRedirects: true,
      headers: {
        'User-Agent': CHROME_UA,
      },
    }, cb)
  })

  return {
    get: (...args) => req('GET', ...args),
    post: (...args) => req('POST', ...args),
  }
}

export const sleep = ms => new Promise(resolve => {
  setTimeout(resolve, ms)
})
