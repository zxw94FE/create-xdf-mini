/*
 * @Author       : zhaixiaowei@xdf.cn
 * @Date         : 2023-10-16 10:07:41
 * @LastEditors  : zhaixiaowei@xdf.cn
 * @LastEditTime : 2023-10-16 11:25:29
 * @Description  : 描述信息
 */
/**
 * 根据命令行运行参数，修改/config.js 里面的项目配置信息，
 */
const fs = require('fs')

// const path = require('path')
// 源文件
const sourceFiles = {
  prefix: '/env/',
  dev: 'dev.json',
  pre: 'pre.json',
  prod: 'prod.json'
}
// 目标文件
const targetFiles = [{
  prefix: '/miniprogram/',
  filename: 'envConfig.js'
}]
const preText = 'module.exports = '
// 获取命令行参数
// const cliArgs = process.argv.splice(2)
const env = process.env.ENV
const testEnv = process.argv[2]
// 根据不同环境选择不同的源文件
const sourceFile = sourceFiles[env]
// 根据不同环境处理数据
fs.readFile(__dirname + sourceFiles.prefix + sourceFile,
  (err, data) => {
    if (err) {
      throw new Error(`Error occurs when reading file ${sourceFile}.\nError detail: ${err}`)
      // eslint-disable-next-line no-unreachable
      process.exit(1)
    }
    // 获取源文件中的内容
    const targetConfig = JSON.parse(data)
    // 测试环境中，添加对应的测试服务
    if (env === 'dev') {
      targetConfig.testEnv = testEnv
    }
    // 将获取的内容写入到目标文件中
    targetFiles.forEach(function (item) {
      let result = null
      if (item.filename === 'envConfig.js') {
        result = preText + JSON.stringify(targetConfig, null, 2)
      }
      console.log(result)
      // 写入文件(这里只做简单的强制替换整个文件的内容)
      fs.writeFile(__dirname + item.prefix + item.filename, result, 'utf8', (err) => {
        if (err) {
          throw new Error(`error occurs when reading file ${sourceFile}. Error detail: ${err}`)
          // eslint-disable-next-line no-unreachable
          process.exit(1)
        }
      })
    })
  })
