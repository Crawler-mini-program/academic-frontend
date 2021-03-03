// pages/tutor/tutorGuide/tutorGuide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    this.setData({
      token:token
    })
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/index/index?loginType=0'
    //   })
    // }
  },
  onShow(){

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 立即开始
   */
  startBitp:function(){
    if(this.data.token){
      wx.navigateTo({
        url: '/pages/tutor/selectFields/selectFields'
      })
    }else{
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }
  }
})