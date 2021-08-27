import {HTTP} from 'http-call'

const GITHUB_BASE_URL = 'https://api.github.com'

export default class {
  headers: any

  constructor(version: any, getToken: () => any) {
    const headers = {
      Authorization: `Bearer ${getToken()}`,
      'User-Agent': version,
    }
    this.headers = headers
  }

  request(url: string, options: any = {}) {
    options.headers = this.headers

    return HTTP.request(`${GITHUB_BASE_URL}${url}`, options).then((res: any) => res.body)
  }

  getUser(id: any) {
    return this.request(`/user/${id}`)
  }
}
