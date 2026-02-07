const stream = require('stream')
const zlib = require('zlib')
const fs = require('fs')
const PageHtml = require('./PageHtml')
const fetch2 = require('./fetch2')

const ServePage = function (options) {
  const {
    htmlServerPort,
    publicCache,
    bypassPublicCache,
  } = options

  return async function servePage(request, response) {
    const url = new URL(request.url, 'http://throwaway');
    const path = decodeURIComponent(url.pathname);


    if (publicCache.has(path)) {
      const { content, contentType } =
        bypassPublicCache
        ? await publicCache.readFile(path)
        : publicCache.get(path)

      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      })
      response.end(content)
    }
    else if (path == '/') {
      const reactRootHTML =
        await fetch2(`http://0.0.0.0:${htmlServerPort}${path}`, {
          method: 'POST',
        }).then(res => res.text())

      const html = PageHtml({
        url: '/',
        reactRootHTML,
        injectedData: {
          myGlobalVariable: 'example',
        },
      })

      response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Encoding': 'gzip',
        'Access-Control-Allow-Origin': '*',
      })
      stream.Readable.from([html]).pipe(zlib.createGzip()).pipe(response)
    }
    else {
      const reactRootHTML =
        await fetch2(`http://0.0.0.0:${htmlServerPort}${path}`, {
          method: 'POST',
        }).then(res => res.text())

      const html = PageHtml({
        url: path,
        reactRootHTML,
      })

      response.writeHead(404, {
        'Content-Type': 'text/html',
        'Content-Encoding': 'gzip',
        'Access-Control-Allow-Origin': '*',
      })
      stream.Readable.from([html]).pipe(zlib.createGzip()).pipe(response)
    }
  }
}

module.exports = ServePage
