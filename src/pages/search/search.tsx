import {Component} from 'react'
import {View, ScrollView} from '@tarojs/components'
import {connect} from 'react-redux'
import {AtSearchBar, AtTabs, AtTabsPane} from 'taro-ui'

import './search.scss'
import searchAction from "../../actions/search";
import SearchAll from "./components/search-all";
import SearchLeague from "./components/search-league";
import withShare from "../../utils/withShare";
import NavBar from "../../components/nav-bar";

// import {getStorage, hasLogin} from "../../utils/utils";

type PageStateProps = {
  league: any;
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  searchText: string;
  currentTab: number;
  isBeenSearch: boolean;
  loading: boolean;
  loadingmore: boolean;
  tabsClass: string;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Search {
  props: IProps;
}

@withShare({})
class Search extends Component<IProps, PageState> {
  static defaultProps = {}
  // tabsY: number;
  scrollTop: number;
  navRef: any = null;

  constructor(props) {
    super(props)
    this.state = {
      searchText: "",
      currentTab: 0,
      isBeenSearch: false,
      loading: false,
      loadingmore: false,
      tabsClass: "",
    }
  }

  $setSharePath = () => `/pages/home/home?page=search`

  componentWillMount() {
  }

  componentDidMount() {
    this.setState({currentTab: 0})
  }

  componentWillUnmount() {
    searchAction.search_clear_all();
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onSearchChange = (value) => {
    this.setState({
      searchText: value,
    })
  }
  onSearch = () => {
    if (this.state.searchText != null && this.state.searchText.trim() != "") {
      this.setState({isBeenSearch: true, loading: true})
      Promise.all([searchAction.search_league({
        name: this.state.searchText,
        pageSize: 5,
        pageNum: 1,
      })]).then(() => {
        this.setState({loading: false})
      })
    }
  }
  switchTab = (tab) => {
    const onSearch = this.onSearch;
    this.setState({
      currentTab: tab
    }, () => {
      onSearch();
    })
  }

  nextPage = (tab) => {
    switch (tab) {
      case 1:
        if (this.state.searchText != null && this.state.searchText.trim() != "") {
          this.setState({isBeenSearch: true, loadingmore: true})
          searchAction.search_league_add({
            name: this.state.searchText,
            pageSize: 5,
            pageNum: this.props.league.current + 1,
          }).then(() => {
            this.setState({loadingmore: false})
          })
        }
        break;
    }
  }

  // 小程序上拉加载
  onScrollToBottom = () => {
    this.nextPage(this.state.currentTab);
  }

  render() {
    const {league} = this.props
    const tabList = [{title: '全部'}, {title: '联赛'}]
    const timestamp = new Date().getTime();

    return (
      <ScrollView scrollY onScrollToLower={this.onScrollToBottom}
                  className='qz-search-scroll-content'>
        <NavBar
          title='茄子体育'
          back
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <View className='qz-search-content'>
          <View className='qz-search__top-search-bar__content'>
            <AtSearchBar
              value={this.state.searchText}
              onChange={this.onSearchChange}
              onActionClick={this.onSearch}
              onConfirm={this.onSearch}
              className='qz-search__top-search-bar'
              focus
            />
          </View>
          <View className='qz-search-tabs'>
            <AtTabs
              swipeable={false}
              className="qz-search__top-tabs__content qz-custom-tabs qz-search__top-tabs__content--fixed"
              current={this.state.currentTab}
              tabList={tabList}
              onClick={this.switchTab}>
              <AtTabsPane current={this.state.currentTab} index={0}>
                <SearchAll
                  currentTab={this.state.currentTab}
                  league={{...league, timestamp: timestamp}}
                  searchKey={this.state.searchText}
                  switchTab={this.switchTab}
                  loading={this.state.loading}
                  visible={this.state.currentTab == 0}
                  isBeenSearch={this.state.isBeenSearch}/>
              </AtTabsPane>
              <AtTabsPane current={this.state.currentTab} index={1}>
                <SearchLeague
                  nextPage={this.nextPage}
                  currentTab={this.state.currentTab}
                  league={{...league, timestamp: timestamp}}
                  searchKey={this.state.searchText}
                  switchTab={this.switchTab}
                  loading={this.state.loading}
                  loadingmore={this.state.loadingmore}
                  visible={this.state.currentTab == 1}
                  isBeenSearch={this.state.isBeenSearch}/>
              </AtTabsPane>
            </AtTabs>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    league: state.search.league,
  }
}
export default connect(mapStateToProps)(Search)
