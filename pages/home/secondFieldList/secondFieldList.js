// pages/home/secondFieldList.js
var page = 0
var num = 10
var type = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldMsg: [],
    currentIndex: 2,
    isHideLoadMoreFields: true,
    isLoadMoreFields: true,
    fieldId: '',
    numType: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      currentIndex: options.currentIndex,
      fieldId: options.id
    })
    that.secondFieldSearch();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  secondFieldSearch: function() {
    let that = this
    wx.request({
      url: 'http://localhost:8086/search-son-field',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      data: {
        page_size: num,
        page_no: page,
        parentId: that.data.fieldId,
      },
      success: function(res) {
        let code = res.data.code;
        if (code == 200) {
          if (res.data.data != null && res.data.data.length != 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              let _fieldMsg = that.data.fieldMsg
              _fieldMsg.push(res.data.data[i])
              that.setData({
                numType: 1,
                fieldMsg: _fieldMsg,
                isHideLoadMoreFields: true,
                isLoadMoreFields: true,
              })
            }
          } else {
            if (page == 0) {
              that.setData({
                isHideLoadMoreFields: true,
                isLoadMoreFields: true,
              })
            } else {
              that.setData({
                isHideLoadMoreFields: true,
                isLoadMoreFields: false,
              })
            }
          }
          wx.hideLoading()
        }
      }
    })
  },

    /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    page++
    //获取id判断机构、领域
    that.secondFieldSearch()
  },

  scholarListBitp: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let _token = wx.getStorageSync('token');
    console.log(e);
    if(_token){
      wx.request({
        url: 'http://localhost:8086//change-field',
        method : 'GET',
        header : {
          'token' : _token,
          'content-type' : 'application/json'
        },
        data:{
          'fieldid' : id,
          'fieldname' : name
        },
        success:function(res){
          let code = res.data.code;
          if(code == 0){
            wx.setStorageSync('interestedFieldName', name);
            wx.showToast({
              title: '设置成功',
            })
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        }
      })
    }else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    wx.hideLoading()
  },

})