const api = require("../../../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    id: '',
    patentMsg: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _id = options.id
    that.setData({
      id: _id
    })
  },
  onShow() {
    let that = this
    that.login()
    var _token = wx.getStorageSync('token');
    if (_token) {
      that.patentApiNet()
    }
  },
  /**
   * 专利详情
   */
  patentApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest("patents" + '/' + that.data.id).
    then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          patentMsg: res.data.data,
        })
      }
      wx.hideLoading()
    })
  },
  /**
   * 查看全部
   */
  msgBitp: function() {
    let that = this
    that.setData({
      isShow: !that.data.isShow
    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function(res) {
    let that = this
    if (res.from === 'button') {

    }
    return {
      title: '转发',
      path: '/pages/firstField/personalDetails/patentMore/patentMoreDetails/patentMoreDetails?personId=' + wx.getStorageSync("personId") + '&id=' + that.data.id,
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  // 判断是否有token
  login: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    // 如果有token
    if (token) {
      // 检查token是否有效
      api.fetchRequest('accounts/me', '', 'GET', '0', {
        'Authorization': 'Bearer' + token
      }).then(function(res) {
        // 如果token失效了
        if (res.data.code != 200) {
          wx.setStorageSync('token', null);
          wx.showModal({
            title: '提示',
            content: '您的身份已过期，请重新登录',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/index/index?type=0',
                })
              }
            }
          })
        } else {
          wx.setStorageSync("personId", res.data.data.id)
        }
      })
      return;
    } else {
      let type = 5
      wx.showModal({
        title: '提示',
        content: '为了您更好的体验，请授权登录',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/index/index?loginType=' + type + '&id=' + that.data.id,
            })
          }
        }
      })
    }
  },
})