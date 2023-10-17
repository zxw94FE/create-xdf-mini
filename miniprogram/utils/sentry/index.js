/*
 * @Author: wangyangtao@xdf.cn
 * @Date: 2022-04-15 09:29:54
 * @LastEditors: wangyangtao@xdf.cn
 * @LastEditTime: 2023-10-12 14:55:04
 * @Description: sentry-miniapp https://github.com/lizhiyao/sentry-miniapp
 */
import * as Sentry from './sentry'
const dsn = 'xxxx'

function initSentry () {
  const { release, environment } = getEnv()
  Sentry.init({
    release,
    environment,
    dsn
  })
}

function setUID (uid) {
  Sentry.configureScope(function (scope) {
    scope.setTag('uid', uid)
  })
}

// 上报错误信息，errorInfo为对象
function captureError (errorInfo) {
  Sentry.captureException(JSON.stringify(errorInfo))
}

function getEnv () {
  const accountInfo = wx.getAccountInfoSync()
  const { envVersion, version } = accountInfo?.miniProgram
  return { release: version, environment: envVersion } // 线上小程序版本号 小程序版本develop/trial/release
}

export {
  initSentry,
  setUID,
  captureError
}
