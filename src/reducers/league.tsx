import {
  LEAGUE_REPORT
} from '../constants/league'

type PropsType = {
  leagueReport: any;
}
const INITIAL_STATE = {
  leagueReport: {},
}

export default function league(state: PropsType = INITIAL_STATE, action) {
  switch (action.type) {
    case LEAGUE_REPORT:
      return {
        ...state,
        leagueReport: action.payload
      }
    default:
      return state
  }
}
