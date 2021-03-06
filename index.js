'use strict'

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
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

const URL_PREFIX = 'https://command-not-found.com/'

module.exports = async (cmds, {
  distro = '',
  exitOnError = false
} = {}) => {
  cmds = [].concat(cmds)
  const uname = (os.release() + ' ' + os.version()).toLowerCase()

  distro = (
    distro.trim().toLowerCase() ||
    DISTROS.find(distro => uname.includes(distro))
  )

  if (!DISTROS.includes(distro)) {
    throw new Error('Unrecognized distro: ' + distro)
  }

  if (cmds[0][0] === '@') {
    const data = await fs.promises.readFile(cmds[0].slice(1), 'utf8')
    cmds = data.split('\n').filter(Boolean)
  }

  const promises = cmds.map(async cmd => {
    const resp = await axios.get(URL_PREFIX + cmd)
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

    if (installCmd) return installCmd

    const err = new Error('Command not found: ' + cmd)

    if (exitOnError) {
      throw err
    }

    console.error(err)
  })

  const installCmds = (await Promise.all(promises)).filter(Boolean)

  if (!installCmds.length) return ''

  const prefix = installCmds[0].split(' ').slice(0, -1).join(' ')
  const uniqueCmds = new Set(installCmds.map(cmd => cmd.split(' ').pop()))
  const result = [prefix, ...uniqueCmds].join(' ')

  return result
}
