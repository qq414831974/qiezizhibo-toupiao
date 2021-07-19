import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Component} from 'react'
import {View, Image} from '@tarojs/components'
import {AtActivityIndicator} from "taro-ui"
import defaultLogo from '../../assets/default-logo.png'

import './series.scss'
import LeagueItem from "../../components/league-item";
import withShare from "../../utils/withShare";
import NavBar from "../../components/nav-bar";
import Request from "../../utils/request";
import * as api from "../../constants/api";

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  loadingmore: boolean;
  loading: boolean;
  leagueList: any;
  league: any;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Series {
  props: IProps;
}

@withShare({})
class Series extends Component<IProps, PageState> {
  navRef: any = null;

  constructor(props) {
    super(props)
    this.state = {
      loadingmore: false,
      loading: false,
      leagueList: {},
      league: {},
    }
  }

  $setSharePath = () => `/pages/home/home?id=${this.getParamId()}&page=series`

  componentWillMount() {
  }

  componentDidMount() {
    this.getParamId() && this.getLeagueList(this.getParamId());
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    console.log("componentDidShow")
  }

  componentDidHide() {
  }

  getParamId = () => {
    let id;
    const router = getCurrentInstance().router;
    if (router && router.params) {
      if (router.params.id == null) {
        id = router.params.scene
      } else {
        id = router.params.id
      }
    } else {
      return null;
    }
    return id;
  }
  onLeagueItemClick = (item) => {
    if (item.isParent) {
      Taro.navigateTo({url: `../series/series?id=${item.id}`});
    } else {
      Taro.navigateTo({url: `../leagueManager/leagueManager?id=${item.id}`});
    }
  }
  getLeagueList = (id) => {
    this.getLeagueSeriesLeagues({pageNum: 1, pageSize: 100, seriesId: id});
    this.getLeagueInfo(id)
  }
  getLeagueSeriesLeagues = (params) => {
    this.setState({loading: true})
    return new Request().get(api.API_LEAGUE_SERIES_LEAGUE, params).then((data: any) => {
      if (data.records) {
        this.setState({leagueList: data, loading: false})
      }
    });
  }
  getLeagueInfo = (id) => {
    return new Request().get(api.API_LEAGUE(id), null).then((data: any) => {
      if (data.id != null) {
        this.setState({league: data})
      }
    });
  }

  render() {
    const {leagueList, league} = this.state

    if (this.state.loading) {
      return <View className="qz-series-loading"><AtActivityIndicator mode="center" content="加载中..."/></View>
    }

    return (
      <View className='qz-series-content'>
        <NavBar
          title='茄子体育'
          back
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-series-content-header'>
          {league &&
          <View className='qz-series-content-header-container'>
            <Image className="img"
                   src={league.headImg ? league.headImg : defaultLogo}/>
            <View className='text'>{league.shortName ? league.shortName : league.name}</View>
          </View>
          }
        </View>
        {leagueList.records && leagueList.records.length > 0 ? (
          <View className='qz-series__result-content'>
            <View className='qz-series__result-content__inner'>
              {leagueList.records.map((item) => (
                <LeagueItem key={item.id} leagueInfo={item} onClick={this.onLeagueItemClick.bind(this, item)}/>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}

export default Series
