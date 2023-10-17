import { share } from "../../utils/util"
Page({
  data: {
    url: '',
    noteInfo: null
  },
  tempUrl: '',
  onLoad: function (options) {
    this.handleScene(options)
  },

  onShow: function () {
  },

  // 根据scene（第一层）去组合url
  handleScene: function (options) {
    let { scene } = options
    if (typeof scene === 'string') {
      scene = +scene
    }

    switch (scene) {
      case 1:
        this.setData({
          url: decodeURIComponent('https://banxue.sikuyunshu.com/pubstatic/agreements/agreement_user_register.html?type=mini')
        })
        break
      case 2:
        this.setData({
          url: decodeURIComponent('https://banxue.sikuyunshu.com/pubstatic/agreements/agreement_user_privacy.html?type=mini')
        })
        break
      default:
        break
    }
  },
  
  // 页面加载完成
  loadSucceed () {
    wx.hideLoading()
  },

  // 页面加载出错
  loadErr () {
    wx.hideLoading()
  },

  onShareAppMessage () {
    return share()
  }
})
