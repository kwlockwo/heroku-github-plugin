import {expect, test} from '@oclif/test'

describe('github:push', () => {
  const herokuApiUrl = 'https://api.heroku.com'
  const kolkrabbiApiUrl = 'https://kolkrabbi.heroku.com'
  const buildOutputUrl = 'https://build-output.heroku.com'

  const build = {
    build: {
      id: '11111111-aaaa-2222-cccccccccccc',
      status: 'pending',
      output_stream_url: `${buildOutputUrl}/output`,
      created_at: '2021-01-01T00:00:00Z',
    },
  }

  const buildOutputContent = '==== Build Output ===='

  const app = {
    name: 'test-app',
    id: '99999999-ffff-8888-eeeeeeeeeeee',
  }

  const goodBranch = 'main'
  const badBranch = 'foo'

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get(`/apps/${app.name}`)
    .reply(200, app)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .post(`/apps/${app.id}/github/push`, {
      branch: goodBranch,
    })
    .reply(202, build)
  })
  .nock(`${buildOutputUrl}`, buildOutput => {
    buildOutput
    .get('/output')
    .reply(200, buildOutputContent)
  })
  .command(['github:push', goodBranch, '-a', app.name])
  .exit(0)
  .it('github push with valid branch', ctx => {
    expect(ctx.stderr).to.contain(`Pushing branch: ${goodBranch} to ${app.name}... done`)
    expect(ctx.stderr).to.contain(`${buildOutputContent}`)
  })

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get(`/apps/${app.name}`)
    .reply(200, app)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .post(`/apps/${app.id}/github/push`, {
      branch: badBranch,
    })
    .reply(404)
  })
  .command(['github:push', badBranch, '-a', app.name])
  .exit(1)
  .it('github push with invalid branch', ctx => {
    expect(ctx.stderr).to.contain(
      `Pushing branch: ${badBranch} to ${app.name}... unable to access GitHub repository or branch`
    )
  })

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get(`/apps/${app.name}`)
    .reply(200, app)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .post(`/apps/${app.id}/github/push`, {
      branch: badBranch,
    })
    .reply(500)
  })
  .command(['github:push', badBranch, '-a', app.name])
  .exit(1)
  .it('github push unknown error', ctx => {
    expect(ctx.stderr).to.contain(`Pushing branch: ${badBranch} to ${app.name}... unknown error`)
  })
})
