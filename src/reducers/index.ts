import {combineReducers} from 'redux'
import user from './user'
import config from './config'
import search from './search'
import league from './league'
import pay from './pay'
import deposit from './deposit'

export default combineReducers({
  user,
  config,
  search,
  league,
  pay,
  deposit,
})
