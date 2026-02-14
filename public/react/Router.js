import Home from './Home.js'
import NotFound from './NotFound.js'

const path =
  location.pathname.endsWith('/') && location.pathname != '/'
  ? location.pathname.slice(0, -1)
  : location.pathname

const Router = ReactElement(props => {
  if (path == '/') {
    return Home(props)
  }
  return NotFound(props)
})

export default Router
