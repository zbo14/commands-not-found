# commands-not-found

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

A CLI that shows install instructions for unrecognized commands across several Linux distributions.

Results are pulled from [command-not-found](https://command-not-found.com). In addition, `commands-not-found` supports querying multiple commands concurrently (see examples).

## Install

`npm i commands-not-found`

## Usage

**Tip:** create a shell alias (e.g. `cnf`) for `commands-not-found` to save keystrokes.

**Show install instructions for command on your distro:**

`commands-not-found dig`

output: "apt-get install knot-dnsutils" (on Ubuntu)

**Show install instructions for command on specific distro:**

`commands-not-found -d arch dig` or `commands-not-found --distro arch dig`

output: "pacman -S bind-tools"

*Supported distros:*

* alpine
* arch
* debian
* fedora
* kali
* raspbian
* ubuntu

**Show install instructions for multiple commands:**

`commands-not-found -d arch dig ncat nmap`

output: "pacman -S bind-tools nmap" (`ncat` is part of `nmap`)

## Test

`npm test`

**Note:** the test suite makes actual requests to [command-not-found](https://command-not-found.com).

## Lint

`npm run lint` or `npm run lint:fix`

## License

Licensed under [MIT](./LICENSE).
