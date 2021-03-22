 // pages/home/home.js
 var page = 0
var num = 30
var app = getApp();
var orgType = 'scholar'
const api = require("../../utils/request.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    geniusPeopleList: [],
    recommendBySchoolPeopleList : [],
    recommendByFieldPeopleList : [],
    orgztionList: [],
    hotOneFieldList: [],
    hotAppletsFieldList: [],
    hotField: true,
    is_login: true,
    reportMsg: [{
      reportImgUrl: '../../assets/report1.png',
      reportName: '人才分析列表'
    }, {
      reportImgUrl: '../../assets/report2.png',
      reportName: '专家列表报告'
    }, {
      reportImgUrl: '../../assets/report3.png',
      reportName: '论文开题报告'
    }, {
      reportImgUrl: '../../assets/report4.png',
      reportName: '技术分析报告'
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.hotField = true
    // that.hotOneField()
    // that.hotAppletsField()
    // that.orgztionApi()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.globalData.isConnected) {
      that.recommendByOrgsApi();
      that.recommendByFieldApi();
      // that.geniusApi()
      // that.login()
    } else {
      wx.showToast({
        title: '当前网络环境差，为了您更好的体验，请在好的网络环境下使用',
        icon: 'none',
      })
    }
  },
  /**
   * 学校推荐老师
   */
  recommendByOrgsApi: function () {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    if (_token) {
      // that.hotOneField()
      // that.hotAppletsField()
      wx.request({
        'url' : 'http://localhost:8086/user-search-scholar-by-org',
        method : 'GET',
        header : {
          'token' : _token,
          'content-type' : 'application/json'
        },
        data : {
          // orgId : 14298378304,
          page_size : num,
          page_no : page
        },
        success : function(res){
          let code = res.data.code;
          if(code == 200){
            that.setData({
              recommendBySchoolPeopleList : res.data.data,
              hotField: true
            })
          }
         
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    wx.hideLoading()
  },
  /**
   * 领域推荐老师
   */
  recommendByFieldApi: function () {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    if (_token) {
      // that.hotOneField()
      // that.hotAppletsField()
      wx.request({
        'url' : 'http://localhost:8086//user-search-scholar-by-field',
        method : 'GET',
        header : {
          'token' : _token,
          'content-type' : 'application/json'
        },
        data : {
          // fieldId : 41517072,
          page_size : num,
          page_no : page
        },
        success : function(res){
          let code = res.data.code;
          if(code == 200){
            that.setData({
              recommendByFieldPeopleList : res.data.data,
              hotField: true
            })
          }
          
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    wx.hideLoading()
  },
  /**
   * 推荐老师进入个人详情
   */
  teacherBitp: function (e) {
    let that = this
    if (that.data.hotField) {
      let _geniusId = e.currentTarget.dataset.geniusid
      let typeNum = 1
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _geniusId + "&type=" + typeNum
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }

  },
  /**
   * 牛人
   */
  geniusApi: function () {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    if (_token) {
      that.hotOneField()
      that.hotAppletsField()
      api.fetchRequest('home/top-scholar', {}, 'GET', 0, {
        'Authorization': 'Bearer' + _token
      }).then(function (res) {
        let code = res.data.code;
        if (code == 200) {
          that.setData({
            geniusPeopleList: res.data.data,
            hotField: true
          })
        }
        wx.hideLoading()
      })
    } else {
      api.fetchRequest('home/top-scholar', {}, 'GET', 0, {}).then(function (res) {
        let code = res.data.code;
        if (code == 200) {
          that.setData({
            geniusPeopleList: res.data.data,
          })

        }
        wx.hideLoading()
      })
    }

  },

  /**
   * 高校
   */
  orgztionApi: function () {
    let that = this
    api.fetchRequest('rank/top-home-organization', {
        num: 30,
        orgType: 'university',
        page: 0,
        sortType: 'innovationIndex'
      }, 'GET', 0, {})
      .then(function (res) {
        let code = res.data.code;
        if (code == 200) {
          that.setData({
            orgztionList: res.data.data
          })
        }
      })

  },
  /**
   * 热门领域、一级领域
   */
  hotOneField: function () {
    let that = this
    let _token = wx.getStorageSync('token')
    wx.request({
      url: ''
    })
  },
  /**
   * 热门领域、二级领域
   */
  hotAppletsField: function () {
    let that = this
    let _token = wx.getStorageSync('token')
    let _hotAppletsFieldList = []
    api.fetchRequest('home/getAppletsField', {}, 'GET', 0, {
      'Authorization': 'Bearer' + _token
    }).then(function (res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.length >= 6) {
          for (let i = 0; i < 6; i++) {
            _hotAppletsFieldList.push(res.data.data[i])
          }
          that.setData({
            hotAppletsFieldList: _hotAppletsFieldList
          })
        } else {
          that.setData({
            hotAppletsFieldList: res.data.data
          })
        }

      }
    })
  },

  onReady: function () {

  },

  //搜索
  homeSearch: function (event) {
    let that = this
    let _reportType = 0
    let _token = wx.getStorageSync('token');
    if(!_token){
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    else{
      wx.request({
        'url': 'http://localhost:8086/check-token',
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        data: {
          token: _token
        },
        success: function(res) {
          if(res.data.success) {
            wx.navigateTo({
              url: '/pages/home/search/search?reportType=' + _reportType
            })
          }
          else {
            wx.navigateTo({
              url: '/pages/index/index?loginType=0',
            })
          }
        }
      })
    }
  },
  
  /**
   * 报告列表
   */
  reportBitp: function (e) {
    if (this.data.hotField) {
      let _index = e.currentTarget.dataset.index
      if (_index == 0) {
        let _reportType = 1
        wx.navigateTo({
          url: '/pages/home/search/search?reportType=' + _reportType
        })
      } else if (_index == 1) {
        wx.navigateTo({
          url: '/pages/home/report/expertReport/expertReport'
        })
      } else if (_index == 2) {
        let _type = 0
        wx.navigateTo({
          url: '/pages/home/report/paperReport/paperReport?type=' + _type
        })
      } else if (_index == 3) {
        let _type = 1
        wx.navigateTo({
          url: '/pages/home/report/paperReport/paperReport?type=' + _type
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }

  },

  /**
   * 点击图片
   */
  imageBitp: function () {
    let that = this
    let _token = wx.getStorageSync('token');
    if(!_token){
      wx.navigateTo({
        url: '/pages/index/index?loginType=0',
      })
    }
    else{
      wx.request({
        'url': 'http://localhost:8086/check-token',
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        data: {
          token: _token
        },
        success: function(res) {
          if(res.data.success) {
            wx.navigateTo({
              url: '/pages/tutor/tutorGuide/tutorGuide'
            })
          }
          else {
            wx.navigateTo({
              url: '/pages/index/index?loginType=0',
            })
          }
        }
      })
    }
  },
  /**
   * 牛人进入个人详情
   */
  geniusBitp: function (e) {
    let that = this
    console.log(e);
    if (that.data.hotField) {
      let _geniusId = e.currentTarget.dataset.geniusid
      let typeNum = 1
      let _reType = e.currentTarget.dataset.retype
      console.log(_reType);
      let _index = e.currentTarget.dataset.index
      let _info_item
      if(_reType == 1){
        _info_item = JSON.stringify(that.data.recommendBySchoolPeopleList[_index]) 
      }
      else{
        _info_item = JSON.stringify(that.data.recommendByFieldPeopleList[_index]) 
      }
      let _scholarInfo = encodeURIComponent(_info_item)
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?personId=' + _geniusId + "&type=" + typeNum + "&scholarInfo=" + _scholarInfo
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }

  },
  /**
   * 热门领域、更多，其实是进入了风云榜页面
   */
  fieldsMoreBitp: function () {
    let _type = 1
    wx.setStorageSync("fieldsId", '18718757104')
    wx.setStorageSync("fieldsType", '信息科学')
    wx.switchTab({
      url: '/pages/firstField/firstField?type=' + _type
    })
  },
  /**
   * 热门领域、一级领域进入风云榜
   */
  hotFieldsBitp: function (e) {
    let that = this
    let _fieldsId = that.data.hotOneFieldList.fieldId
    let _fieldName = that.data.hotOneFieldList.fieldName
    let _type = 1
    wx.setStorageSync("fieldsId", _fieldsId)
    wx.setStorageSync("fieldsType", _fieldName)
    // wx.setStorageSync("type", _type)
    wx.switchTab({
      url: '/pages/firstField/firstField?type=' + _type
    })
  },
  /**
   * 热门领域、二级领域进入列表
   */
  hotAppletsBitp: function (e) {
    let that = this
    let _typeNum = 1
    let _index = e.currentTarget.dataset.index
    let _fields_id = that.data.hotAppletsFieldList[_index].fieldId
    let _title = that.data.hotAppletsFieldList[_index].fieldName
    let _innovationIndex = that.data.hotAppletsFieldList[_index].innovationIndex
    let _increase = that.data.hotAppletsFieldList[_index].increase
    let _increasePercentage = that.data.hotAppletsFieldList[_index].increasePercentage
    let _oneFirldId = that.data.hotOneFieldList.fieldId
    wx.navigateTo({
      url: '/pages/firstField/secondField/secondField?fieldId=' + _fields_id + '&typeNum=' + _typeNum + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&oneFirldId=' + _oneFirldId
    })
  },
  /**
   * 高校进入详情
   */
  orgztionBitp: function (e) {
    let that = this
    if (that.data.hotField) {
      let _orgid = e.currentTarget.dataset.orgid
      let typeNum = 2
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _orgid + "&type=" + typeNum
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }
  },
  /**
   * 进入PK页
   */
  pkBitp: function (e) {
    if (this.data.hotField) {
      let _type = e.currentTarget.dataset.type
      if (_type == 0) {
        console.log(0)
      } else if (_type == 1) {
        console.log(1)
      } else if (_type == 2) {
        console.log(2)
      }
      wx.navigateTo({
        url: '/pages/pk/pk?type=' + _type
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
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
        if (res.data.code == 200) {
          wx.setStorageSync("personId", res.data.data.id)
          let _token = wx.getStorageSync('token')
          api.fetchRequest('users/detail', {}, 'GET', 0, {
            'Authorization': 'Bearer' + _token
          }).then(function (res) {
            let code = res.data.code;
            if (code == 200) {
              wx.setStorageSync("original", res.data.data.original)
              wx.setStorageSync("vertexId", res.data.data.vertexId)
              if (res.data.data.primaryField != null && res.data.data.fieldLevel2 != null && res.data.data.fieldLevel2.length > 0) {
                if (that.data.geniusPeopleList.length == 0) {
                  wx.setStorageSync('vertexId', res.data.data.vertexId)
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: '请选择领域',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/index/indexFields/indexFields',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
      return;
    }
  },

})