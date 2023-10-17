/*
 * @Author       : zhaixiaowei@xdf.cn
 * @Date         : 2023-09-14 17:51:17
 * @LastEditors  : zhaixiaowei@xdf.cn
 * @LastEditTime : 2023-10-16 16:09:17
 * @Description  : 项目路径配置信息
 */
import config from '../envConfig'
const imageHost = 'https://ucanos.xdf.cn/troy/static_resources/seal_newconcept_wechat_mini/'

function generateTestEnvConfig (testBaseUrl, suffix) {
  const testAPIUrl = `${testBaseUrl}/ant/${suffix}/mini/`
  return {
    apiBaseUrl: testAPIUrl
  }
}

function generatePreEnvConfig (preBaseUrl) {
  const preAPIUrl = `${preBaseUrl}/ant/mini/`
  return {
    apiBaseUrl: preAPIUrl,
  }
}

function generateProdEnvConfig (prodBaseUrl) {
  const prodAPIUrl = `${prodBaseUrl}/ant/mini/`
  return {
    apiBaseUrl: prodAPIUrl,
  }
}

export const pathOnCdn = (subDir, name, type = 'images') => {
  return `${imageHost}${type}/${subDir}/${name}`
}

export const projectConfig = (function generateEnvConfig () {
  const baseUrl = config.defaultURL
  switch (config.environment) {
    case 'prod':
      return generateProdEnvConfig(baseUrl)
    case 'pre':
      return generatePreEnvConfig(baseUrl)
    case 'dev':
      return generateTestEnvConfig(baseUrl, config.testEnv)
    default:
      break
  }
})()

export const version = '1.0.0' // 小程序版本号
export const imageBaseUrl = imageHost;