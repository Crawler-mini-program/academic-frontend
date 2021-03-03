//科研关注
const api = require("../../../utils/request.js")
var page = 0
var num = 20
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: 1,
    isHideLoadMore: true,
    isHideLoadMoreOrg: true,
    isLoadMore: true,
    isLoadMoreOrg: true,
    personMsg: [],
    orgMsg: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    page = 0
    that.followPersonApiNet()
  },
  /**
   * tab切换
   */
  selected: function(e) {
    let that = this
    let _type = e.currentTarget.dataset.type
    let _selected = that.data.selected
    that.setData({
      selected: _type,
    })
    if (_type == 1) {
      page = 0
      that.data.personMsg = []
      that.followPersonApiNet()
    } else if (_type == 2) {
      page=0
      that.data.orgMsg = []
      that.followOrgApiNet()

    }
  },
  /**
   * 获取人才数据
   */
  followPersonApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var token = wx.getStorageSync('token');
    api.fetchRequest('users/follow-scholars', {
        page: page,
        num: num
      }, 'GET', 0, {
        'Authorization': 'Bearer' + token
      })
      .then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          if (res.data.data.length != 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              let _personMsg = that.data.personMsg
              if (res.data.data[i].mutual != null) {
                _personMsg.push(res.data.data[i])
                that.setData({
                  personMsg: _personMsg,
                  isHideLoadMore: true,
                  isLoadMore: true,
                })
              } else {
                that.setData({
                  isHideLoadMore: true,
                  isLoadMore: false,
                })
              }
            }
            for (let j = 0; j < that.data.personMsg.length; j++) {
              let _personMsg = that.data.personMsg
              _personMsg[j].hasFollow = true
              that.setData({
                personMsg: _personMsg,
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
  /**
   * 获取机构数据
   */
  followOrgApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var token = wx.getStorageSync('token');
    api.fetchRequest('users/follow-org', {
        page: page,
        num: num
      }, 'GET', 0, {
        'Authorization': 'Bearer' + token
      })
      .then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          if (res.data.data.length != 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              let _orgMsg = that.data.orgMsg
              if (res.data.data[i].mutual != null) {
                _orgMsg.push(res.data.data[i])
                that.setData({
                  orgMsg: _orgMsg,
                  isHideLoadMoreOrg: true,
                  isLoadMoreOrg: true,
                })
              } else {
                that.setData({
                  isHideLoadMoreOrg: true,
                  isLoadMoreOrg: false,
                })
              }
            }
            for (let j = 0; j < that.data.orgMsg.length; j++) {
              let _orgMsg = that.data.orgMsg
              _orgMsg[j].hasFollow = true
              that.setData({
                orgMsg: _orgMsg,
              })
            }
          } else {
            that.setData({
              isHideLoadMoreOrg: true,
              isLoadMoreOrg: false,
            })
          }
          wx.hideLoading()
        }
      })
  },

  /**
   * 点击进入人的详情
   */
  personBitp: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let _id = that.data.personMsg[_index].followeeId
    let type = 1

    wx.navigateTo({
      url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _id + "&type=" + type
    })
  },
  /**
   * 人才点击关注、取消关注
   */
  followCatp: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _index = e.currentTarget.dataset.index
    let _hasFollow = that.data.personMsg[_index].hasFollow
    var _token = wx.getStorageSync('token');
    let attentionType = 'people'
    if (_hasFollow) {
      api.fetchRequest('users/unFollow?type=' + attentionType + '&followeeId=' + that.data.personMsg[_index].followeeId, {}, 'DELETE', 0, {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer' + _token
      }).then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          // let _hasFollow = that.data.personMsg[_index].hasFollow
          var _hasFollow = "personMsg[" + _index + "].hasFollow"
          that.setData({
            [_hasFollow]: false
          })
        }
      })
    } else {
      api.fetchRequest('users/follow', {
        type: attentionType,
        followeeId: that.data.personMsg[_index].followeeId
      }, 'POST', 0, {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer' + _token
      }).then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          var _hasFollow = "personMsg[" + _index + "].hasFollow"
          that.setData({
            [_hasFollow]: true
          })
        }
      })
    }
    wx.hideLoading()
  },
  /**
   * 机构点击关注、取消关注
   */
  orgCatp: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _index = e.currentTarget.dataset.index
    let _hasFollow = that.data.orgMsg[_index].hasFollow
    var _token = wx.getStorageSync('token');
    let attentionType = 'organization'
    if (_hasFollow) {
      api.fetchRequest('users/unFollow?type=' + attentionType + '&followeeId=' + that.data.orgMsg[_index].followeeId, {}, 'DELETE', 0, {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer' + _token
      }).then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          var _hasFollow = "orgMsg[" + _index + "].hasFollow"
          that.setData({
            [_hasFollow]: false
          })
        }
      })
    } else {
      api.fetchRequest('users/follow', {
        type: attentionType,
        followeeId: that.data.orgMsg[_index].followeeId
      }, 'POST', 0, {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer' + _token
      }).then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          var _hasFollow = "orgMsg[" + _index + "].hasFollow"
          that.setData({
            [_hasFollow]: true
          })
        }
      })
    }
    wx.hideLoading()
  },

  /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    page++
    if(that.data.selected==1){
      that.setData({
        isHideLoadMore: false,
        isLoadMore: true
      })
      that.followPersonApiNet()
    } else if (that.data.selected == 2){
      that.setData({
        isHideLoadMoreOrg: false,
        isLoadMoreOrg: true
      })
      that.followOrgApiNet()
    }

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    page = 0
    that.data.personMsg = []
    that.data.orgMsg = []
  },

})