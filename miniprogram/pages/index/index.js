import { checkIfLoginApi } from '../../api/index'
import { imageBaseUrl } from '../../utils/config'
const app = getApp()
Page({
  data: {
    logoImage: imageBaseUrl + 'images/login/banxuebao_logo.png',
    titleImage: imageBaseUrl + 'images/login/banxuebao_title.png',
  },
  onLoad () {
    this.wxLogin()
  },

  wxLogin () { // 获取登录code
    wx.login({
      success: (res) => {
        this.checkLogin(res.code)
      },
      fail: (err) => {
        console.log('wx.login-err', err)
      },
      complete: (com) => {
        console.log('wx.login-com', com)
      }
    })
  },

  checkLogin (code) {
    const params = { wxCode: code }
    checkIfLoginApi(params).then((res) => {
      const { data } = res
      this.skipPageByRes(data)
    }).catch((e) => {
      console.error(e)
      wx.redirectTo({
        url: '/pages/login/index'
      })
    })
  },

  skipPageByRes (res) { // 根据返回值确定跳转方案
    if (res) {
      const { token, openId, userInfo } = res
      app.globalData.requestHeader['ant-auth'] = token
      app.globalData.requestHeader['device-id'] = openId
      app.globalData.userInfo = userInfo
      wx.switchTab({
        url: '/pages/home/index'
      })
    } else {
      // res为null没有登陆
      wx.redirectTo({
        url: '/pages/login/index'
      })
    }
  }
})
