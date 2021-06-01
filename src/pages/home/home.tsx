import Taro from '@tarojs/taro'
import {Component} from 'react'
import {View} from '@tarojs/components'
import {AtSearchBar, AtLoadMore} from "taro-ui"
import {connect} from 'react-redux'

import './league.scss'
import LeagueItem from "../../components/league-item";
import * as global from "../../constants/global";
import withShare from "../../utils/withShare";
import Request from "../../utils/request";
import * as api from "../../constants/api";
import NavBar from "../../components/nav-bar";

type PageStateProps = {
  // locationConfig: { city: string, province: string }
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  searchText: string;
  loadingMore: boolean;
  loading: boolean;
  leagueList: any;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface League {
  props: IProps;
}

@withShare({})
class League extends Component<IProps, PageState> {
  navRef: any = null;

  constructor(props) {
    super(props)
    this.state = {
      searchText: "",
      loadingMore: false,
      loading: false,
      leagueList: null,
    }
  }

  $setSharePath = () => `/pages/home/home?page=league`

  componentWillMount() {
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.getLeagueList();
  }

  componentDidHide() {
  }

  onSearchChange = (value) => {
    this.setState({
      searchText: value
    })
  }

  onSearchClick = () => {
    Taro.navigateTo({url: "../search/search"});
  }
  onLeagueItemClick = (item) => {
    if (item.isParent) {
      Taro.navigateTo({url: `../series/series?id=${item.id}`});
    } else {
      Taro.navigateTo({url: `../leagueManager/leagueManager?id=${item.id}`});
    }
  }
  getLeagueList = () => {
    this.setState({loading: true})
    Taro.showLoading({title: global.LOADING_TEXT})
    let url = api.API_LEAGUE_SERIES;
    if (global.CacheManager.getInstance().CACHE_ENABLED) {
      url = api.API_CACHED_LEAGUE_LEAGUE;
    }
    new Request().get(url, {
      pageNum: 1,
      pageSize: 10,
      // province: this.props.locationConfig && this.props.locationConfig.province != '全国' ? this.props.locationConfig.province : null,
      sortField: "sortIndex",
      sortOrder: "desc",
      leagueType: 3,
    }).then((data: any) => {
      if (data) {
        this.setState({leagueList: data});
      }
      this.setState({loading: false})
      Taro.hideLoading();
    }).catch(() => {
      Taro.hideLoading();
      Taro.showToast({title: "获取联赛信息失败", icon: "none"});
    });
  }
  nextPage = () => {
    if (global.CacheManager.getInstance().CACHE_ENABLED) {
      return;
    }
    if (this.state.loadingMore) {
      return;
    }
    this.setState({loadingMore: true})
    new Request().get(api.API_LEAGUE_SERIES, {
      pageNum: this.state.leagueList.current + 1,
      pageSize: 10,
      // province: this.props.locationConfig && this.props.locationConfig.province != '全国' ? this.props.locationConfig.province : null,
      sortField: "sortIndex",
      sortOrder: "desc",
      leagueType: 3,
    }).then((data: any) => {
      if (data) {
        const leagueList = this.state.leagueList;
        data.records = leagueList.records.concat(data.records);
        this.setState({loadingMore: false, leagueList: data})
      }
      Taro.hideLoading();
    })
  }

  // 小程序上拉加载
  onReachBottom = () => {
    this.nextPage();
  }

  onPullDownRefresh = () => {
    Taro.showLoading({title: global.LOADING_TEXT})
    this.getLeagueList();
    Taro.stopPullDownRefresh();
  }

  render() {
    const {leagueList} = this.state

    if (leagueList && (leagueList.total <= 0 || leagueList.total == null)) {
      return <AtLoadMore status="noMore" noMoreText={this.state.loading ? "加载中..." : "搜一下"}/>
    }
    let loadingMoreStatus: any = "more";
    if (this.state.loadingMore || this.state.loading) {
      loadingMoreStatus = "loading";
    } else if (leagueList == null || leagueList.records == null || leagueList.records.length <= 0 || leagueList.total <= leagueList.records.length) {
      loadingMoreStatus = "noMore"
    }

    return (
      <View className='qz-league-content'>
        <NavBar
          title='茄子TV'
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-league-content-search' onClick={this.onSearchClick}>
          <AtSearchBar
            value={this.state.searchText}
            onChange={this.onSearchChange}
            disabled
            className='qz-league-content-search-bar'
          />
        </View>
        {leagueList && leagueList.total > 0 ? (
          <View className='qz-league__result-content'>
            <View className='qz-league__result-content__inner'>
              {leagueList.records.map((item) => (
                <LeagueItem key={item.id} leagueInfo={item} onClick={this.onLeagueItemClick.bind(this, item)}/>
              ))}
            </View>
          </View>
        ) : null}
        <AtLoadMore status={loadingMoreStatus} loadingText="加载中..."/>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // locationConfig: state.config.locationConfig
  }
}
export default connect(mapStateToProps)(League)
