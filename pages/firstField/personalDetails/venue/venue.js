const api = require("../../../../utils/request.js")
var num = 10
var page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    venue: '',
    venueMsg: [],
    isHideLoadMore: true,
    isLoadMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _venue = options.venue
    that.setData({
      venue: _venue
    })
    that.sumApiNetPaper()
  },
  /**
   * 论文列表
   */
  sumApiNetPaper: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let author = new Array()
    api.fetchRequest("papers/venue", {
      venue:that.data.venue,
      page: page,
      num: num
    }).then(function (res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.content.length != 0) {
          for (let i = 0; i < res.data.data.content.length; i++) {
            let _venueMsg = that.data.venueMsg
            _venueMsg.push(res.data.data.content[i])
            that.setData({
              venueMsg: _venueMsg,
              isHideLoadMore: true,
              isLoadMore: true,
            })
          }
        } else {
          that.setData({
            isHideLoadMore: true,
            isLoadMore: false,
          })
        }

        wx.hideLoading()
      }
    })
  },
  venueBitp:function(e){
    let that = this
    var _index = e.currentTarget.dataset.index;
    let _id = that.data.venueMsg[_index].id
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/paperMore/paperMoreDetails/paperMoreDetails?id=' + _id,
    })
  },
  /**
   * 上拉加载
   */
  loadMore: function (e) {
    let that = this
    that.setData({
      isHideLoadMore: false,
      isLoadMore: true
    })
    page++
    that.sumApiNetPaper()
  },
})