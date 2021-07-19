import Taro from '@tarojs/taro'
import {Component} from 'react'
import {View, Text, Image, Button} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {connect} from 'react-redux'

import './user.scss'

import {hasLogin, getStorage, clearLoginToken, getExpInfoByExpValue} from "../../utils/utils";
import account_bg from '../../assets/user/account_bg.png'
import logo from '../../assets/default-logo.png'
import withShare from "../../utils/withShare";
import userAction from '../../actions/user'
import * as global from '../../constants/global'
import LoginModal from '../../components/modal-login/index';
import PhoneModal from '../../components/modal-phone/index';
import * as error from "../../constants/error";
import NavBar from "../../components/nav-bar";

type PageStateProps = {
  userInfo: {
    avatar: string,
    name: string,
    userNo: string,
    phone: string,
    userExp: any,
  },
  payEnabled: boolean,
  expInfo: any,
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  loginOpen: boolean,
  phoneOpen: boolean,
  isLogin: boolean | string | null,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface User {
  props: IProps;
}

@withShare({
  title: '茄子体育',
  imageUrl: logo,
  path: 'pages/home/home'
})
class User extends Component<IProps, PageState> {

  navRef: any = null;

  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
      loginOpen: false,
      phoneOpen: false,
    }
  }

  $setSharePath = () => `/pages/home/home?page=user`

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    Taro.showLoading({title: global.LOADING_TEXT})
    this.getUserInfo()
  }

  componentDidHide() {
  }

  onPullDownRefresh = () => {
    Taro.showLoading({title: global.LOADING_TEXT})
    this.getUserInfo()
  }

  async getUserInfo(onSuccess?: Function | null) {
    if (await hasLogin()) {
      const openid = await getStorage('wechatOpenid');
      userAction.getUserInfo({openId: openid}, {
        success: (res) => {
          this.setState({
            isLogin: true
          })
          Taro.hideLoading()
          Taro.stopPullDownRefresh()
          if (onSuccess) {
            onSuccess(res);
          }
        }, failed: () => {
          this.clearLoginState();
          Taro.hideLoading()
          Taro.stopPullDownRefresh()
        }
      });
    } else {
      this.clearLoginState();
      Taro.hideLoading()
      Taro.stopPullDownRefresh()
    }
  }

  login = async () => {
    if (this.state.isLogin) {
      this.logout();
    } else {
      this.setState({loginOpen: true})
    }
  }
  logout = () => {
    // new Request().get(api.API_LOGIN_OUT, null).then(() => {
    this.clearLoginState();
    // });
  }
  clearLoginState = () => {
    clearLoginToken();
    userAction.clearUserInfo();
    this.setState({
      isLogin: false
    })
  }
  onAuthClose = () => {
    this.setState({loginOpen: false})
  }

  onAuthCancel = () => {
    this.setState({loginOpen: false})
  }

  onAuthError = (reason) => {
    switch (reason) {
      case  error.ERROR_WX_UPDATE_USER: {
        Taro.showToast({
          title: "更新用户信息失败",
          icon: 'none',
        });
        return;
      }
      case  error.ERROR_WX_LOGIN: {
        Taro.showToast({
          title: "微信登录失败",
          icon: 'none',
        });
        return;
      }
      case  error.ERROR_LOGIN: {
        Taro.showToast({
          title: "登录失败",
          icon: 'none',
        });
        return;
      }
    }
  }

  onAuthSuccess = () => {
    this.setState({loginOpen: false, isLogin: true})
    this.getUserInfo((res) => {
      const phone = res.payload.phone
      if (res.payload != null && phone == null) {
        this.setState({phoneOpen: true})
      }
    })
  }

  onPhoneClose = () => {
    this.setState({phoneOpen: false})
  }

  onPhoneCancel = () => {
    this.setState({phoneOpen: false})
  }

  onPhoneError = (reason) => {
    switch (reason) {
      case  error.ERROR_WX_UPDATE_USER: {
        Taro.showToast({
          title: "更新用户信息失败,请重新登录后再试",
          icon: 'none',
          complete: () => {
            this.logout();
          }
        });
        return;
      }
      case  error.ERROR_WX_LOGIN: {
        Taro.showToast({
          title: "微信登录失败",
          icon: 'none',
        });
        return;
      }
      case  error.ERROR_LOGIN: {
        Taro.showToast({
          title: "登录失败",
          icon: 'none',
        });
        return;
      }
    }
  }

  onPhoneSuccess = () => {
    this.setState({phoneOpen: false})
    this.getUserInfo()
  }

  onVerificationClick = () => {
    const {userInfo} = this.props
    if (userInfo && userInfo.phone) {
      Taro.showToast({title: "已验证", icon: "success"});
      return;
    }
    if (this.state.isLogin) {
      this.setState({phoneOpen: true})
    } else {
      Taro.showToast({title: "请登录后再操作", icon: "none"});
      this.setState({loginOpen: true})
    }
  }

  onAddressClick = async () => {
    const token = await getStorage('accessToken');
    if (token == null || token == '' || this.props.userInfo.userNo == null || this.props.userInfo.userNo == '') {
      this.setState({loginOpen: true})
      return;
    }
    Taro.navigateTo({url: `../address/address`});
  }

  onDepositClick = async () => {
    const token = await getStorage('accessToken');
    if (token == null || token == '' || this.props.userInfo.userNo == null || this.props.userInfo.userNo == '') {
      this.setState({loginOpen: true})
      return;
    }
    Taro.navigateTo({url: `../deposit/deposit`});
  }

  getUserExpProgress = (userExp) => {
    const {expInfo} = this.props
    const userExpInfo = getExpInfoByExpValue(expInfo, userExp.exp)
    const userExpValue = userExp.exp;
    const expMin = userExpInfo.minExp;
    const expMax = userExpInfo.maxExp;
    const expRange = expMax - expMin;
    const userExpOffset = userExpValue - expMin;
    return userExpOffset * 100 / expRange;
  }

  render() {
    const {userInfo, payEnabled, expInfo} = this.props
    const {avatar = logo, name = null, userExp = {}} = userInfo;
    const userExpInfo = getExpInfoByExpValue(expInfo, userExp.exp);
    return (
      <View className='qz-user-content'>
        <NavBar
          title=''
          ref={ref => {
            this.navRef = ref;
          }}
        />
        <Image className='qz-user-account-bg'
               style={{top: `${this.navRef ? this.navRef.state.configStyle.navHeight : 0}px`}}
               src={account_bg}/>
        <View className='qz-user-user-info' onClick={this.login}>
          <View className='qz-user-user-info-avatar-container'>
            <Image className='qz-user-user-info-avatar' src={avatar}/>
            {userExp && userExpInfo ?
              <View className='qz-user-user-info-level'
                    style={{backgroundColor: global.LEVEL_COLOR[Math.floor(userExpInfo.level / 10)]}}>
                Lv.{userExpInfo.level}
              </View>
              : null}
          </View>
          {
            name && name.length > 0 ?
              <Text className='qz-user-user-info-username'>{name}</Text>
              :
              <Text className='qz-user-user-info-username'>点击登录</Text>
          }
        </View>
        <View className='qz_user-info-exp'>
          {userExp && userExpInfo ? <View className='exp-bar-controller'>
              {/*<View className='exp-level exp-level-pre'>*/}
              {/*  Lv.{userExp.expInfo.level}*/}
              {/*</View>*/}
              <View className='exp-bar'>
                <View className='bar' style={{width: this.getUserExpProgress(userExp) + "%"}}>
                </View>
              </View>
              {/*<View className='exp-level exp-level-next'>*/}
              {/*  Lv.{userExp.expInfo.level + 1}*/}
              {/*</View>*/}
            </View>
            : null}
        </View>
        <View className='qz-user-list-view'>
          {payEnabled ? <Button onClick={this.onDepositClick} className='list button-list'>
              <View className='list_title'>
                <AtIcon className='list-title-icon' value='money' size='18' color='#333'/>
                我的茄币
              </View>
              <AtIcon value='chevron-right' size='18' color='#7f7f7f'/>
            </Button>
            : null}
        </View>
        <View className='qz-user-list-view'>
          <Button onClick={this.onAddressClick} className='list button-list'>
            <View className='list_title'>
              <AtIcon className='list-title-icon' value='map-pin' size='18' color='#333'/>
              我的地址
            </View>
            <AtIcon value='chevron-right' size='18' color='#7f7f7f'/>
          </Button>
          <Button onClick={this.onVerificationClick} className='list button-list'>
            <View className='list_title'>
              <AtIcon className='list-title-icon' value='iphone' size='18' color='#333'/>
              验证手机号
            </View>
            {userInfo && userInfo.phone ? <AtIcon value='check-circle' size='18' color='#13CE66'/>
              : <AtIcon value='alert-circle' size='18' color='#FFC82C'/>}
          </Button>
          <Button open-type="openSetting" className='list button-list'>
            <View className='list_title'>
              <AtIcon className='list-title-icon' value='check-circle' size='18' color='#333'/>
              授权设置
            </View>
            <AtIcon value='chevron-right' size='18' color='#7f7f7f'/>
          </Button>
          <Button open-type="share" className='list button-list'>
            <View className='list_title'>
              <AtIcon className='list-title-icon' value='share' size='18' color='#333'/>
              分享
            </View>
            <AtIcon value='chevron-right' size='18' color='#7f7f7f'/>
          </Button>
        </View>
        <View className='qz-user-list-view'>
          <Button open-type="contact" className='list button-list'>
            <View className='list_title'>
              <AtIcon className='list-title-icon' value='help' size='18' color='#333'/>
              联系客服
            </View>
            <AtIcon value='chevron-right' size='18' color='#7f7f7f'/>
          </Button>
        </View>
        <LoginModal
          isOpened={this.state.loginOpen}
          handleConfirm={this.onAuthSuccess}
          handleCancel={this.onAuthCancel}
          handleClose={this.onAuthClose}
          handleError={this.onAuthError}/>
        <PhoneModal
          isOpened={this.state.phoneOpen}
          handleConfirm={this.onPhoneSuccess}
          handleCancel={this.onPhoneCancel}
          handleClose={this.onPhoneClose}
          handleError={this.onPhoneError}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo ? state.user.userInfo : {},
    expInfo: state.config ? state.config.expInfo : null,
    locationConfig: state.config ? state.config.locationConfig : null,
    payEnabled: state.config ? state.config.payEnabled : null,
  }
}
export default connect(mapStateToProps)(User)
