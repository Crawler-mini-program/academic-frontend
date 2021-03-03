const api = require("../../../../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    parperMsg: [],
    id: '',
    imgUrl: ["http://img01.guokezy.com/avatars/5c412f187bc75e89d4c7e47b.jpg",
      "http://img01.guokezy.com/avatars/5c412f217bc75e89d4c7e481.jpg",
      "http://img01.guokezy.com/avatars/5c412f267bc75e89d4c7e487.jpg",
      "http://img01.guokezy.com/avatars/5c412f2a7bc75e89d4c7e48d.jpg",
      "http://img01.guokezy.com/avatars/5c412f317bc75e89d4c7e493.jpg"
    ],
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
    let _token = wx.getStorageSync('token')
    if (_token) {
      that.parperApiNet()
    }
  },
  /**
   * 论文详情
   */
  parperApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _token = wx.getStorageSync('token')
    api.fetchRequest("questions/getPaperDetail" + '/' + that.data.id, {}, 'GET', '0', {
      'Authorization': 'Bearer' + _token
    }).
    then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          parperMsg: res.data.data,
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
   *  作者
   * */
  authorBitp: function(e) {
    // let that = this
    // var _index = e.currentTarget.dataset.index;
    // let _id=that.data.parperMsg.authorUrlVOS[_index].id
    // let typeNum=1
    // if(_id!=null){
    //   wx.navigateTo({
    //     url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _id + "&type=" + typeNum
    //   })
    // }else{
    //   wx.showToast({
    //     title: '暂未录入该作者',
    //     icon: 'none',
    //     duration: 500
    //   })
    // }
  },
  /**
   *  出版
   * */
  venueBitp: function() {
    let that = this
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/venue/venue?venue=' + that.data.parperMsg.venue
    })
  },
  /**
   * 求助全文
   */
  helpBitp:function(){
    let _type = 2
    wx.navigateTo({
      url: '/pages/mine/downloadApp/downloadApp?type=' + _type
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
      path: '/pages/firstField/personalDetails/paperMore/paperMoreDetails/paperMoreDetails?personId=' + wx.getStorageSync("personId") + '&id=' + that.data.id,
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
      let type = 4
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