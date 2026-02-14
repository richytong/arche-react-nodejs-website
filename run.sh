#!/usr/bin/env node

if (process.env.NODE_ENV == null) {
  throw new Error('NODE_ENV required')
}

const package = require('./package.json')
const packageEnv = package.env[process.env.NODE_ENV]
for (const name in packageEnv) {
  process.env[name] = packageEnv[name]
}

const http = require('http')
const { spawn } = require('child_process')
const StaticCache = require('./StaticCache')
const ServePage = require('./ServePage')

const {
  PORT,
  HTML_SERVER_PORT,
  BYPASS_PUBLIC_CACHE,
} = process.env

const run = async function (options) {
  {
    const cmd = spawn('node', [`${__dirname}/html-server/index.mjs`], {
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV,
        PORT: HTML_SERVER_PORT,
      },
    })
    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)

    cmd.on('close', (code, signal) => {
      console.error('HTML Server closed with', code ?? signal)
      process.exit(code)
    })

    cmd.on('error', error => {
      console.error(error)
      process.exit(1)
    })

    process.on('SIGTERM', () => {
      cmd.kill()
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
    if (request.url.startsWith('/health')) {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      })
      response.end('OK')
    } else if (request.method == 'OPTIONS') {
      response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      })
      response.end()
    } else {
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
    }
  })

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

run()
