import {expect, test} from '@oclif/test'

describe('github:whoami', () => {
  const herokuApiUrl = 'https://api.heroku.com'
  const kolkrabbiApiUrl = 'https://kolkrabbi.heroku.com'
  const githibApiUrl = 'https://api.github.com'

  const account = {
    id: '11111111-aaaa-2222-cccccccccccc',
    email: 'test@heroku.com',
  }

  const kolkrabbiAccount = {
    id: '99999999-ffff-8888-eeeeeeeeeeee',
    github: {
      user_id: 123456,
      token: 'aaaabbbbccccddddeeeeffff1111222233334444',
    },
  }

  const githubUser = {
    login: 'test',
    id: 123456,
  }

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get('/account')
    .reply(200, account)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .get('/account/github/token')
    .reply(200, kolkrabbiAccount)
  })
  .nock(`${githibApiUrl}`, buildOutput => {
    buildOutput
    .get(`/user/${kolkrabbiAccount.github.user_id}`)
    .reply(200, githubUser)
  })
  .command('github:whoami')
  .it('whoami with valid user', ctx => {
    expect(ctx.stdout).to.contain('Heroku User')
    expect(ctx.stdout).to.contain('GitHub User')
    expect(ctx.stdout).to.contain(`${account.email}`)
    expect(ctx.stdout).to.contain(`${githubUser.login}`)
  })

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get('/account')
    .reply(200, account)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .get('/account/github/token')
    .reply(404)
  })
  .command('github:whoami')
  .it('whoami with no linked GitHub account', ctx => {
    expect(ctx.stdout).to.contain('Heroku account not linked to GitHub')
  })

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get('/account')
    .reply(200, account)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .get('/account/github/token')
    .reply(500)
  })
  .command('github:whoami')
  .catch('Unknown error fetching linked GitHub account')
  .it('whoami with unknown error from Kolkrabbi')

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get('/account')
    .reply(200, account)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .get('/account/github/token')
    .reply(200, kolkrabbiAccount)
  })
  .nock(`${githibApiUrl}`, buildOutput => {
    buildOutput
    .get(`/user/${kolkrabbiAccount.github.user_id}`)
    .reply(404)
  })
  .command('github:whoami')
  .catch('GitHub user not found')
  .it('whoami with linked GitHub account not found')

  test
  .stdout()
  .stderr()
  .nock(`${herokuApiUrl}`, api => {
    api
    .get('/account')
    .reply(200, account)
  })
  .nock(`${kolkrabbiApiUrl}`, kolkrabbi => {
    kolkrabbi
    .get('/account/github/token')
    .reply(200, kolkrabbiAccount)
  })
  .nock(`${githibApiUrl}`, buildOutput => {
    buildOutput
    .get(`/user/${kolkrabbiAccount.github.user_id}`)
    .reply(500)
  })
  .command('github:whoami')
  .catch('Unknown error calling GitHub')
  .it('whoami with linked GitHub account returning unknown error')
})
