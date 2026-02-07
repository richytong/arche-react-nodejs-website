import getRootHtml from './getRootHtml.mjs'

let input = ''
process.stdin.on('data', s => {
  input += s
})

process.stdin.on('close', () => {
  const data = JSON.parse(input)
  const html = getRootHtml(data)
  console.log(html)
  process.exit()
})
