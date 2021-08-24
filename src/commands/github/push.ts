import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import cli from 'cli-ux'

import KolkrabbiAPI from '../../lib/kolkrabbi-api'

export default class GithubPush extends Command {
  static description = 'Push a branch from the connected GitHub repo'

  static examples = [
    '$ heroku github:push main -a my-app',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    app: flags.app({
      required: true,
    }),
  }

  static args = [
    {
      name: 'branch',
      default: 'main',
    },
  ]

  async run() {
    const {args, flags} = this.parse(GithubPush)
    const appNameOrId = flags.app
    const branch = args.branch

    const response = await this.heroku.get<Heroku.App>(`/apps/${appNameOrId}`)
    const appId = response.body.id

    const kolkrabbi = new KolkrabbiAPI(this.config.userAgent, () => this.heroku.auth)

    cli.action.start('Linking to repo')
    kolkrabbi.githubPush(appId, branch)
    cli.action.stop()
  }
}
