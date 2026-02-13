import Router from './Router.js'

const Root = ReactElement(() => {
  const path =
    location.pathname.endsWith('/') && location.pathname != '/'
    ? location.pathname.slice(0, -1)
    : location.pathname

  return Router({ path })
})

export default Root
