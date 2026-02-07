import http from 'http'
import getRootHtml from './getRootHtml.mjs'
import { spawn } from 'child_process'
import cluster from 'cluster'
import os from 'os'

const env = process.env.NODE_ENV
const nocache = process.env.NO_CACHE == '1' || process.env.NO_CACHE == 'true'

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(`http://throwaway${request.url}`)
    const path = decodeURIComponent(url.pathname)

    const html =
      nocache
      ? await new Promise(resolve => {
        let output = ''
        const cmd = spawn('node', [`${import.meta.dirname}/logRootHtml.mjs`], {
          stdio: ['pipe', 'pipe', process.stderr],
        })
        cmd.stdin.write(JSON.stringify({ path }))
        cmd.stdin.end()
        cmd.stdout.on('data', buf => {
          output += buf.toString('utf8')
        })
        cmd.on('close', code => {
          resolve(output)
        })
      })
      : await getRootHtml({ path })

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
