import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import cli from 'cli-ux'
import got from 'got'

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

    const app = (await this.heroku.get<Heroku.App>(`/apps/${appNameOrId}`)).body

    const kolkrabbi = new KolkrabbiAPI(this.config.userAgent, () => this.heroku.auth)

    cli.action.start(`Pushing branch: ${branch} to ${appNameOrId}`)
    const build = (await kolkrabbi.githubPush(app.id, branch).catch(error => {
      if (error.statusCode === 404) {
        cli.action.stop('unable to access GitHub repository or branch')
      } else {
        cli.action.stop('unknown error')
      }
      cli.exit(1)
    })).build
    cli.action.stop()

    return new Promise(function (resolve, reject) {
      const stream = got.stream(build.output_stream_url)
      stream.on('error', reject)
      stream.on('end', resolve)
      stream.pipe(process.stderr)
    })
  }
}
