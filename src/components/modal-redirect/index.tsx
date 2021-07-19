import Taro from '@tarojs/taro'
import {Component} from 'react'
import {AtModal, AtModalContent, AtModalAction, AtButton, AtAvatar} from "taro-ui"
import {View, Text, Button} from '@tarojs/components'
import './index.scss'
import defaultLogo from "../../assets/default-logo.png";
import * as global from "../../constants/global";


type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  handleCancel: () => any,
  isOpened: boolean,
  redirectPath: any,
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ModalRedirect {
  props: IProps;
}

class ModalRedirect extends Component<IProps, PageState> {
  static defaultProps = {
    handleCancel: () => {
    },
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  onRedirect = () => {
    if (this.props.redirectPath == null) {
      Taro.showToast({title: "跳转失败", icon: "none"});
      return;
    }
    Taro.navigateToMiniProgram({
      appId: global.QIEZITV_APPID,
      path: this.props.redirectPath,
      extraData: {},
      envVersion: 'release',
      success: (_res) => {
        // 打开成功
      }
    })
  }

  render() {
    const {isOpened = false, handleCancel} = this.props;

    return (
      <AtModal isOpened={isOpened} onClose={handleCancel}>
        <AtModalContent>
          <View className="qz-redirect-modal-pic">
            <AtAvatar circle image={defaultLogo}/>
          </View>
          <AtButton
            className="vertical-middle"
            size="small"
            type="primary"
            full
            circle
            onClick={this.onRedirect}>
            点击前往茄子TV查看
          </AtButton>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleCancel}>
            <Text className="mini-gray">取消</Text>
          </Button>
        </AtModalAction>
      </AtModal>
    )
  }
}

export default ModalRedirect
