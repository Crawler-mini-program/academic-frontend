//二级领域
const api = require("../../../../utils/request.js")
var num = 10
var page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldId: '',
    orgId: '',
    fieldMsg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _fieldId = options.fieldId
    let _orgId = options.orgId
    that.setData({
      fieldId: _fieldId,
      orgId: _orgId
    })
    that.apiNetField()
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 加载数据
   */
  apiNetField: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _token = wx.getStorageSync('token')
    api.fetchRequest('questions/getOrganizationIndexFieldNew/' + that.data.fieldId, {
      orgId: that.data.orgId
    }, 'GET', 0, {
      'Authorization': 'Bearer' + _token
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          fieldMsg: res.data.data
        })
        console.log(that.data.fieldMsg)
        wx.hideLoading()
      }
    })
  },
  /**
   * 进入人才排行榜
   */
  fieldsBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;

    let _innovationIndex = 0
    let _increase = 0
    let _increasePercentage = 0
    let _searchType = 2
    let _fieldsId = that.data.fieldMsg[_index].id
    let _orgId = that.data.orgId
    let _title = that.data.fieldMsg[_index].name
    wx.navigateTo({
      url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fieldsId + '&orgId=' + _orgId + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
    })
  }

})