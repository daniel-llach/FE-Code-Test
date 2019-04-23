import React, { Component } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect, actions } from '../../store'
import _ from 'lodash'
import DrinkCard from '../../components/DrinkCard'

class HomeView extends Component {
  state = {
    page: 0,
    posts: []
  }

  componentDidMount() {
    actions.hidrateCocktails()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cocktails.length > 0 && this.state.page === 0)
      this.addPosts()
  }

  addPosts() {
    const { page } = this.state
    let newPosts = []
    for (let i = page * 20; i < page * 20 + 20; i++) {
      newPosts.push(this.props.cocktails[i])
    }
    this.setState({
      posts: [...this.state.posts, ...newPosts],
      page: page + 1
    })
  }

  render() {
    return (
      <View style={styles.background}>
        <View>
          {this.state.posts.length > 0 ? (
            <FlatList
              data={this.state.posts}
              renderItem={({ item }) => (
                <DrinkCard
                  idDrink={item.idDrink}
                  navigate={this.props.navigation.navigate}
                  strDrink={item.strDrink}
                  strDrinkThumb={item.strDrinkThumb}
                />
              )}
              keyExtractor={item => item.idDrink}
              onEndReached={() => this.addPosts()}
              onEndThreshold={0.001}
            />
          ) : (
            <View style={styles.container}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#18DAD4',
    flex: 1,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  drink: {
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 10,
    borderColor: 'white'
  }
})

const connectedHomeView = connect(({ cocktails }) => ({ cocktails }))(HomeView)
export default connectedHomeView
