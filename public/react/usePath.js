import useGlobalState from './useGlobalState.js'

// usePath() -> [path string, setter function]
const usePath = function (propsPath) {
  const defaultPath = propsPath ?? (
    location.pathname.endsWith('/') && location.pathname != '/'
    ? location.pathname.slice(0, -1)
    : location.pathname
  )
  const [path, setPath] = useGlobalState('path', defaultPath)

  const setter = (value, options = {}) => {
    let clean = value
    if (value.endsWith('/') && value != '/') {
      clean = value.slice(0, -1)
    }

    setPath(clean)
    if (options.ignoreHistory) {
      // noop
    } else if (options.replace) {
      history.replaceState({
        path: clean,
        prevPath: path,
      }, null, clean)
    } else {
      history.pushState({
        path: clean,
        prevPath: path,
      }, null, clean)
    }
  }

  return [path, setter]
}

export default usePath
