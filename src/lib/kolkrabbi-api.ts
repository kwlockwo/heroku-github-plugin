import {HTTP} from 'http-call'

const KOLKRABBI_BASE_URL = 'https://kolkrabbi.heroku.com'

export default class {
  headers: any

  constructor(version: any, herokuHeaders: any, getToken: () => any) {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      'User-Agent': version,
    }
    this.headers = {...headers, ...JSON.parse(herokuHeaders || '{}')}
  }

  request(url: string, options: any = {}) {
    options.headers = this.headers

    if (['POST', 'PATCH', 'DELETE'].includes(options.method)) {
      options.headers['Content-type'] = 'application/json'
    }

    return HTTP.request(`${KOLKRABBI_BASE_URL}${url}`, options).then((res: any) => res.body)
  }

  getAccount() {
    return this.request('/account/github/token')
  }

  githubPush(app: any, b: any) {
    return this.request(`/apps/${app}/github/push`, {
      method: 'POST',
      body: {branch: b},
    })
  }
}
