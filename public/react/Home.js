const Home = ReactElement(props => {
  return Div({ id: 'react-root' }, [
    H1('Home'),
    P(myGlobalVariable1),
    P(myGlobalVariable2),
  ])
})

export default Home
