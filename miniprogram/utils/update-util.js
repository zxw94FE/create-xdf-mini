/*
 * @Author       : zhaixiaowei@xdf.cn
 * @Date         : 2023-09-15 09:59:44
 * @LastEditors  : zhaixiaowei@xdf.cn
 * @LastEditTime : 2023-09-15 09:59:46
 * @Description  : 描述信息
 */

/**
 * @param noUpdateCallback
 * @param showLoading
 */

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const checkForUpdate = function(noUpdateCallback = () => { }, showLoading = false) {
  if (showLoading) {
    wx.showLoading({
      title: '检查版本更新'
    })
  }
  if (wx.canIUse('getUpdateManager')) { // 判断是否支持自动更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      // wx.hideLoading()
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          if (showLoading) {
            wx.hideLoading()
          }
          wx.showModal({
            cancelColor: '#999999',
            confirmColor: '#1EB895',
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          if (showLoading) {
            wx.hideLoading()
          }
          // 新版本下载失败
          wx.showToast({
            title: '新版本下载失败，请重新打开小程序',
            icon: 'none'
          })
        })
      } else {
        if (showLoading) {
          wx.hideLoading()
        }
        noUpdateCallback.call()
      }
    })
  } else {
    if (showLoading) {
      wx.hideLoading()
    }
    noUpdateCallback.call()
  }
}