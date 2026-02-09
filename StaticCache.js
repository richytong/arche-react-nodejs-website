const fs = require('fs')
const ContentType = require('./ContentType')
const walk = require('./walk')

class StaticCache {
  constructor(options) {
    this.directory = options.directory
    this.cache = new Map()
  }

  async load() {
    for await (const filename of walk(this.directory)) {
      const buffer = await fs.promises.readFile(filename)
      const url = filename.replace(this.directory, '/').replace(/\/\//g, '/')
      const ext = filename.split('.').slice(-1)[0]
      this.cache.set(url, {
        content: buffer,
        contentType: ContentType(ext, buffer.toString('utf8')),
      })
    }
  }

  has(...args) {
    return this.cache.has(...args)
  }

  get(...args) {
    return this.cache.get(...args)
  }

  async isReadableFile(url) {
    const filename = `${this.directory}/${url}`.replace(/\/\//g, '/')
    try {
      const dirent = await fs.promises.stat(filename)
      return !dirent.isDirectory()
    } catch (error) {
      if (error.code == 'ENOENT') {
        return false
      }
      throw error
    }
  }

  async readFile(url) {
    const filename = `${this.directory}/${url}`.replace(/\/\//g, '/')
    const ext = filename.split('.').slice(-1)[0]
    const buffer = await fs.promises.readFile(filename)
    return {
      content: buffer,
      contentType: ContentType(ext, buffer.toString('utf8')),
    }
  }
}

module.exports = StaticCache
