import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import _ from 'lodash'
import { connect, actions } from '../../store'

class DrinkView extends Component {
  componentDidMount() {
    actions.getDrink(this.props.navigation.getParam('id'))
  }

  render() {
    const name = this.props.navigation.getParam('name')
    const { strDrinkThumb, ingredients, strInstructions } = this.props.drink

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <ScrollView>
          <Image
            source={{ uri: strDrinkThumb }}
            style={styles.image}
            type="cover"
          />
          <View style={styles.ingredients}>
            {ingredients
              ? ingredients.map((ingredient, i) => (
                  <Text key={`ing-${i}`} style={styles.ingredient}>
                    {ingredient}
                  </Text>
                ))
              : null}
          </View>
          <Text style={styles.howTo}>How to prepare</Text>
          <Text style={styles.instructions}>{strInstructions}</Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0
  },
  howTo: {
    width: '95%',
    fontSize: 30,
    marginBottom: 10,
    paddingBottom: 5,
    paddingTop: 8,
    marginLeft: 20
  },
  image: {
    width: '100%',
    height: 400
  },
  ingredient: {
    fontSize: 16,
    margin: 2
  },
  ingredients: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    width: '100%'
  },
  instructions: {
    fontSize: 18,
    margin: 20,
    marginTop: 0,
    marginBottom: 100
  },
  title: {
    width: '95%',
    fontSize: 30,
    padding: 20,
    color: '#FF00BD'
  }
})

const connectedDrinkView = connect(({ drink }) => ({ drink }))(DrinkView)
export default connectedDrinkView
