const envMapRobot = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
  hermes: 8,
  pre: 20,
  prod: 30
}

const compileSetting = {
  es6: true,
  es7: true,
  minifyJS: true,
  minifyWXML: true,
  minifyWXSS: true,
  minify: true,
  codeProtect: false,
  autoPrefixWXSS: true
}

/**
 * 根据环境切换机器人
 * @param envConfig
*/
function getRobot (envConfig) {
  const env = envConfig.environment
  const testEnv = envConfig.testEnv
  return env === 'dev' ? (envMapRobot[testEnv] || 9) : envMapRobot[env]
}

/**
 * 获取node命令行参数
 * @param {array} options 命令行数组
*/
function getEnvParams (options) {
  const envParams = {}
  // 从第三个参数开始,是自定义参数
  for (let i = 2, len = options.length; i < len; i++) {
    const arg = options[i].split('=')
    envParams[arg[0]] = arg[1]
  }
  return envParams
}

module.exports = {
  getEnvParams,
  getRobot,
  compileSetting
}