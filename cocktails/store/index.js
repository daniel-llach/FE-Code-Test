import createStore from 'react-waterfall'
import { AsyncStorage } from 'react-native'
import axios from 'axios'
import _ from 'lodash'

//TODO: put actions and initialState into a separate folders
const config = {
  initialState: {
    cocktails: [],
    drink: {},
    ingredients: []
  },
  actionsCreators: {
    hidrateCocktails: async () => {
      /*The idea is get the big cocktails list
      fist time and then consume it from cache*/

      //TODO: Do a fancy handler for axios and asynctorage logic

      const cocktailsStorage = await AsyncStorage.getItem('cocktails')
      const response = cocktailsStorage
        ? JSON.parse(cocktailsStorage)
        : await axios.get(
            'http://www.thecocktaildb.com/api/json/v1/1/filter.php?g=Cocktail_glass'
          )
      !cocktailsStorage &&
        response &&
        (await AsyncStorage.setItem('cocktails', JSON.stringify(response)))

      return {
        cocktails: _.shuffle(response.data.drinks)
      }
    },
    getDrink: async ({ id }, actions, idDrink) => {
      /*The idea is get every drink detail and put it into cache
      on a instruction "object" (actually is a string on cache)
      where consumed possible multiple times later*/

      //TODO: find a way to remove some data from cache eventually - wich and when

      let drinkDetailStorage = await AsyncStorage.getItem('drinkDetail')
      // convert string cache to an array
      drinkDetailStorage = drinkDetailStorage
        ? JSON.parse(drinkDetailStorage)
        : []

      const drinkStorage = drinkDetailStorage
        ? await _.find(drinkDetailStorage, {
            idDrink: idDrink
          })
        : null

      if (drinkStorage) {
        // if specific drink is on storage save that drink ingredients on state
        return {
          drink: drinkStorage.details
        }
      } else {
        // otherwise get details from endpoint
        const details = await axios.get(
          'http://www.thecocktaildb.com/api/json/v1/1/lookup.php',
          {
            params: {
              i: idDrink
            }
          }
        )

        // handle ingredients
        const ingredients = []
        _.mapKeys(details.data.drinks[0], (value, key) => {
          if (value) {
            key.indexOf('Ingredient') !== -1 &&
              value.length > 0 &&
              ingredients.push(value)
          }
        })
        // handle measures
        const measures = []
        _.mapKeys(details.data.drinks[0], (value, key) => {
          if (value) {
            key.indexOf('Measure') !== -1 &&
              value.length > 2 &&
              measures.push(value)
          }
        })
        // mix measures and ingredients
        const mix = []
        measures.map((m, i) => {
          mix.push(`${m} - ${ingredients[i]}`)
        })

        // put details into storage array
        drinkDetailStorage.push({
          idDrink: idDrink,
          details: { ...details.data.drinks[0], ingredients: mix }
        })
        // save updated ingredients on cache
        await AsyncStorage.setItem(
          'drinkDetail',
          JSON.stringify(drinkDetailStorage)
        )

        return {
          drink: {
            ...details.data.drinks[0],
            ingredients: mix
          }
        }
      }
    }
  }
}

export const { Provider, connect, actions } = createStore(config)
