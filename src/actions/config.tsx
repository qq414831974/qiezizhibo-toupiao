import {bindActionCreators} from 'redux'
import * as config from '../constants/config'
import * as api from '../constants/api'
import store from '../store'
import {createAction, createApiAction} from './index'
import Request from '../utils/request'

export const setPayEnabled: any = createAction(config.CONFIG_PAY_ENABLED)
export const setGiftEnabled: any = createAction(config.CONFIG_GIFT_ENABLED)
export const getShareSentence: any = createApiAction(config.CONFIG_GET_SHARE_SENTENCE, () => new Request().get(api.API_GET_SHARE_SENTENCE, {}))
export const getExpInfo: any = createApiAction(config.CONFIG_EXP, () => new Request().get(api.API_SYS_EXP, {}))

export default bindActionCreators({
  setPayEnabled,
  setGiftEnabled,
  getShareSentence,
  getExpInfo
}, store.dispatch)
