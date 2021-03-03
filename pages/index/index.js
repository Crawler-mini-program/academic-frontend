//index.js
//获取应用实例
var app = getApp()
const api = require("../../utils/request.js")
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js')
var AppId = 'wxc9321df3ad37a166'
Page({
  data: {
    loginType: 0,
    type: '',
    fieldId: '',
    firstId: '',
    secondId: '',
    id: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onUnload: function() {
    // let token = wx.getStorageSync('token')
    // if (!token) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '为了您更好的体验，请授权登录',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '/pages/index/index',
    //         })
    //       }
    //     }
    //   })
    // }
    // return;
  },
  onLoad: function(options) {
    var that = this
    let _loginType = options.loginType
    if (_loginType == 1) { //个人详情分享
      let _type = options.type
      let _fieldId = options.fieldId
      that.setData({
        loginType: _loginType,
        type: _type,
        fieldId: _fieldId
      })
    } else if (_loginType == 2) { //PK结果分享
      let _type = options.type
      let _firstId = options.firstId
      let _secondId = options.secondId
      that.setData({
        loginType: _loginType,
        type: _type,
        fieldId: _fieldId,
        secondId: _secondId
      })
    } else if (_loginType == 3) { //二维码分享

    } else if (_loginType == 4 || _loginType == 5 || _loginType == 6) { //论文、专利、项目详情分享
      let _id = options.id
      that.setData({
        loginType: _loginType,
        id: _id,
      })
    } else {
      that.setData({
        loginType: _loginType
      })
    }
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {}
          })
        }
      }
    })
  },
  // 点击授权登录------获取信息userInfo
  bindGetUserInfo: function(e) {
    //判断当前网络
    if (app.globalData.isConnected) {
      //用户点击了确定按钮
      if (e.detail.userInfo) {
        // wx.showLoading({
        //   title: '加载中...',
        //   "mask": true
        // })
        let that = this
        that.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        wx.login({
         
          success: function(login_res) {
            // 【2】 拿到code去访问我们的后台换取其他信息
            // 源地址是accounts/code2session
            wx.getUserInfo({
              success: function(info_res) {
                // 2. 小程序通过wx.request()发送code到开发者服务器
                wx.request({
                  url: 'http://localhost:8086/getSessionKeyOropenid',
                  method: 'POST',
                  header: {
                   'content-type': 'application/json'
                  },
                  data: {
                    code: login_res.code, //临时登录凭证
                    rawData: info_res.rawData, //用户非敏感信息
                    signature: info_res.signature, //签名
                    encrypteData: info_res.encryptedData, //用户敏感信息
                    iv: info_res.iv //解密算法的向量
                  },
                  success: function(res) {
                    console.log(res);
                    wx.navigateBack()
                    if (res.data.statusCode === 200) {
                      // 7.小程序存储skey（自定义登录状态）到本地
                      wx.setStorageSync('userInfo', e.detail.userInfo);
                      wx.setStorageSync('token', res.data.token)
                    } else{
                      console.log('服务器异常');
                    }
                  },
                  fail: function(error) {
                    //调用服务端登录接口失败
                    console.log(error);
                  }
                })
              }
            })
            // api.fetchRequest('/accounts/code2session', {
            //     code: res.code,
            //     info: that.userInfo
            //   }, 'GET', 0, {
            //     'Authorization': 'Basic and0YW5kcm9pZGNsaWVudGlkOmdoWEp1ejk4bUZkMml1cTE='
            //   }).then(function(res) {
            //     //  判断登录是否成功
            //     if (res.data.code != 200) {
            //       // 登录错误 
            //       // 提示无法登陆
            //       wx.showModal({
            //         title: '提示',
            //         content: '登录失败，请重试',
            //         showCancel: false
            //       })
            //       return;
            //     }
            //     var _gender = null;
            //     if (e.detail.userInfo.gender == '1') {
            //       _gender = '男'
            //     } else if (e.detail.userInfo.gender == '0') {
            //       _gender = '女'
            //     }
            //     // 判断是否有unionid，如果没有则微信未注册app，需要小程序通过解密获取
              
            //     if (res.data.data.unionid != null) {
              
            //       var thirdPartyLoginDTO = {
            //         city: e.detail.userInfo.city,
            //         gender: _gender,
            //         iconurl: e.detail.userInfo.avatarUrl,
            //         openid: res.data.data.openid,
            //         province: e.detail.userInfo.province,
            //         screenName: e.detail.userInfo.nickName,
            //         type: '1',
            //         uid: res.data.data.unionid
            //       }
            //       //发起请求
            //       api.fetchRequest('accounts/tecent-login?registrationId=abc', thirdPartyLoginDTO, 'POST', 0, {
            //         "content-Type": "application/json",
            //         'Authorization': 'Basic and0YW5kcm9pZGNsaWVudGlkOmdoWEp1ejk4bUZkMml1cTE='
            //       }).then(function(res) {
            //         wx.hideLoading();
            //         if (res.data.code != 200) {
            //           wx.showModal({
            //             title: '提示',
            //             content: '登录失败，请重试',
            //             showCancel: false
            //           })
            //           return;
            //         }
            //         // 存储token
            //         wx.setStorageSync('token', res.data.data.token.access_token)
            //         wx.setStorageSync('userInfo', e.detail.userInfo)
            //         app.globalData.userInfo = e.detail.userInfo

            //         let _token = wx.getStorageSync('token')
            //         api.fetchRequest('users/detail', {}, 'GET', 0, {
            //           'Authorization': 'Bearer' + _token
            //         }).then(function(res) {
            //           let code = res.data.code;
            //           if (code == 200) {
            //             //判断是否选择了领域
            //             if (res.data.data.primaryField != null && res.data.data.fieldLevel2 != null && res.data.data.fieldLevel2.length > 0) {
            //               if (that.data.loginType == 0) {
            //                 wx.switchTab({
            //                   url: '/pages/home/home',
            //                 })
            //               }
            //               if (that.data.loginType == 1) { //首次个人详情分享进入
            //                 var pages = getCurrentPages();
            //                 var prevPage = pages[pages.length - 2];
            //                 prevPage.setData({
            //                   type: that.data.type,
            //                   fieldId: that.data.fieldId,
            //                 })
            //                 wx.navigateBack({ //返回
            //                   delta: 1
            //                 })
            //               }
            //               if (that.data.loginType == 2) { //首次PK结果分享进入
            //                 var pages = getCurrentPages();
            //                 var prevPage = pages[pages.length - 2];
            //                 prevPage.setData({
            //                   type: that.data.type,
            //                   firstId: that.data.firstId,
            //                   secondId: that.data.secondId,
            //                 })
            //                 wx.navigateBack({ //返回
            //                   delta: 1
            //                 })
            //               }
            //               if (that.data.loginType == 3) { //首次二维码分享进入

            //               }
            //               if (that.data.loginType == 4 || that.data.loginType == 5 || that.data.loginType == 6) { //首次论文、专利、项目详情分享进入
            //                 var pages = getCurrentPages();
            //                 var prevPage = pages[pages.length - 2];
            //                 prevPage.setData({
            //                   id: that.data.id,
            //                 })
            //                 wx.navigateBack({ //返回
            //                   delta: 1
            //                 })
            //               }
            //             } else {
            //               wx.navigateTo({
            //                 url: '/pages/index/indexFields/indexFields',
            //               })
            //             }

            //           }
            //         })
            //       })
            //     } else {
            //       var pc = new WXBizDataCrypt(AppId, res.data.data.session_key)
            //       var data = pc.decryptData(e.detail.encryptedData, e.detail.iv)
            //       console.log('--------------解密后的ID：' + data.unionId)
            //       var thirdPartyLoginDTO = {
            //         city: e.detail.userInfo.city,
            //         gender: _gender,
            //         iconurl: e.detail.userInfo.avatarUrl,
            //         openid: res.data.data.openid,
            //         province: e.detail.userInfo.province,
            //         screenName: e.detail.userInfo.nickName,
            //         type: '1',
            //         uid: data.unionId
            //       }
            //       api.fetchRequest('accounts/tecent-login?registrationId=abc', thirdPartyLoginDTO, 'POST', 0, {
            //         "content-Type": "application/json",
            //         'Authorization': 'Basic and0YW5kcm9pZGNsaWVudGlkOmdoWEp1ejk4bUZkMml1cTE='
            //       }).then(function(res) {
            //         wx.hideLoading();
            //         if (res.data.code != 200) {
            //           wx.showModal({
            //             title: '提示',
            //             content: '登录失败，请重试',
            //             showCancel: false
            //           })
            //           return;
            //         }
            //         // 存储token
            //         wx.setStorageSync('token', res.data.data.token.access_token)
            //         wx.setStorageSync('userInfo', e.detail.userInfo)
            //         app.globalData.userInfo = e.detail.userInfo

            //         let _token = wx.getStorageSync('token')
            //         api.fetchRequest('users/detail', {}, 'GET', 0, {
            //           'Authorization': 'Bearer' + _token
            //         }).then(function(res) {
            //           let code = res.data.code;
            //           if (code == 200) {
            //             //判断是否选择了
            //             if (res.data.data.primaryField != null && res.data.data.fieldLevel2 != null && res.data.data.fieldLevel2.length > 0) {
            //               if (that.data.loginType == 0) {
            //                 wx.switchTab({
            //                   url: '/pages/home/home',
            //                 })
            //               }
            //               if (that.data.loginType == 1) { //首次个人详情分享进入
            //                 var pages = getCurrentPages();
            //                 var prevPage = pages[pages.length - 2];
            //                 prevPage.setData({
            //                   type: that.data.type,
            //                   fieldId: that.data.fieldId,
            //                 })
            //                 wx.navigateBack({ //返回
            //                   delta: 1
            //                 })
            //               }
            //               if (that.data.loginType == 2) { //首次PK结果分享进入
            //                 var pages = getCurrentPages();
            //                 var prevPage = pages[pages.length - 2];
            //                 prevPage.setData({
            //                   type: that.data.type,
            //                   firstId: that.data.firstId,
            //                   secondId: that.data.secondId,
            //                 })
            //                 wx.navigateBack({ //返回
            //                   delta: 1
            //                 })
            //               }
            //               if (that.data.loginType == 3) { //首次二维码分享进入

            //               }
            //               if (that.data.loginType == 4 || that.data.loginType == 5 || that.data.loginType == 6) { //首次论文、专利、项目详情分享进入
            //                 var pages = getCurrentPages();
            //                 var prevPage = pages[pages.length - 2];
            //                 prevPage.setData({
            //                   id: that.data.id,
            //                 })
            //                 wx.navigateBack({ //返回
            //                   delta: 1
            //                 })
            //               }
            //             } else {
            //               wx.navigateTo({
            //                 url: '/pages/index/indexFields/indexFields',
            //               })
            //             }

            //           }
            //         })
            //       })
            //     }
            //   })
          }
        })
      } else {
        //点击拒绝按钮
        // wx.showModal({
        //   title: '警告',
        //   content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        //   showCancel: false,
        //   confirmText: '返回授权',
        //   success(res) {
        //     if (res.confirm) {
        //       wx.hideLoading()
        //     }
        //   }
        // })
      }
    } else {
      wx.showToast({
        title: '当前网络环境差，为了您更好的体验，请在好的网络环境下使用',
        icon: 'none',
      })
    }

  },
})