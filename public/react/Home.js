const Home = ReactElement(props => {
  return Div({ id: 'react-root' }, [
    H1('Home'),
    P(myGlobalVariable),
  ])
})

export default Home
