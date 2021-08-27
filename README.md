heroku-github-plugin
====================

A Heroku CLI plugin for GitHub intergration

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/heroku-github-plugin.svg)](https://npmjs.org/package/heroku-github-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/heroku-github-plugin.svg)](https://npmjs.org/package/heroku-github-plugin)
[![License](https://img.shields.io/npm/l/heroku-github-plugin.svg)](https://github.com/kwlockwo/heroku-github-plugin/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g heroku-github-plugin
$ heroku COMMAND
running command...
$ heroku (-v|--version|version)
heroku-github-plugin/0.1.0 darwin-x64 node-v12.21.0
$ heroku --help [COMMAND]
USAGE
  $ heroku COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`heroku github:push [BRANCH]`](#heroku-githubpush-branch)
* [`heroku github:whoami`](#heroku-githubwhoami)

## `heroku github:push [BRANCH]`

Push a branch from the connected GitHub repo

```
USAGE
  $ heroku github:push [BRANCH]

OPTIONS
  -a, --app=app  (required) app to run command against
  -h, --help     show CLI help

EXAMPLE
  $ heroku github:push main -a my-app
```

_See code: [src/commands/github/push.ts](https://github.com/kwlockwo/heroku-github-plugin/blob/v0.1.0/src/commands/github/push.ts)_

## `heroku github:whoami`

Display your linked GitHub account

```
USAGE
  $ heroku github:whoami

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ heroku github:whoami
```

_See code: [src/commands/github/whoami.ts](https://github.com/kwlockwo/heroku-github-plugin/blob/v0.1.0/src/commands/github/whoami.ts)_
<!-- commandsstop -->
