'use strict'

const path = require('path')
const t = require('tap')
const commandsNotFound = require('..')

t.test('throws if distro unrecognized', async t => {
  try {
    await commandsNotFound('dig', { distro: 'rocky' })
    throw new Error('Should throw')
  } catch ({ message }) {
    t.equal(message, 'Unrecognized distro: rocky')
  }
})

t.test('throws if command unrecognized', async t => {
  try {
    await commandsNotFound('asd')
    throw new Error('Should throw')
  } catch ({ message }) {
    t.equal(message, 'Command not found: asd')
  }
})

t.test('throws if 1 of the commands is unrecognized', async t => {
  try {
    await commandsNotFound(['dig', 'ncat', 'nmap', 'zzz'])
    throw new Error('Should throw')
  } catch ({ message }) {
    t.equal(message, 'Command not found: zzz')
  }
})

t.test('show install instructions for specific distro', async t => {
  const installCmd = await commandsNotFound('dig', { distro: 'arch' })
  t.equal(installCmd, 'pacman -S bind-tools')
})

t.test('show install instructions for multiple commands on specific distro', async t => {
  const installCmd = await commandsNotFound(['dig', 'ncat', 'nmap'], { distro: 'arch' })
  t.equal(installCmd, 'pacman -S bind-tools nmap')
})

t.test('reads commands from file', async t => {
  const filepath = '@' + path.join(__dirname, 'commands.txt')
  const installCmd = await commandsNotFound(filepath, { distro: 'arch' })
  t.equal(installCmd, 'pacman -S bind-tools nmap socat unbound')
})
