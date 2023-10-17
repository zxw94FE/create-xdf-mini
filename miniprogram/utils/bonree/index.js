/*
 * @Author: wangyangtao@xdf.cn
 * @Date: 2023-02-27 10:45:44
 * @LastEditors: wangyangtao@xdf.cn
 * @LastEditTime: 2023-10-12 15:35:11
 * @Description: bonree
 */
const BonreeSDK = require('./bonree.min.js')
const appId = 'xxx'
const configAddress = 'https://sdkupload.bonree.com/config'
const useBonree = checkIsProdAndRelease()
// const useBonree = true
let BRSAgent

function startBonree () {
  if (!useBonree) return
  BRSAgent = BonreeSDK.start({
    appId,
    configAddress
  })
}

function setUserId (uid) {
  if (!useBonree) return
  BRSAgent.setUserId(uid)
}

// 设置附加信息，obj是对象
function setExtraInfo (obj) {
  if (!useBonree) return
  BRSAgent.setExtraInfo(obj)
}

function checkIsProdAndRelease () {
  const accountInfo = wx.getAccountInfoSync()
  const envVersion = accountInfo?.miniProgram?.envVersion
  return envVersion === 'release'
}

export {
  startBonree,
  setUserId,
  setExtraInfo,
  BRSAgent
}
