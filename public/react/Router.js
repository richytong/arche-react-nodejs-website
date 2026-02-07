import Home from './Home.js'
import NotFound from './NotFound.js'

const Router = ReactElement(props => {
  const { path } = props

  if (path == '/') {
    return Home(props)
  }

  return NotFound(props)
})

export default Router
