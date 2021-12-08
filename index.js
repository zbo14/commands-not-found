#!/usr/bin/env node

'use strict'

const axios = require('axios')
const cheerio = require('cheerio')
const getopts = require('getopts')
const os = require('os')

const DISTROS = [
  'alpine',
  'arch',
  'debian',
  'fedora',
  'kali',
  'raspbian',
  'ubuntu'
]

const main = async () => {
  const uname = (os.release() + ' ' + os.version()).toLowerCase()

  let { _: cmds, d: distro = '' } = getopts(process.argv.slice(2), {
    alias: {
      distro: ['d']
    }
  })

  distro = (
    distro.trim().toLowerCase() ||
    DISTROS.find(distro => uname.includes(distro))
  )

  if (!DISTROS.includes(distro)) {
    throw new Error('Unrecognized distro: ' + distro)
  }

  const promises = cmds.map(async cmd => {
    const resp = await axios.get('https://command-not-found.com/' + cmd)
    const $ = cheerio.load(resp.data)

    const el = $('.command-install').filter((_, el) => {
      return distro === $(el)
        .find('dt')
        .text()
        .split('\n')
        .filter(Boolean)
        .pop()
        .trim()
        .toLowerCase()
        .split(' ')
        .shift()
    })

    const installCmd = $(el)
      .find('code')
      .text()
      .trim()

    if (!installCmd) {
      throw new Error('Command not found: ' + cmd)
    }

    return installCmd
  })

  const installCmds = await Promise.all(promises)
  const prefix = installCmds[0].split(' ').slice(0, -1).join(' ')

  const result = [
    prefix,
    ...installCmds.map(cmd => cmd.split(' ').pop())
  ].join(' ')

  console.log(result)
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
