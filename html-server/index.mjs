import http from 'http'
import ReadableText from './ReadableText.js'
import getRootHtml from './getRootHtml.mjs'
import { execFile } from 'child_process'
import cluster from 'cluster'
import os from 'os'

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(`http://throwaway${request.url}`)
    const text = await ReadableText(request)
    const data = text ? JSON.parse(text) : {}
    const { global = {} } = data

    const html = await new Promise(resolve => {
      let output = ''
      const cmd = execFile('node', [`${import.meta.dirname}/logRootHtml.mjs`], {
        env: {
          ...process.env,
          global: JSON.stringify(global),
          url: request.url,
        },
      })
      cmd.stdin.write(JSON.stringify({ global, url: request.url }))
      cmd.stdin.end()
      cmd.stdout.on('data', buf => {
        output += buf.toString('utf8')
      })
      cmd.stderr.pipe(process.stderr)
      cmd.on('close', code => {
        resolve(output)
      })
    })

    if (html == '') {
      throw new Error('bad html')
    }

    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/html',
    })
    response.end(html)
  } catch (error) {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    })
    console.error(error)
    response.end(error.message)
  }
})

const port = process.env.PORT ?? 3000

if (cluster.isMaster) {
  const totalCPUs = os.cpus().length
  console.log(`Number of CPUs is ${totalCPUs}`)
  console.log(`Master ${process.pid} is running`)

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died; forking another worker`)
    cluster.fork()
  })
} else {
  server.listen(port, async () => {
    console.log('Worker', process.pid, 'HTML Server listening on port', port)
  })
}
