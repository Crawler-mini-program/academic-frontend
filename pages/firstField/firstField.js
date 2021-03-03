// 一级风云榜、排名信息
var app = getApp();
var page = 0;
var num = 10;
var _orgType = ''
const api = require("../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore: true,
    isLoadMore: true,
    isHideLoadMoreTalents: true,
    isLoadMoreTalents: true,
    currentTab: 0,
    typeNum: 1,
    apifields: [],
    apifieldsMsg: [],
    apifieldsTalents: [],
    index: 0,
    nowRole: 0,
    currentIndex: 0,
    currentIndexTop: 0,
    tabBoo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.apiFields()
    let _type = wx.getStorageSync("type")
    if (_type != "") {
      that.setData({
        typeNum: _type
      })
    }

  },
  onShow: function() {
    let that = this
    that.homeType()
  },
  // onReady是初始化页面用的，后面很多函数都会手动调用
  onReady: function() {
    let that = this
    if (that.data.currentIndex == 0 && that.data.nowRole == 0) {
      if (that.data.typeNum == 1) {
        that.apiFieldsMsgScholar()
      } else {
        if (that.data.typeNum == 2) {
          _orgType = 'university'
        } else if (that.data.typeNum == 3) {
          _orgType = 'institution'
        }
        that.apiFieldsMsgUnivsty()
      }
    } else if (that.data.currentIndex == 1 || that.data.nowRole == 1) {
      if (that.data.typeNum == 1) {
        that.apiFieldsTalentsScholar()
      } else {
        if (that.data.typeNum == 2) {
          _orgType = 'university'
        } else if (that.data.typeNum == 3) {
          _orgType = 'institution'
        }
        that.apiFieldsTalentsUnivsty()
      }
    }
  },
  /**一级领域列表、顶部tab */
  apiFields: function() {
    let that = this
    api.fetchRequest('fields')
      .then(function(res) {
        if (res.data.code == 200) {
          that.setData({
            apifields: res.data.data
          })
          if (that.data.tabBoo) {
            that.apiFieldsMsgScholar()
          }
        }
      })
  },
  /**
   * 获取人才的子领域列表
   *  */
  apiFieldsMsgScholar: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    // 获取领域id
    if (that.data.apifields.length == 0) {
      that.apiFields()
      that.setData({
        tabBoo: true
      })
    } else {
      if (that.data.currentTab == 0) {
        wx.setStorageSync('fieldsId', that.data.apifields[0].id)
      }
      let fieldsId = wx.getStorageSync("fieldsId")
      api.fetchRequest("rank/top-talent-and-field", {
        fieldId: fieldsId,
        page: page,
        num: num
      }).then(function(res) {
        if (res.data.code == 200) {
          if (res.data.data.length != 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              let _apifieldsMsg = that.data.apifieldsMsg
              _apifieldsMsg.push(res.data.data[i])
              that.setData({
                apifieldsMsg: _apifieldsMsg,
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
    }
  },
  /**
   * 获取人才的总排名
   */
  apiFieldsTalentsScholar: function() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      "mask": true
    })
    if (that.data.currentTab == 0) {
      wx.setStorageSync('fieldsId', that.data.apifields[0].id)
    }
    let fieldsId = wx.getStorageSync("fieldsId")
    api.fetchRequest('rank/top-talents-by-field', {
      fieldId: fieldsId,
      page: page,
      num: '15'
    }).then(function(res) {
      if (res.data.code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _apifieldsTalents = that.data.apifieldsTalents
            _apifieldsTalents.push(res.data.data[i])
            that.setData({
              apifieldsTalents: _apifieldsTalents,
              isHideLoadMoreTalents: true,
              isLoadMoreTalents: true,
            })
          }
        } else {
          that.setData({
            isHideLoadMoreTalents: true,
            isLoadMoreTalents: false,
          })
        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 获取高校、机构的子领域列表
   */
  apiFieldsMsgUnivsty: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    // 获取领域id
    if (that.data.currentTab == 0) {
      wx.setStorageSync('fieldsId', that.data.apifields[0].id)
    }
    let fieldsId = wx.getStorageSync("fieldsId")
    api.fetchRequest("rank/top-organizations-by-orgType-field", {
      fieldId: fieldsId,
      orgType: _orgType,
      page: page,
      num: num
    }).then(function(res) {
      if (res.data.code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _apifieldsMsg = that.data.apifieldsMsg
            _apifieldsMsg.push(res.data.data[i])
            that.setData({
              apifieldsMsg: _apifieldsMsg,
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
  /**
   * 获取高校、机构总排名
   */
  apiFieldsTalentsUnivsty: function() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      "mask": true
    })
    if (that.data.currentTab == 0) {
      wx.setStorageSync('fieldsId', that.data.apifields[0].id)
    }
    let field = wx.getStorageSync("fieldsId")
    api.fetchRequest('rank/top-organizations-by-orgInnovation', {
      field: field,
      orgType: _orgType,
      sortType: 'innovationIndex',
      page: page,
      num: "15"
    }).then(function(res) {
      if (res.data.code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _apifieldsTalents = that.data.apifieldsTalents
            _apifieldsTalents.push(res.data.data[i])
            that.setData({
              apifieldsTalents: _apifieldsTalents,
              isHideLoadMoreTalents: true,
              isLoadMoreTalents: true,
            })
          }
        } else {
          that.setData({
            isHideLoadMoreTalents: true,
            isLoadMoreTalents: false,
          })
        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 上拉加载
   */
  loadMore: function(e) {
    page++
    let that = this
    if (that.data.currentIndex == 0 || that.data.nowRole == 0) {
      that.setData({
        isHideLoadMore: false,
        isLoadMore: true
      })
      that.onReady()
    } else if (that.data.currentIndex == 1 || that.data.nowRole == 1) {
      that.setData({
        isHideLoadMoreTalents: false,
        isLoadMoreTalents: true
      })
      that.onReady()
    }
  },
  /**
   * 进入个人详情
   */
  personCatchTap: function(e) {
    let that = this
    let _token = wx.getStorageSync('token')
    if (_token) {
      let _index = e.currentTarget.dataset.index
      let _university_id = ''
      if (that.data.currentIndex == 0 || that.data.nowRole == 0) {
        _university_id = that.data.apifieldsMsg[_index].talents[0].id
      } else {
        if (that.data.typeNum == 1) {
          _university_id = that.data.apifieldsTalents[_index].id
        } else {
          _university_id = that.data.apifieldsTalents[_index].orgId
        }
      }
      // 这里的_university_id可以指代人或者机构的id
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _university_id + "&type=" + that.data.typeNum
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }
  },
  /**
   * 风云人物
   */
  manCatchtap: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let _fields_id = ''
    let _university_id = ''
    let _title = ''
    let _innovationIndex = ''
    let _increase = ''
    let _increasePercentage = ''
    let _searchType = 0
    if (that.data.currentIndex == 0 || that.data.nowRole == 0) {
      _fields_id = that.data.apifieldsMsg[_index].id
      _title = that.data.apifieldsMsg[_index].name
      _innovationIndex = that.data.apifieldsMsg[_index].innovationIndex
      _increase = that.data.apifieldsMsg[_index].increase
      _increasePercentage = that.data.apifieldsMsg[_index].increasePercentage
      _university_id = that.data.apifieldsMsg[_index].talents[0].id

    } else {
      _fields_id = that.data.apifieldsTalents[_index].fieldId
      _title = that.data.apifieldsTalents[_index].name
      _innovationIndex = that.data.apifieldsTalents[_index].innovationIndex
      _increase = that.data.apifieldsTalents[_index].increase
      _increasePercentage = that.data.apifieldsTalents[_index].increasePercentage
      _university_id = that.data.apifieldsTalents[_index].orgId

    }
    wx.navigateTo({
      url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fields_id + '&orgId=' + _university_id + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
    })
  },
  /**
   * 子领域更多
   */
  fieldCatchTap: function(e) {
    let that = this
    let _typeNum = that.data.typeNum
    let _index = e.currentTarget.dataset.index
    let _fields_id = that.data.apifieldsMsg[_index].id
    let _title = that.data.apifieldsMsg[_index].name
    let _innovationIndex = that.data.apifieldsMsg[_index].innovationIndex
    let _increase = that.data.apifieldsMsg[_index].increase
    let _increasePercentage = that.data.apifieldsMsg[_index].increasePercentage
    let _oneFirldId = that.data.apifields[that.data.currentTab].id

    wx.navigateTo({
      url: '/pages/firstField/secondField/secondField?fieldId=' + _fields_id + '&typeNum=' + _typeNum + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&oneFirldId=' + _oneFirldId
    })
  },
  //子领域列表、总排名点击切换
  toggleView: function(event) {
    let that = this;
    let currentIndex = that.data;
    let nowRole = that.data;
    currentIndex = event.target.dataset.index;
    if (currentIndex == '1') {
      nowRole = 1
    } else {
      nowRole = 0
    }
    that.setData({
      nowRole: nowRole,
      currentIndex
    })
    page = 0
    that.onReady()
  },
  //子领域列表、总排名滑动切换
  toggleSwiper: function(event) {
    let that = this;
    let nowRole = that.data;
    let currentIndex = that.data;
    nowRole = event.detail.current;
    if (nowRole == '1') {
      currentIndex = 1
    } else {
      currentIndex = 0
    }
    that.setData({
      currentIndex: currentIndex,
      nowRole
    })
    page = 0
    that.onReady()
  },
  /**
   * 点击tabbar切换领域
   */
  switchTab(e) {
    let that = this
    // 这里的dataset是对应wxml中的data-type等等那一堆
    let type = e.currentTarget.dataset.type
    let indexId = e.currentTarget.dataset.index
    /**********************点击tab判断类型********************** */
    let _apifields = that.data.apifields
    // 这里加个判断的原因可能是防止误触？
    if (type == _apifields[indexId].name) {
      this.setData({
        currentTab: indexId,
        currentIndex: 0,
        nowRole: 0,
        apifieldsMsg: [],
        apifieldsTalents: []
      })
    }
    page = 0
    //根据index获取id
    let switchTab_id = that.data.apifields[indexId].id
    //存储id
    wx.setStorageSync("fieldsId", switchTab_id)
    that.onReady()
  },
  /**
   * 监听页面卸载
   */
  onUnload: function() {
    let that = this
    page = 0
    let _apifieldsMsg = that.data.apifieldsMsg
    let _apifieldsTalents = that.data.apifieldsTalents
    that.setData({
      apifieldsMsg: [],
      apifieldsTalents: []
    })
  },
  //人才、高校、院所tabbar切换，对应index：0，1，2
  toggleViewTop: function(event) {
    let that = this;
    let topType = 0
    let currentIndexTop = that.data;
    currentIndexTop = event.target.dataset.index;
    if (currentIndexTop == 0) {
      topType = 1
    } else if (currentIndexTop == 1) {
      topType = 2
    } else if (currentIndexTop == 2) {
      topType = 3
    }
    page = 0
    that.setData({
      currentIndexTop,
      currentTab: 0,
      currentIndex: 0,
      nowRole: 0,
      typeNum: topType,
      apifieldsMsg: [],
      apifieldsTalents: []
    })
    that.onReady()
  },
  /**
   * 禁止左右滑动
   */
  stopTouchMove: function() {
    return false
  },
  /**
   * 判断首页一级领域
   */
  homeType: function() {
    let that = this
    let fieldsType = wx.getStorageSync("fieldsType")
    /**************判断首页从哪个一级领域进入***************** */
    let _apifields = that.data.apifields
    if (fieldsType != '') {
      for (let i = 0; i < _apifields.length; i++) {
        if (fieldsType == _apifields[i].name) {
          this.setData({
            typeNum: 1,
            currentIndexTop: 0,
            currentIndex: 0,
            currentTab: 0,
            nowRole: 0,
            apifieldsMsg: [],
            apifieldsTalents: [],
            currentTab: i,
          })
          that.onReady()
          break
        }
      }
    }
  },
  imageError:function(e){
    let that=this
    let image = 'http://img01.guokezy.com/avatars/5d2c148d0f94bb3c44fbd602.jpg'
    let index = e.currentTarget.dataset.index
    let _apifieldsMsg = that.data.apifieldsMsg
    let list = _apifieldsMsg[index].talents[0]
    if (list){
      list.avatarUrl = image
      that.setData({
        apifieldsMsg:_apifieldsMsg
      })
    }

  },
  onHide: function() {
    wx.setStorageSync('fieldsType', '')
    // wx.setStorageSync('fieldsId', '')
  }
})