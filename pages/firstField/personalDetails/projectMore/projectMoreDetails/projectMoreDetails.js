const api = require("../../../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    projectMsg: [],
    sort: '',
    year: '',
    discipline: ''
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
    var _token = wx.getStorageSync('token');
    if (_token) {
      that.projectApiNet()
    }
  },
  /**
   * 项目详情
   */
  projectApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest("questions/getProjectDetail" + '/' + that.data.id).
    then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          projectMsg: res.data.data,
        })
        let _sort = ''
        let _year = ''
        let _discipline = ''
        // 项目类别
        if (that.data.projectMsg.typeFirst == null && that.data.projectMsg.typeSecondary == null && that.data.projectMsg.typeTertiary == null) {
          _sort = '-'
        }
        else  if (that.data.projectMsg.typeSecondary == null && that.data.projectMsg.typeTertiary == null) {
          _sort = that.data.projectMsg.typeFirst
        }
        else  if (that.data.projectMsg.typeFirst == null && that.data.projectMsg.typeTertiary == null) {
          _sort = that.data.projectMsg.typeSecondary
        }
        else  if (that.data.projectMsg.typeFirst == null && that.data.projectMsg.typeSecondary == null) {
          _sort = that.data.projectMsg.typeTertiary
        }
        else  if (that.data.projectMsg.typeFirst != null && that.data.projectMsg.typeSecondary != null && that.data.projectMsg.typeTertiary != null) {
          _sort = that.data.projectMsg.typeFirst + '-' + that.data.projectMsg.typeSecondary + '-' + that.data.projectMsg.typeTertiary
        }
        else  if (that.data.projectMsg.typeSecondary != null && that.data.projectMsg.typeTertiary != null) {
          _sort = that.data.projectMsg.typeSecondary + '-' + that.data.projectMsg.typeTertiary
        }
        else  if (that.data.projectMsg.typeFirst != null && that.data.projectMsg.typeTertiary != null) {
          _sort = that.data.projectMsg.typeFirst + '-' + that.data.projectMsg.typeTertiary
        }
        else if (that.data.projectMsg.typeFirst != null && that.data.projectMsg.typeSecondary != null) {
          _sort = that.data.projectMsg.typeFirst + '-' + that.data.projectMsg.typeSecondary
        }
        //批准年份
        if (that.data.projectMsg.startYear == null && that.data.projectMsg.endYear == null) {
          _year = '-'
        }
        else if (that.data.projectMsg.startYear == null ) {
          _year = that.data.projectMsg.endYear
        }
        else if (that.data.projectMsg.endYear == null ) {
          _year = that.data.projectMsg.startYear
        }
        else if (that.data.projectMsg.startYear != null && that.data.projectMsg.endYear != null) {
          _year = that.data.projectMsg.startYear + '-' + that.data.projectMsg.endYear
        }
        //学科分类
        if (that.data.projectMsg.disciplineFirst == null && that.data.projectMsg.disciplineSecondary == null && that.data.projectMsg.disciplineTertiary == null) {
          _discipline = '-'
        }
        else if (that.data.projectMsg.disciplineSecondary == null && that.data.projectMsg.disciplineTertiary == null) {
          _discipline = that.data.projectMsg.disciplineFirst
        }
        else if (that.data.projectMsg.disciplineFirst == null && that.data.projectMsg.disciplineTertiary == null) {
          _discipline = that.data.projectMsg.disciplineSecondary
        }
        else if (that.data.projectMsg.disciplineFirst == null && that.data.projectMsg.disciplineSecondary == null) {
          _discipline = that.data.projectMsg.disciplineTertiary
        }
        else if (that.data.projectMsg.disciplineFirst != null && that.data.projectMsg.disciplineSecondary != null && that.data.projectMsg.disciplineTertiary != null) {
          _discipline = that.data.projectMsg.disciplineFirst + '-' + that.data.projectMsg.disciplineSecondary + '-' + that.data.projectMsg.disciplineTertiary
        }
        else  if (that.data.projectMsg.disciplineSecondary != null && that.data.projectMsg.disciplineTertiary != null) {
          _discipline = that.data.projectMsg.disciplineSecondary + '-' + that.data.projectMsg.disciplineTertiary
        }
        else if (that.data.projectMsg.disciplineFirst != null && that.data.projectMsg.disciplineTertiary != null) {
          _discipline = that.data.projectMsg.disciplineFirst + '-' + that.data.projectMsg.disciplineTertiary
        }
        else if (that.data.projectMsg.disciplineFirst != null && that.data.projectMsg.disciplineSecondary != null) {
          _discipline = that.data.projectMsg.disciplineFirst + '-' + that.data.projectMsg.disciplineSecondary
        }

        that.setData({
          sort: _sort,
          year: _year,
          discipline: _discipline
        })
      }
      wx.hideLoading()
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
      path: '/pages/firstField/personalDetails/projectMore/projectMoreDetails/projectMoreDetails?personId=' + wx.getStorageSync("personId") + '&id=' + that.data.id,
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  // 判断是否有token
  login: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    // 如果有token
    if (token) {
      // 检查token是否有效
      api.fetchRequest('accounts/me', '', 'GET', '0', {
        'Authorization': 'Bearer' + token
      }).then(function (res) {
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
      let type = 5
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