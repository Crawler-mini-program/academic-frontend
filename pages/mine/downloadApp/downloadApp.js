const api = require("../../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    base64ImgUrl: '',
    netUrl: '',
    displayBoo: true,
    topTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _type=options.type
    if(_type==1){
      that.setData({
        topTitle:"生成报告请在知兔app上进行操作"
      })
    } else if (_type == 2){
      that.setData({
        topTitle: "求助全文请下载知兔app"
      })
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    api.fetchRequest('set/get-apk-code')
      .then(function(res) {
        let code = res.statusCode;
        if (code == 200) {
          that.setData({
            base64ImgUrl: 'data:image/png;base64,' + res.data.replace(/[\r\n]/g, "")
          })
          wx.hideLoading()
        }
      })
    api.fetchRequest('set/check-version')
      .then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          let _versionNumber = res.data.data.versionNumber
          that.setData({
            netUrl: 'https://zhitulist.com' + '/zhitu_wechat_v' + _versionNumber + '.apk'
          })
          wx.hideLoading()
        }
      })

  },
  urlBitp: function() {
    let that = this
    try {
      var res = wx.getSystemInfoSync()
      if (res.system.indexOf('iOS') >= 0) {
        wx.showModal({
          title: '提示',
          content: 'IOS系统未上线，暂不支持下载，请谅解',
          showCancel: false,
          success(res) {
            if (res.confirm) {}
          }
        })
        wx.hideLoading()
      }
      if (res.system.indexOf('Android') >= 0) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        that.setData({
          displayBoo: false
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  loadSuccess: function() {
    let that = this
    wx.hideLoading()
    that.setData({
      displayBoo: true
    })
    wx.showToast({
      title: '下载成功，请在通知栏查看',
      icon: 'none',
      duration: 2000
    })
  },
  previewImage: function(e) {
    let that = this
    wx.previewImage({
      current: that.data.base64ImgUrl,
      urls: [that.data.base64ImgUrl]
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
})