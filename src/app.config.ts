export default {
  pages: [
    'pages/home/home',
    'pages/user/user',
    'pages/search/search',
    'pages/series/series',
    'pages/leagueManager/leagueManager',
    'pages/address/address',
    'pages/deposit/deposit',
    'pages/feedback/feedback',
    'pages/feedbackDetail/feedbackDetail',
    'pages/feedbackSuccess/feedbackSuccess',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '茄子体育',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: "#666",
    selectedColor: "#2d8cf0",
    backgroundColor: "#fafafa",
    borderStyle: 'white',
    list: [{
      pagePath: "pages/home/home",
      iconPath: "./assets/tab-bar/home.png",
      selectedIconPath: "./assets/tab-bar/home-on.png",
      text: "首页"
    }, {
      pagePath: "pages/user/user",
      iconPath: "./assets/tab-bar/me.png",
      selectedIconPath: "./assets/tab-bar/me-on.png",
      text: "我的"
    }]
  },
}
