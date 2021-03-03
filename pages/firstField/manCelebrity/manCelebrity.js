//风云人物
const api = require("../../../utils/request.js")
var app = getApp()
var page = 0
var num = 20
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // isHideRefresh: true,
    isHideLoadMore: true,
    isLoadMore: true,
    searchType: 0,
    innovationIndex: '',
    increase: '',
    increasePercentage: '',
    fieldId: '',
    orgId: '',
    apiRankingList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let _searchType = options.searchType
    let _name = options.name;
    if (_name != null) {
      wx.setNavigationBarTitle({
        title: _name,
      })
    }
    let _fieldId = options.fieldId;
    let _orgId = options.orgId;
    let _innovationIndex = options.innovationIndex;
    let _increase = options.increase;
    let _increasePercentage = options.increasePercentage;
    that.setData({
      fieldId: _fieldId,
      orgId: _orgId,
      innovationIndex: _innovationIndex,
      increase: _increase,
      increasePercentage: _increasePercentage,
      searchType: _searchType
    })
    /**
     * searchType=1:从搜索进入
     * 否则从其他进入
     */
    if (_searchType == 1) {
      that.ApimanRankingSearch()
    } else {
      that.ApimanRanking()
    }
  },
  /**
   * 风云人物内容
   */
  ApimanRanking: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    // 获取首页传的id
    api.fetchRequest("rank/top-talents-by-orgId", {
      fieldId: that.data.fieldId,
      orgId: that.data.orgId,
      page: page,
      num: num
    }).then(function(res) {
      if (res.data.code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _apiRankingList = that.data.apiRankingList
            _apiRankingList.push(res.data.data[i])
            that.setData({
              apiRankingList: _apiRankingList,
              // isHideRefresh: true,
              isHideLoadMore: true,
              isLoadMore: true,
            })
          }
        } else {
          that.setData({
            // isHideRefresh: true,
            isHideLoadMore: true,
            isLoadMore: false,
          })
        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 风云人物搜索领域进入内容
   */
  ApimanRankingSearch: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    // 获取首页传的id
    api.fetchRequest("rank/top-talents-by-field", {
      fieldId: that.data.fieldId,
      sortType: 'innovationIndex',
      page: page,
      num: '15'
    }).then(function(res) {
      if (res.data.code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _apiRankingList = that.data.apiRankingList
            _apiRankingList.push(res.data.data[i])
            that.setData({
              apiRankingList: _apiRankingList,
              // isHideRefresh: true,
              isHideLoadMore: true,
              isLoadMore: true,
            })
          }
        } else {
          that.setData({
            // isHideRefresh: true,
            isHideLoadMore: true,
            isLoadMore: false,
          })
        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 点击个人进入详情
   */
  personCatchTap: function(e) {
    let that = this
    let _token = wx.getStorageSync('token')
    if (_token) {
      let _index = e.currentTarget.dataset.index
      let _id = that.data.apiRankingList[_index].id
      let type = 1

      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _id + "&type=" + type
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }
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
    let that = this
    page = 0
    let _apiRankingList = that.data.apiRankingList
    if (_apiRankingList.length != 0) {
      _apiRankingList = []
      that.setData({
        apiRankingList: _apiRankingList
      })
    }
  },

  /**
   * 下拉刷新
   */
  // refresh: function(e) {
  //   page = 0
  //   let that = this
  //   that.setData({
  //     isHideRefresh: false,
  //     isHideLoadMore: true,
  //     isLoadMore: true
  //   })
  //   let _apiRankingList = that.data.apiRankingList
  //   if (_apiRankingList != null) {
  //     _apiRankingList = []
  //     that.setData({
  //       apiRankingList: _apiRankingList
  //     })
  //   }
  //   if (that.data.searchType == 1) {
  //     that.ApimanRankingSearch()
  //   } else {
  //     that.ApimanRanking()
  //   }

  // },
  /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    page++
    that.setData({
      // isHideRefresh: true,
      isHideLoadMore: false,
      isLoadMore: true
    })
    if (that.data.searchType == 1) {
      that.ApimanRankingSearch()
    } else {
      that.ApimanRanking()
    }
  },
})