/**
 * @name ContentType
 *
 * @synopsis
 * ```coffeescript [specscript]
 * ContentType(filepath string, content string) -> contentType string
 * ```
 */
function ContentType(filepath, content) {
  const line1 = content.split('\n')
  if (line1.includes('<!DOCTYPE html>')) {
    return 'text/html'
  }

  const extension = filepath.split('.').slice(-1)[0]
  switch (extension) {
    case 'webmanifest':
      return 'application/manifest+json'
    case 'json':
      return 'application/json'
    case 'svg':
      return 'image/svg+xml'
    case 'js':
      return 'text/javascript'
    case 'html':
      return 'text/html'
    case 'css':
      return 'text/css'
    case 'gif':
      return 'image/gif'
    case 'jpg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'ttf':
      return 'font/ttf'
    case 'ico':
      return 'image/x-icon'
    case 'mp3':
      return 'audio/mpeg'
    case 'mp4':
      return 'video/mp4'
    case 'xml':
      return 'text/xml'
    case 'txt':
      return 'text/plain'
    default:
      throw new Error(`unrecognized extension ${extension}`)
  }
}

module.exports = ContentType
