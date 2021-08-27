import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import cli from 'cli-ux'

import KolkrabbiAPI from '../../lib/kolkrabbi-api'
import GitHubAPI from '../../lib/github-api'

export default class GithubWhoami extends Command {
  static description = 'Display your linked GitHub account'

  static examples = [
    '$ heroku github:whoami',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    if (process.env.HEROKU_API_KEY) this.warn('HEROKU_API_KEY is set')
    const {body: account} = await this.heroku.get<Heroku.Account>('/account')

    const kolkrabbi = new KolkrabbiAPI(this.config.userAgent, process.env.HEROKU_HEADERS, () => this.heroku.auth)
    const kolkrabbiRes = await kolkrabbi.getAccount()
    .catch(error => {
      if (error.statusCode !== 404) {
        cli.error('Unknown error fetching linked GitHub account', {exit: 1})
      }
    })

    if (kolkrabbiRes === undefined) {
      cli.info('Heroku account not linked to GitHub')
    } else {
      const github = new GitHubAPI(this.config.userAgent, () => kolkrabbiRes.github.token)
      const gitHubRes = await github.getUser(kolkrabbiRes.github.user_id)
      .catch(error => {
        if (error.statusCode === 404) {
          cli.error('GitHub user not found', {exit: 1})
        } else {
          cli.error('Unknown error calling GitHub', {exit: 1})
        }
      })

      const whoami = [{
        heroku: account.email,
        github: gitHubRes.login,
      }]

      cli.table(whoami, {
        heroku: {
          header: 'Heroku User',
        },
        github: {
          header: 'GitHub User',
        },
      })
    }
  }
}
