#!/usr/bin/env node

const serve = require('./serve')

if (process.argv[1] == __filename) {
  serve({
    port: 4507,
    htmlServerPort: 4508,
    htmlServerNoCache: true,
    bypassPublicCache: true,
  })
}
