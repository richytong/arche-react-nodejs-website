const WindowSetters = require('./WindowSetters')

const PageHtml = function (options) {
  const {
    url,
    reactRootHTML = '<div id="react-root"></div>',
    global,
  } = options

  const globalScript = global == null
    ? ''
    : `<script>${WindowSetters(global)}</script>`

  return `
<!DOCTYPE html>
<html lang="en">

${globalScript}

<head>
  <meta charset="UTF-8">
  <meta http-equiv="status" content="200 OK" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="canonical" href="${url}">

  <script src="https://unpkg.com/react@18.3.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.0/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/arche@1.0.0/index.js"></script>
  <script src="/global.js"></script>

  <link rel="stylesheet" href="/index.css" />
</head>

<body>${reactRootHTML}</body>

<script src="/index.js" type="module"></script>

</html>
  `.trim()
}

module.exports = PageHtml
