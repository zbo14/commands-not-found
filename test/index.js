'use strict'

const path = require('path')
const t = require('tap')
const commandsNotFound = require('..')

t.beforeEach(() => {
  t.context.err = null
  t.context.errCount = 0

  console.error = err => {
    t.context.err = err
    ++t.context.errCount
  }
})

t.test('throws if distro unrecognized', async t => {
  try {
    await commandsNotFound('dig', { distro: 'rocky' })
    throw new Error('Should throw')
  } catch ({ message }) {
    t.equal(message, 'Unrecognized distro: rocky')
  }
})

t.test('logs if command unrecognized', async t => {
  const installCmd = await commandsNotFound('asd')

  t.equal(installCmd, '')
  t.assert(t.context.err instanceof Error)
  t.equal(t.context.err.message, 'Command not found: asd')
  t.equal(t.context.errCount, 1)
})

t.test('throws if command unrecognized', async t => {
  try {
    await commandsNotFound('asd', { exitOnError: true })
    throw new Error('Should throw')
  } catch ({ message }) {
    t.equal(message, 'Command not found: asd')
  }
})

t.test('throws if 1 of the commands is unrecognized', async t => {
  try {
    await commandsNotFound(['dig', 'ncat', 'nmap', 'zzz'], { exitOnError: true })
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

t.test('logs if 1 of the commands is unrecognized', async t => {
  const installCmd = await commandsNotFound(
    ['dig', 'ncat', 'nmap', 'zzz'],
    { distro: 'arch' }
  )

  t.equal(installCmd, 'pacman -S bind-tools nmap')
  t.assert(t.context.err instanceof Error)
  t.equal(t.context.err.message, 'Command not found: zzz')
  t.equal(t.context.errCount, 1)
})

t.test('reads commands from file', async t => {
  const filepath = '@' + path.join(__dirname, 'commands.txt')
  const installCmd = await commandsNotFound(filepath, { distro: 'arch' })
  t.equal(installCmd, 'pacman -S bind-tools nmap socat unbound')
})
