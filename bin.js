#!/usr/bin/env node

'use strict'

const getopts = require('getopts')
const commandsNotFound = require('.')

const args = process.argv.slice(2)

const {
  _: cmds,
  d: distro = '',
  e: exitOnError = false
} = getopts(args, {
  alias: {
    distro: ['d'],
    'exit-on-error': ['e']
  },

  boolean: ['e']
})

commandsNotFound(cmds, { distro, exitOnError })
  .then(console.log)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
