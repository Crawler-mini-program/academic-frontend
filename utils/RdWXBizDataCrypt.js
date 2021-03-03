// 引入CryptoJS
var CryptoJS = require('crypto-js')
var app = getApp();

function RdWXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

RdWXBizDataCrypt.prototype.decryptData = function (encryptedData, ivv) {
  // base64 decode ：使用 CryptoJS 中 Crypto.util.base64ToBytes()进行 base64解码
  let key = CryptoJS.enc.Base64.parse(this.sessionKey)
  let iv = CryptoJS.enc.Base64.parse(ivv)
  let decrypt = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  decrypt = JSON.parse(Base64.decode(CryptoJS.enc.Base64.stringify(decrypt)))

  if (decrypt.watermark.appid !== this.appId) {
    console.log(err)
  }

  return decryptResult
}

module.exports = RdWXBizDataCrypt