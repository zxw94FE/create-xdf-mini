// app.ts

import { checkForUpdate } from './utils/update-util'
import { initSentry } from './utils/sentry/index.js'
import { startBonree } from './utils/bonree/index.js'
App({
  globalData: {
    userInfo: null,
    systemInfo: {},
    requestHeader: {
      app: 'ant',
      platform: 'mini',
      'ant-auth': '', // 后端生成用于鉴权的token
      'device-id': '' // 设备唯一标识 这里用openId
    }
  },
  onLaunch() {
    checkForUpdate()
    try {
      initSentry()
      startBonree()
    } catch (e) {
      console.log('sentry error:', e)
    }
    var res = wx.getSystemInfoSync()
    this.globalData.systemInfo = res
    this.globalData.systemInfo.isIOS = res.platform === 'ios'
    this.checkNetWork()
    // （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
    wx.setInnerAudioOption({obeyMuteSwitch: false})
  },
  checkNetWork() { // 监听网络切换
    wx.onNetworkStatusChange((res) => {
      if (!res.isConnected) {
        wx.showToast({
          title: '当前网络未连接',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  checkPrivacySetting(ifNeed) {
    // 用户版本低 不支持此api 直接通过 不弹隐私协议了。
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: res => {
          // console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
          if (res.needAuthorization) {
            // 需要弹出隐私协议
            ifNeed(true)
          } else {
            // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
            ifNeed(false)
          }
        },
        fail: () => {},
        complete: () => {}
      })
    } else {
      ifNeed(false)
    }
  },

  checkAuthorize(scope) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting[scope]) {
          wx.showModal({
            title: '用户未授权',
            content: '拒绝授权将不能体验小程序完整功能，点击确定开启授权',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success (res) {
                    console.log(res.authSetting[scope], '设置的结果')
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})