#!/usr/bin/env node

process.env.NODE_ENV = 'test'

const package = require('./package.json')
const packageEnv = package.env[process.env.NODE_ENV]
for (const name in packageEnv) {
  process.env[name] = packageEnv[name]
}

const AwsCredentials = require('presidium/AwsCredentials')
const SecretsManager = require('presidium/SecretsManager')
const HTTP = require('presidium/HTTP')
const Readable = require('presidium/Readable')
const Secrets = require('presidium/Secrets')
const crypto = require('crypto')
const assert = require('assert')
const fs = require('fs')
const zlib = require('zlib')
const { spawn } = require('child_process')
const AWSConfig = require('../AWSConfig.json')

const {
  NODE_ENV,
  PORT,
  HTML_SERVER_PORT,
  MY_GLOBAL_VARIABLE_1,
  MY_GLOBAL_VARIABLE_2,
} = process.env

async function test() {
  const cmd = spawn(`${__dirname}/run.sh`)
  cmd.stdout.pipe(process.stdout)
  cmd.stderr.pipe(process.stderr)

  process.on('exit', () => {
    cmd.kill('SIGTERM')
  })

  const exitPromiseWithResolvers = Promise.withResolvers()
  cmd.on('exit', code => {
    if (code == null || code == 0) {
      console.log('Success')
      exitPromiseWithResolvers.resolve()
    } else {
      exitPromiseWithResolvers.reject(new Error('Failure'))
    }
  })

  const serverListeningPromiseWithResolvers = Promise.withResolvers()
  cmd.stdout.on('data', chunk => {
    const line = chunk.toString('utf8').trim()
    if (line == `Server listening on port ${PORT}`) {
      serverListeningPromiseWithResolvers.resolve()
    }
  })

  const htmlServerListeningPromiseWithResolvers = Promise.withResolvers()
  cmd.stdout.on('data', chunk => {
    const line = chunk.toString('utf8').trim()
    if (line.endsWith(`HTML server listening on port ${HTML_SERVER_PORT}`)) {
      htmlServerListeningPromiseWithResolvers.resolve()
    }
  })

  await serverListeningPromiseWithResolvers.promise
  await htmlServerListeningPromiseWithResolvers.promise

  const http = new HTTP(`http://localhost:${PORT}`)

  { // health check
    const response = await http.GET('/health')
    assert.equal(response.status, 200)
    assert.equal(await Readable.Text(response), 'OK')
  }

  { // options
    const response = await http.OPTIONS('/')
    assert.equal(response.status, 204)
    assert.equal(await Readable.Text(response), '')
  }

  { // home
    const response = await http.GET('/')
    assert.equal(response.headers['content-type'], 'text/html')
    assert.equal(response.headers['content-encoding'], 'gzip')
    assert.equal(response.status, 200)
  }

  { // not found
    const response = await http.GET('/not-found')
    assert.equal(response.status, 404)
  }

  cmd.kill('SIGTERM')

  await exitPromiseWithResolvers.promise
}

test()
