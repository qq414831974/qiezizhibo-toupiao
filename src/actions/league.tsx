import {bindActionCreators} from 'redux'
import * as league from '../constants/league'
import * as api from '../constants/api'
import store from '../store'
import {createApiAction} from './index'
import Request from '../utils/request'

export const getLeagueReport: any = createApiAction(league.LEAGUE_REPORT, (id: number) => new Request().get(api.API_LEAGUE_REPORT, {leagueId: id}))

export default bindActionCreators({
  getLeagueReport,
}, store.dispatch)
