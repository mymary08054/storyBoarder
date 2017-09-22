import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_CARD = 'GET_CARD'
const REMOVE_CARD = 'REMOVE_CARD'

/**
 * INITIAL STATE
 */
const defaultCard = {}

/**
 * ACTION CREATORS
 */
const getCard = card => ({type: GET_CARD, card})
const removeCard = () => ({type: REMOVE_CARD})

/**
 * THUNK CREATORS
 */
export const me = () =>
  dispatch =>
    axios.get('/auth/me')
      .then(res =>
        dispatch(getCard(res.data || defaultCard)))
      .catch(err => console.log(err))

export const auth = (email, password, method) =>
  dispatch =>
    axios.post(`/auth/${method}`, { email, password })
      .then(res => {
        dispatch(getCard(res.data))
        history.push('/home')
      })
      .catch(error =>
        dispatch(getCard({error})))

export const logout = () =>
  dispatch =>
    axios.post('/auth/logout')
      .then(res => {
        dispatch(removeCard())
        history.push('/login')
      })
      .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = defaultCard, action) {
  switch (action.type) {
    case GET_CARD:
      return action.card
    case REMOVE_CARD:
      return defaultCard
    default:
      return state
  }
}
