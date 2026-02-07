const fetch = require('node-fetch')
const sleep = require('./sleep')

/**
 * @name fetch2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * fetch2(...args) -> Promise<Response>
 * ```
 */
const fetch2 = async function (...args) {
  try {
    const response = await fetch(...args)
    if (response.ok) {
      return response
    }
    console.error(await response.text())
    await sleep(100)
    return fetch2(...args)
  } catch (error) {
    console.error(error)
    await sleep(100)
    return fetch2(...args)
  }
}

module.exports = fetch2
