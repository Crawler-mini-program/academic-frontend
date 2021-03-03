const CONFIG = require('../../../config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    version:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let  that=this
      that.setData({
        version: CONFIG.version
      })
  },
})