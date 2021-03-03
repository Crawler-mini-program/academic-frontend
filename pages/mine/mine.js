// 我的
var app = getApp()
const api = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    isLogin:false,
    // followPeople: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _token = wx.getStorageSync('token')
    if (_token) {
      that.setData({
        isLogin:true
      })
      let _userInfo = wx.getStorageSync("userInfo")
      that.setData({
        userInfo: _userInfo
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }

    // that.attentionApiNet()
  },
  onShow: function() {
    let that = this
    let _token = wx.getStorageSync('token')
    if(_token) {
      that.setData({
        isLogin: true
      })
      let _userInfo = wx.getStorageSync("userInfo")
      that.setData({
        userInfo: _userInfo
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    // if (that.data.followPeople == '' || that.data.followPeople == 0) {
    //   that.attentionApiNet()
    // }
  },
  //点击登录
  loginBitp:function(){
    wx.navigateTo({
      url: '/pages/index/index?loginType=0',
    })
  },
  /**
   * 科研关注的数量--暂未使用
   */
  attentionApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _fieldsId = wx.getStorageSync("fieldsId")
    api.fetchRequest('users/' + wx.getStorageSync("personId") + '/social-statistics')
      .then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          let _followPeople = res.data.data.followPeople;
          that.setData({
            followPeople: _followPeople
          })
          wx.hideLoading()
        }
      })

  },
  /**
   * 点击进入个人详情
   */
  userBitp: function() {
    let _original = wx.getStorageSync("original")
    if (_original) {
      let _vertexId = wx.getStorageSync("vertexId")
      let typeNum = 1
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _vertexId + "&type=" + typeNum,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请下载知兔APP认领学者身份',
        showCancel: false,
        success(res) {
          if (res.confirm) {

          }
        }
      })
    }


  },
  /**
   * 科研关注
   */
  attentionBit: function() {
    if(this.data.isLogin){
      wx.navigateTo({
        url: '/pages/mine/followPeople/followPeople',
      })
    }else{
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    
  },
  /**
   * 关于我们
   */
  aboutBit: function() {
    wx.navigateTo({
      url: '/pages/mine/aboutUs/aboutUs',
    })
  },
  /**
   * app下载
   */
  appBit: function() {
    let _type=0
    wx.navigateTo({
      url: '/pages/mine/downloadApp/downloadApp?type=' + _type,
    })
  },
  /**
   * 联系方式
   */
  contactBit: function() {
    wx.showModal({
      title: '提示',
      content: '请关注“知兔空间”公众号联系我们',
      showCancel: false,
      success(res) {
        if (res.confirm) {

        }
      }
    })
  },


  /**
   * 退出登录
   */
  logout: function() {
    wx.setStorageSync('token', null)
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
})