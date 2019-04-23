import React from 'react'
import { Provider } from './store'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import routes from './routes'

const navigationHeader = {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    title: '🍸',
    headerStyle: {
      backgroundColor: '#18DAD4',
      borderBottomWidth: 0
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontSize: 34
    },
    headerBackTitle: ' '
  }
}

const MainNavigator = createStackNavigator(routes, navigationHeader)
const Navigation = createAppContainer(MainNavigator)

const App = () => (
  <Provider>
    <Navigation />
  </Provider>
)

export default App
