// pages/home/scholarList.js
var page = 0
var num = 10
var type = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personMsg: [],
    currentIndex: 1,
    isHideLoadMoreInstitution: true,
    isLoadMoreInstitution: true,
    isHideLoadMoreFields: true,
    isLoadMoreFields: true,
    orgId: '',
    fieldId: '',
    numType: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this
    let currentIndex = options.currentIndex
    that.setData({
      currentIndex: currentIndex
    })
    if(currentIndex == 1) {
      that.setData({
        orgId: options.id
      })
      that.institutionSearchScholar();
    }
    else if(currentIndex == 2) {
      that.setData({
        fieldId: options.id
      })
      that.fieldsSearchScholar()
    }
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
    // let that = this
    // if(that.data.currentIndex == 1) {
    //   that.institutionSearchScholar();
    // }
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

  institutionSearchScholar: function() {
    console.log(page);
    let that = this
    wx.request({
      url: 'http://localhost:8086/search-scholar-by-org',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      data: {
        page_size: num,
        page_no: page,
        orgId: that.data.orgId,
      },
      success: function(res) {
        console.log(res);
        let code = res.data.code;
        if (code == 200) {
          if (res.data.data != null && res.data.data.length != 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              let _personMsg = that.data.personMsg
              _personMsg.push(res.data.data[i])
              that.setData({
                numType: 1,
                personMsg: _personMsg,
                isHideLoadMoreInstitution: true,
                isLoadMoreInstitution: true,
              })
            }
          } else {
            if (page == 0) {
              that.setData({
                isHideLoadMoreInstitution: true,
                isLoadMoreInstitution: true,
              })
            } else {
              that.setData({
                isHideLoadMoreInstitution: true,
                isLoadMoreInstitution: false,
              })
            }
          }
          wx.hideLoading()
        }
      }
    })
  },

  fieldsSearchScholar: function() {
    console.log(page);
    let that = this
    wx.request({
      url: 'http://localhost:8086/search-scholar-by-field',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      data: {
        page_size: num,
        page_no: page,
        fieldId: that.data.fieldId,
      },
      success: function(res) {
        console.log(res);
        let code = res.data.code;
        if (code == 200) {
          if (res.data.data != null && res.data.data.length != 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              let _personMsg = that.data.personMsg
              _personMsg.push(res.data.data[i])
              that.setData({
                numType: 1,
                personMsg: _personMsg,
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
    let _currentIndex = that.data.currentIndex
    if (_currentIndex == 1) {
      that.institutionSearchScholar()
    } else if (_currentIndex == 2) {
      that.fieldsSearchScholar()
    }

  },

  personBitp: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let _scholarId = that.data.personMsg[_index].scholarId

    let _info_item = JSON.stringify(that.data.personMsg[_index])
    let _scholarInfo = encodeURIComponent(_info_item)
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/personalDetails?personId=' + _scholarId + "&scholarInfo=" + _scholarInfo + "&type=" + "1"
    })
  }
})