import { Base64 } from 'js-base64'
import { uuid } from '../util'
import { getCosCredential } from '../../api/clock'
const COSSDK = require('./cos-wx-sdk-v5')

// 获取上传时需要的认证信息
function getUploadCredential () {
  return getCosCredential({ moduleType: 8 }).then((res) => {
    if (res.status === 1) {
      const resData = res.data || {}
      const path = Base64.decode(resData.path || '') // base64解密路径
      return {
        path,
        bucketName: resData.bucketName || '',
        expiredTime: resData.expiredTime,
        region: resData.region,
        credentials: {
          TmpSecretId: resData.tmpSecretId,
          TmpSecretKey: resData.tmpSecretKey,
          XCosSecurityToken: resData.sessionToken,
          ExpiredTime: resData.expiredTime
        }
      }
    }
    console.error('获取认证信息失败:', res)
  })
}

function getFileType (filePath) {
  filePath = filePath + ''
  return filePath.slice(filePath.lastIndexOf('.'))
}

function uploadOneFile (cosInfo, filePath) {
  const targetPath = `${cosInfo.path}${uuid()}${getFileType(filePath)}`
  const cosObj = new COSSDK({
    getAuthorization: function (options, callback) {
      callback(cosInfo.credentials)
    }
  })

  return new Promise((resolve, reject) => {
    cosObj.postObject({
      Bucket: cosInfo.bucketName,
      Region: cosInfo.region,
      Key: targetPath,
      FilePath: filePath
    }, (err, data) => {
      if (err || !data) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function uploadFilePlain (filePath) {
  return getUploadCredential().then((cosInfo) => {
    return uploadOneFile(cosInfo, filePath)
  })
}

function uploadFilesPlain (filePathList) {
  return getUploadCredential.then((cosInfo) => {
    return Promise.all(filePathList.map(filePath => {
      return uploadOneFile(cosInfo, filePath)
    }))
  })
}

function uploadFile (filePath) {
  return uploadFilePlain(filePath).then(item => {
    if (item.statusCode === 200) {
      return generateUrl(item)
    } else {
      console.error('部分文件上传失败:', item)
      return ''
    }
  })
}

function uploadFiles (filePathList) {
  return uploadFilesPlain(filePathList).then(uploadResult => {
    const fileUrls = uploadResult.map(item => {
      if (item.statusCode === 200) {
        return generateUrl(item)
      } else {
        console.error('部分文件上传失败:', item)
        return ''
      }
    })
    return fileUrls
  })
}

function generateUrl (item) {
  const filePath = 'https://' + item.Location
  console.log('文件上传路径:', filePath)
  return filePath
}

module.exports = {
  uploadFile,
  uploadFiles,
  uploadFilePlain,
  uploadFilesPlain
}
