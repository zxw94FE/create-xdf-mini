const ci = require('miniprogram-ci')
const pa = require('../package.json')
const ProjectConfig = require('../project.config.json')
const config = require('../miniprogram/envConfig')
const { getEnvParams, getRobot, compileSetting } = require('./util')
const robot = getRobot(config)
const { type, buildId = '', keyPath = '' } = getEnvParams(process.argv); // 获取环境参数 type 操作类型 preview | upload

(async () => {
  try {
    const project = new ci.Project({ // 初始化
      appid: ProjectConfig.appid,
      type: 'miniProgram',
      projectPath: process.cwd(),
      privateKeyPath: keyPath,
      ignores: ['node_modules/**/*']
    })

    // await ci.packNpm(project, { // npm 构建
    //   ignores: ['pack_npm_ignore_list'],
    //   reporter: (infos) => { console.log(infos) }
    // })

    await ci.packNpmManually({
      packageJsonPath: './package.json',
      miniprogramNpmDistDir: './miniprogram/',
      ignores: ['pack_npm_ignore_list']
    })


    if (type === 'upload' || type === 'both') { // upload或者both 执行上传逻辑
      const uploadResult = await ci.upload({
        project,
        version: pa.version,
        desc: pa.versionDesc,
        setting: {
          ...compileSetting
        },
        robot,
        allowIgnoreUnusedFiles: true,
        onProgressUpdate: console.log
      })
      console.log(uploadResult, 'uploadResult')
    }
    if (type === 'preview' || type === 'both') { // preview或者both 执行生成预览图片
      const previewResult = await ci.preview({
        project,
        version: pa.version,
        desc: pa.versionDesc,
        qrcodeFormat: 'image',
        qrcodeOutputDest: `./preview-${buildId}.jpg`,
        robot,
        setting: {
          ...compileSetting
        },
        allowIgnoreUnusedFiles: true,
        onProgressUpdate: console.log
      })
      console.log(previewResult, 'previewResult')
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
