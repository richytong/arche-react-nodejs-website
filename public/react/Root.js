import Router from './Router.js'

const clientPath = (
  location.pathname.endsWith('/') && location.pathname != '/'
  ? location.pathname.slice(0, -1)
  : location.pathname
)

const Root = ReactElement((props = {}) => {
  const {
    path: htmlServerPath,
  } = props

  const path = window.ssr ? htmlServerPath : clientPath

  return Router({ path })
})

export default Root
