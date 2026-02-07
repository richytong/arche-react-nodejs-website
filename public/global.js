const ReactElement = Arche(React)

window.ReactElement = ReactElement

for (const elementName in ReactElement) {
  window[elementName] = ReactElement[elementName]
}

window.useCallback = React.useCallback
window.useContext = React.useContext
window.useDebugValue = React.useDebugValue
window.useEffect = React.useEffect
window.useImperativeHandle = React.useImperativeHandle
window.useLayoutEffect = React.useLayoutEffect
window.useMemo = React.useMemo
window.useReducer = React.useReducer
window.useRef = React.useRef
window.useState = React.useState
