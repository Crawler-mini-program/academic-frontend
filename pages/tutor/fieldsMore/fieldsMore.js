/**
 * 更多领域
 */
const api = require("../../../utils/request.js")
var page=1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldId: 0,
    fieldName:'',
    courseName:'',
    fieldsList:[],
    isHideLoadMore: true,
    isLoadMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.fieldId
    let name = options.fieldName
    let courseName = options.courseName
    this.setData({
      fieldId: id,
      fieldName: name,
      courseName: courseName
    })
    wx.setNavigationBarTitle({ title: "全部专业" })
    page=0
    this.getData(this)

  },
  getData:function(that){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    wx.request({
      url: 'http://47.92.240.36/academic/api/v1/fields/getChildrenField/' + that.data.fieldId,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        parentId: that.data.fieldId,
        courseName: that.data.courseName,
        page: page,
        num: 10
      },
      success: function (res) {
        let code = res.data.code;
        if (code == 200) {
          let data = res.data.data
          let _fieldsList = that.data.fieldsList
          if (data != null && data.length>0){
            for (let i in data){
              _fieldsList.push(data[i])
            }
            that.setData({
              fieldsList: _fieldsList,
              isHideLoadMore: true,
              isLoadMore: true
            })
          }else{
            that.setData({
              isHideLoadMore: true,
              isLoadMore: false
            })
          }
        } else {
          that.setData({
            isHideLoadMore: true,
            isLoadMore: false
          })
        }
        wx.hideLoading()
      }
    })

    // api.fetchRequest('fields/getChildrenField/'+that.data.fieldId, {
    //   courseName: that.data.courseName,
    //   page: page,
    //   num: 20
    // }, 'GET', 0, {
    //     'Authorization': 'Bearer' + _token
    //   }).then(function (res) {
    //     let code = res.data.code;
    //     if (code == 200) {
    //       let data = res.data.data
    //       let _fieldsList = that.data.fieldsList
    //       if (data != null && data.length>0){
    //         for (let i in data){
    //           _fieldsList.push(data[i])
    //         }
    //         that.setData({
    //           fieldsList: _fieldsList,
    //           isHideLoadMore: true,
    //           isLoadMore: true
    //         })
    //       }else{
    //         that.setData({
    //           isHideLoadMore: true,
    //           isLoadMore: false
    //         })
    //       }
    //     } else {
    //       that.setData({
    //         isHideLoadMore: true,
    //         isLoadMore: false
    //       })
    //     }
    //     wx.hideLoading()
    //   })
  },
  /**
   * item
   */
  itemBitp: function (e) {
    let _type =  0
    wx.showModal({
      content: '下载app查看领域学术圈哟',
      cancelText: '取消',
      confirmText:'去下载',
      success(res) {
        if (res.confirm) { 
          wx.navigateTo({
            url: '/pages/mine/downloadApp/downloadApp?type=' + _type
          })
        } else if (res.cancel){}
      }
    })
  },
  /**
   * 报考
   */
  enterBitap:function(e){
    let that=this
    let _index = e.currentTarget.dataset.index
    let fieldsList = that.data.fieldsList
    let id = fieldsList[_index].field
    let name = fieldsList[_index].name
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      type: "fields",
      moreId: id,
      moreName: name,
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  },
  /**
     * 上拉加载
     */
  loadMore: function (e) {
    let that = this
    page++
    that.setData({
      isHideLoadMore: false,
      isLoadMore: true
    })
    that.getData(that)

  },
})