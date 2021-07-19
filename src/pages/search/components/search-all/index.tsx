import Taro from '@tarojs/taro'
import {Component} from 'react'
import {View, Text} from '@tarojs/components'
import {AtAvatar, AtLoadMore, AtActivityIndicator} from 'taro-ui'

import './index.scss'

type PageStateProps = {
  league: any;
  searchKey: string;
  isBeenSearch: boolean;
  loading: boolean;
  switchTab: (tab: number) => any;
  visible: boolean;
  currentTab: number;
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface SearchAll {
  props: IProps;
}

class SearchAll extends Component<IProps, PageState> {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onLeagueMoreClick = () => {
    this.props.switchTab(1);
  }

  onLeagueItemClick = (item) => {
    if (item.isParent) {
      Taro.navigateTo({url: `../series/series?id=${item.id}`});
    } else {
      Taro.navigateTo({url: `../leagueManager/leagueManager?id=${item.id}`});
    }
  }


  render() {
    const {league, isBeenSearch = false, loading = false, visible = false} = this.props
    if (!visible) {
      return <View/>
    }
    if (loading) {
      return <View className="qz-search__result-loading"><AtActivityIndicator mode="center" content="加载中..."/></View>
    }
    if ((league && (league.total <= 0 || league.total == null))) {
      return <AtLoadMore status="noMore" noMoreText={isBeenSearch ? "什么都没找到..." : (loading ? "加载中..." : "搜一下")}/>
    }
    return (
      <View className='qz-search__result'>
        {league && league.total > 0 ? (
            <View className='qz-search__result-league'>
              <View className='qz-search__result-league-title' onClick={this.onLeagueMoreClick}>
                <Text className='qz-search__result-league-title-desc'>联赛</Text>
                <Text className='qz-search__result-league-title-count'>{league.total}</Text>
                <Text className='qz-search__result-league-title-more'>{`更多>`}</Text>
              </View>
              <View className='qz-search__result-league-content'>
                <View className='qz-search__result-league-content__inner'>
                  {league.records.map((item, index) => {
                    if (index >= 5) {
                      return
                    }
                    return <View key={item.id} className="qz-search__result-league-item"
                                 onClick={this.onLeagueItemClick.bind(this, item)}>
                      <View className="qz-search__result-league-item-avatar">
                        <AtAvatar circle
                                  size="large"
                                  image={item.headImg}/>
                      </View>
                      <Text
                        className="qz-search__result-league-item-name">{item.shortName ? item.shortName : item.name}
                      </Text>
                    </View>
                  })}
                </View>
              </View>
            </View>)
          : null
        }
      </View>
    )
  }
}

export default SearchAll
