#!/usr/bin/env node

'use strict'

const getopts = require('getopts')
const commandsNotFound = require('.')

const args = process.argv.slice(2)

const { _: cmds, d: distro = '' } = getopts(args, {
  alias: {
    distro: ['d']
  }
})

commandsNotFound(cmds, { distro })
  .then(console.log)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
