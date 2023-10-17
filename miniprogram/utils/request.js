/*
 * @Author       : zhaixiaowei@xdf.cn
 * @Date         : 2023-09-14 17:13:38
 * @LastEditors  : zhaixiaowei@xdf.cn
 * @LastEditTime : 2023-09-27 18:38:38
 * @Description  : 描述信息
 */
import { projectConfig } from './config'
let requestTask = null
const app = getApp()
// 白名单中的接口请求不会统一添加showLoading： 加载中
const whiteList = []
// 不需要hideLoading的接口
const noHideLoadingList = []

const { requestHeader } = app.globalData
/**
 * @param url
 * @param data
 * @param header
 * @param method
 * @param ignoreErrorToast 这里不做报错的toast处理
 * @param ignoreLoadingToast 这里不做接口loading状态处理
 * @param ignoreAPIError 这里不做接口的报错处理，放到业务自己处理
 * @param  isShowLoading 是否展示默认loading
 * @returns {Promise<unknown>}
 */
export const request = ({ url, data = {}, header = requestHeader, method = 'POST', ignoreErrorToast = false, ignoreLoadingToast = false, ignoreAPIError = false, isShowLoading = true }) => {
  url = url.replace(/(^\s*)|(\s*$)/g, '') // 去掉url左右空格
  const reqHeader = Object.assign({}, requestHeader, header)
  const promise = new Promise((resolve, reject) => {
    if (!whiteList.includes(url) && !ignoreLoadingToast && isShowLoading) {
      wx.showLoading({
        title: '加载中'
      })
    }
    requestTask = wx.request({
      url: `${projectConfig.apiBaseUrl}${url}`,
      data,
      header: reqHeader,
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        const resData = res.data
        if (resData.status && resData.status === 1) {
          if (!whiteList.includes(url) && !ignoreLoadingToast && isShowLoading) {
            if (!noHideLoadingList.includes(url)) {
              wx.hideLoading()
            }
          }
          resolve(resData)
        } else if (resData.status && (resData.status === 3 || resData.status === 6)) { // 登陆异常
          wx.hideLoading()
          wx.showModal({
            showCancel: false,
            content: resData.message || '账号异常，请重新登录',
            confirmText: '我知道了',
            success: (res) => {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/login/index'
                })
              }
            }
          })
          reject(resData)
        } else {
          wx.hideLoading()
          if (!ignoreAPIError && !ignoreErrorToast) {
            wx.showToast({
              title: resData.message || '网络开了个小差，请刷新试一下~',
              icon: 'none',
              duration: 2000
            })
          }
          // 不处理业务给的错误状态码，接口调用方自己处理
          if (ignoreAPIError) {
            resolve(resData)
          } else {
            console.error(`请求失败:url:${url},params:${JSON.stringify(data)}, data:${JSON.stringify(resData)}`)
            reject(resData)
          }
        }
      },
      fail: (err) => {
        if (err.errMsg === 'request:fail abort') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(null)
        }
        wx.showToast({
          title: err.errMsg || '网络异常请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  })
  // eslint-disable-next-line no-proto
  // promise.__proto__.requestTask = requestTask // 这行代码这样写，会导致geetest（极验）验证码插件的接入有异常，比如返回值字符串变成[object...，校验弹层出不来等等
  // 上面这行__proto__的写法我猜原意是想留个处理的后门，让promise也能调用requestTask 的方法，比如abort，但放__proto__也会导致后面的请求会覆盖前面的结果，其实没啥鸟用
  // 暂时换成下面的这种方式,对当前对象有效，且不被覆盖
  promise.requestTask = requestTask
  return promise
}

