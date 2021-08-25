import {HTTP} from 'http-call'

const KOLKRABBI_BASE_URL = 'https://kolkrabbi.heroku.com'

export default class {
  version: any

  getToken: any

  constructor(version: any, getToken: any) {
    this.version = version
    this.getToken = getToken
  }

  request(url: string, options: any = {}) {
    options.headers = {
      Authorization: `Bearer ${this.getToken()}`,
      'User-Agent': this.version,
    }

    if (['POST', 'PATCH', 'DELETE'].includes(options.method)) {
      options.headers['Content-type'] = 'application/json'
    }

    return HTTP.request(KOLKRABBI_BASE_URL + url, options).then((res: any) => res.body)
  }

  githubPush(app: any, b: any) {
    return this.request(`/apps/${app}/github/push`, {
      method: 'POST',
      body: {branch: b},
    })
  }
}
