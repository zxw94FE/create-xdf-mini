import { imageBaseUrl } from './config'

export const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/**
 * 生成uuid 32位 + 4个-
 * @return uuid
 */
export const uuid = function () {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  var uuid = s.join('')
  return uuid
}

export const share = () => {
  return {
    title: '我在新东方伴学宝，邀请你一起参与打卡！',
    path: '/pages/index/index',
    imageUrl: imageBaseUrl + 'images/clock/shareimg.png'
  }
}

// 防抖
export function debounce (fn, time = 300) {
  let timeout = null
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn && fn.apply(this, arguments)
      clearInterval(timeout)
      timeout = null
    }, time)
  }
}