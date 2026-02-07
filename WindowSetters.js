const inspect = require('util').inspect

const WindowSetters = function (data) {
  let result = ''
  for (const key in data) {
    const value = data[key]
    result += `\nwindow[\`${key}\`] = ${inspect(value, { depth: Infinity })}`
  }
  return result
}

module.exports = WindowSetters
