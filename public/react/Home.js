const Home = ReactElement(props => {
  return Div({ id: 'react-root' }, [
    H1('Home'),
    P(MY_GLOBAL_VARIABLE_1),
    P(MY_GLOBAL_VARIABLE_2),
  ])
})

export default Home
