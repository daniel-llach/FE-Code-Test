import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AsyncStorage } from 'react-native'
import axios from 'axios'
import _ from 'lodash'
import { actions } from '../../store'

class DrinkCard extends Component {
  /*
    look ingredients on cache and if not on cache
    get from directly from end point.

    *the ideal is to handle this from actions of
    the storage but it need more time to avoid to
    enter into an infinite loop when you update the global
    storage that update the flatlist props that update
    each DrinkCard that execute the action again and so on...
    so for simplicity I prefered this solution for this exercise
  */

  state = {
    ingredients: []
  }

  componentDidMount() {
    this.getIngredients()
  }

  async getIngredients() {
    // check if exist ingredients for that drink on localstorage
    let cocktailsStorage = await AsyncStorage.getItem('ingredients')
    // convert string cache to an array
    cocktailsStorage = cocktailsStorage ? JSON.parse(cocktailsStorage) : []

    const drinkFromStorage = cocktailsStorage
      ? await _.find(cocktailsStorage, {
          idDrink: this.props.idDrink
        })
      : null

    if (drinkFromStorage) {
      // if specific drink is on storage save that drink ingredients on state
      if (drinkFromStorage) {
        this.setState({ ingredients: drinkFromStorage.list })
      }
    } else {
      // otherwise get ingredients from endpoint
      const drink = await axios.get(
        'http://www.thecocktaildb.com/api/json/v1/1/lookup.php',
        {
          params: {
            i: this.props.idDrink
          }
        }
      )
      const ingredients = []
      _.mapKeys(drink.data.drinks[0], (value, key) => {
        if (value) {
          key.indexOf('Ingredient') !== -1 &&
            value.length > 0 &&
            ingredients.push(value)
        }
      })

      // put drink ingredients into storage array
      cocktailsStorage.push({
        idDrink: this.props.idDrink,
        list: ingredients
      })
      // save updated ingredients on cache
      await AsyncStorage.setItem(
        'ingredients',
        JSON.stringify(cocktailsStorage)
      )
      // and save on state
      this.setState({ ingredients: ingredients })
    }
  }

  render() {
    const { idDrink, navigate, strDrink, strDrinkThumb } = this.props
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigate('Drink', {
            id: idDrink,
            name: strDrink
          })
        }
      >
        <Text style={styles.title} numberOfLines={1}>
          {strDrink}
        </Text>
        <View style={styles.content}>
          <Image
            source={{ uri: strDrinkThumb }}
            style={styles.image}
            type="center"
          />
        </View>
        <View style={styles.ingredients}>
          {this.state.ingredients.length > 0 ? (
            this.state.ingredients.map(
              (item, index) =>
                index < 2 ? (
                  <Text key={`${idDrink}-${index}`}>· {item} </Text>
                ) : index == 2 ? (
                  <Text
                    key={`${idDrink}-${index}`}
                    style={{ marginLeft: 8, color: 'gray', marginTop: 5 }}
                  >
                    and {this.state.ingredients.length - 2} more item{this.state
                      .ingredients.length -
                      2 >
                    1
                      ? 's'
                      : null}
                  </Text>
                ) : null
            )
          ) : (
            <Text>finding ingredients...</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 8,
    margin: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    minHeight: 350,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  image: {
    width: '100%',
    height: 380
  },
  ingredients: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    width: '100%'
  },
  title: {
    width: '95%',
    fontSize: 30,
    marginBottom: 10,
    paddingBottom: 5,
    paddingTop: 15,
    paddingLeft: 10,
    color: '#FF00BD'
  }
})

export default DrinkCard
