var app = getApp();
var orgType = ''
var orgType = ''
var page = 0
var num = 20
const api = require("../../../utils/request.js")
// 二级风云榜
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    seedfieldId: '',
    oneFirldId: '',
    // isHideRefresh: true,
    isHideLoadMore: true,
    isLoadMore: true,
    secondName: "",
    innovationIndex: "",
    increase: "",
    increasePercentage: "",
    fieldsMsg: [],
    orgMsg: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    let _seedfieldId = options.fieldId;
    let _typeNum = options.typeNum;
    let _name = options.name;
    let _innovationIndex = options.innovationIndex;
    let _increase = options.increase;
    let _increasePercentage = options.increasePercentage;
    let _oneFirldId = options.oneFirldId;
    if (_name != null) {
      wx.setNavigationBarTitle({
        title: _name,
      });
    };
    that.setData({
      type: _typeNum,
      innovationIndex: _innovationIndex,
      increase: _increase,
      increasePercentage: _increasePercentage,
      secondName: _name,
      seedfieldId: _seedfieldId,
      oneFirldId: _oneFirldId
    })

    if (_typeNum == 1) {
      orgType = 'scholar'
      that.apiScholarMsg()
    } else {
      if (_typeNum == 2) {
        orgType = 'university'
      } else if (_typeNum == 3) {
        orgType = 'institution'
      }
      that.apiUni_orgMsg()
    }
    that.apiFields()
  },
  /**
   * 获取人才的排名
   */
  apiScholarMsg: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest('rank/top-talents-by-field', {
      fieldId: that.data.seedfieldId,
      sortType: "innovationIndex",
      page: page,
      num: num
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _orgMsg = that.data.orgMsg
            _orgMsg.push(res.data.data[i])
            that.setData({
              orgMsg: _orgMsg,
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
   * 获取高校、院所的排名
   */
  apiUni_orgMsg: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest('rank/top-organizations-by-orgInnovation', {
      field: that.data.seedfieldId,
      sortType: "innovationIndex",
      orgType: orgType,
      page: page,
      num: num
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _orgMsg = that.data.orgMsg
            _orgMsg.push(res.data.data[i])
            that.setData({
              orgMsg: _orgMsg,
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


  /*
   *获取一级领域的指数、涨幅信息 
   * */
  apiFields: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _fieldsId = that.data.oneFirldId
    api.fetchRequest('fields/' + _fieldsId + '/field-total-statistics-orgType/' + orgType)
      .then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          let tep = that.data.fieldsMsg;
          tep.push(res.data.data)
          that.setData({
            fieldsMsg: tep,
            increase: that.data.increase,
            increasePercentage: that.data.increasePercentage
          })
        }
      })
  },
  //风云人物
  manCatchat: function(e) {
    var that = this;
    var _index = e.currentTarget.dataset.index;
    let _fields_id = that.data.orgMsg[_index].fieldId
    let _university_id = that.data.orgMsg[_index].orgId
    let _title = that.data.orgMsg[_index].name
    let _innovationIndex = that.data.orgMsg[_index].innovationIndex
    let _increase = that.data.orgMsg[_index].increase
    let _increasePercentage = that.data.orgMsg[_index].increasePercentage
    let _searchType = 0
    wx.navigateTo({
      url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fields_id + '&orgId=' + _university_id + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
    })
  },
  /**
   * 进入个人详情
   */
  personCatchTap: function(e) {
    let that = this
    let _token = wx.getStorageSync('token')
    if (_token) {
      var _index = e.currentTarget.dataset.index;
      let _fields_id = ''
      if (that.data.type == 1) {
        _fields_id = that.data.orgMsg[_index].id
      } else {
        _fields_id = that.data.orgMsg[_index].orgId
      }
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _fields_id + "&type=" + that.data.type
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
   * 下拉刷新
   */
  // refresh: function (e) {
  //   let that = this
  //   that.setData({
  //     isHideRefresh: false,
  //     isHideLoadMore: true,
  //     isLoadMore: true
  //   })
  //   page = 0
  //   let _typeNum=that.data.type
  //   let _orgMsg = that.data.orgMsg
  //   if (_orgMsg != null) {
  //     _orgMsg = []
  //     that.setData({
  //       orgMsg: _orgMsg
  //     })
  //   }
  //   if (_typeNum==1){
  //     that.apiScholarMsg()
  //   }else{
  //     if (_typeNum == 2) {
  //       orgType = 'university'
  //     } else if (_typeNum == 3) {
  //       orgType = 'institution'
  //     }
  //     that.apiUni_orgMsg()
  //   }
  // },
  /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    that.setData({
      // isHideRefresh: true,
      isHideLoadMore: false,
      isLoadMore: true
    })
    let _typeNum = that.data.type
    page++
    if (_typeNum == 1) {
      that.apiScholarMsg()
    } else {
      if (_typeNum == 2) {
        orgType = 'university'
      } else if (_typeNum == 3) {
        orgType = 'institution'
      }
      that.apiUni_orgMsg()
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    page = 0
    if (that.data.orgMsg.length != 0) {
      let _orgMsg = that.data.orgMsg = []
      that.setData({
        orgMsg: _orgMsg
      })
    }
  },
  onReady: function() {

  }
})