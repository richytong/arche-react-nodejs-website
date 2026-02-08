#!/usr/bin/env node

if (process.env.NODE_ENV == null) {
  throw new Error('NODE_ENV required')
}

require('rubico/global')
const http = require('http')
const { spawn } = require('child_process')
const StaticCache = require('./StaticCache')
const ServePage = require('./ServePage')
const {
  PORT,
  HTML_SERVER_PORT,
  HTML_SERVER_NO_CACHE,
  BYPASS_PUBLIC_CACHE,
} = require('./package.json').env[process.env.NODE_ENV]

const run = async function (options) {
  {
    const cmd = spawn('node', [`${__dirname}/html-server/index.mjs`], {
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV,
        PORT: HTML_SERVER_PORT,
        NO_CACHE: HTML_SERVER_NO_CACHE,
      },
    })
    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)

    cmd.on('close', code => {
      console.error('HTML Server closed with code', code)
      process.exit(code)
    })

    cmd.on('error', error => {
      console.error(error)
      process.exit(1)
    })

    process.on('exit', () => {
      cmd.kill()
    })
  }

  const publicCache = new StaticCache({
    directory: `${__dirname}/public`,
  });
  await publicCache.load()

  const servePage = ServePage({
    htmlServerPort: HTML_SERVER_PORT,
    publicCache,
    bypassPublicCache: BYPASS_PUBLIC_CACHE,
  })

  const server = http.createServer(async (request, response) => {
    await servePage(request, response).catch(error => {
      console.error(error)
      if (typeof error.code != 'number') {
        error.code = 500
      }
      response.writeHead(error.code, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      })
      response.end(error.message)
    })
  })

  server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
  })
}

run()
