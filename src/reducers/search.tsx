import {
  SEARCH_LEAGUE, SEARCH_LEAGUE_ADD, SEARCH_CLEAR_ALL
} from '../constants/search'

type PropsType = {
  league: any;
}

const INITIAL_STATE = {
  league: {},
}

export default function search(state: PropsType = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_LEAGUE:
      return {
        ...state,
        league: action.payload.league
      }
    case SEARCH_LEAGUE_ADD:
      if(action.payload.league == null){
        return state;
      }
      const leaguelist = state.league.records.concat(action.payload.league.records);
      action.payload.league.records = leaguelist;
      return {
        ...state,
        league: action.payload.league
      }
    case SEARCH_CLEAR_ALL:
      return {
        ...state,
        league: {}
      }
    default:
      return state
  }
}
