const api = require("../../../utils/request.js")
var pageNo=0
var pageSize=100
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: false, 
    dataMsg: [],
    searchMsg:"", //输入框输入的内容
    fieldName:'', //一级领域name
    fieldId: '', //一级领域id
    isHideLoadMore: true,
    isLoadMore: true,
    searchFocus: false  //恶心人的需求  focus时必须保持点击item的时候不收起键盘，然后点击item时focus失焦，关闭软键盘
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this
    that.getData()
  },

  getData:function(){
    let that = this
    // let _token = wx.getStorageSync('token')
    wx.request({
      url: 'http://47.92.240.36/academic/api/v1/fields/super-course',
      method: 'GET',
      header: {
        'content-type': 'application/json'
       },
      data: {
        content: that.data.searchMsg,
        pageNo: pageNo,
        pageSize: pageSize
      },
      success: function(res){
        console.log(res);
        let code = res.data.code;
        if (code == 200) {
          let data = res.data.data
          if (data!=null && data.length>0){
            that.setData({
              dataMsg: data,
              isHideLoadMore: true,
              isLoadMore: true,
            })
          }else{
            that.setData({
              dataMsg: [],
              isLoadMore:false
            })
          } 
        }
        wx.hideLoading()
      }
    })

    // api.fetchRequest('fields/super-course', {
    //   content: that.data.searchMsg,
    //   pageNo: pageNo,
    //   pageSize: pageSize
    // }, 'GET', 0, {
    //     'Authorization': 'Bearer' + _token
    //   }).then(function (res) {
    //     let code = res.data.code;
    //     if (code == 200) {
    //       let data = res.data.data
    //       if (data!=null && data.length>0){
    //         that.setData({
    //           dataMsg: data,
    //           isHideLoadMore: true,
    //           isLoadMore: true,
    //         })
    //       }else{
    //         that.setData({
    //           dataMsg: [],
    //           isLoadMore:false
    //         })
    //       }
          
    //     }
    //     wx.hideLoading()
    //   })
  },

  /**
   * 获取输入框的内容，即改变searchMsg的值
   */
  listenerSearchInput: function (e) {
    let that=this
    let value = e.detail.value
    this.setData({
      searchMsg: value
    })
    if (value==""){
      that.getData()
    }else{
      setTimeout(function(){
        that.toSearch()
      },1000)
      
    }
  },
  /**
   *  点击下拉框
   */
  bindShowMsg() {
    let that = this
    that.setData({
      // select: !that.data.select
      select: true,
      searchFocus:true
    })
  },

  /**
   * 点击搜索按钮
   */
  toSearch: function (e) {
    let that = this
    let _searchMsg = that.data.searchMsg
    if (_searchMsg == '' || _searchMsg == null) {
      // wx.showToast({
      //   title: '请输入搜索内容',
      //   icon: 'none'
      // })
      return
    }
    if(!that.data.select){
      that.setData({
        select:true
      })
    }
    pageNo = 0
    that.getData()

  },
  /**
   * 专业列表
   */
  selectBitp:function(e){
    let that=this
    let _index = e.currentTarget.dataset.index
    let dataMsg = that.data.dataMsg
    let courseName = dataMsg[_index].courseName
    let fieldName = dataMsg[_index].fieldName
    let fieldId = dataMsg[_index].fieldId
    that.setData({
      searchMsg: courseName,
      fieldName: fieldName,
      fieldId: fieldId,
      select: false,
      searchFocus:false
    })
  },

  /**
   * 下一步
   */
  startBitp:function(){
    let that=this
    let id = that.data.fieldId;
    let name = that.data.fieldName;
    let searchMsg = that.data.searchMsg;
    if(id!=0){
      wx.navigateTo({
        url: '/pages/tutor/tutor/tutor?id=' + id + '&name=' + name + '&courseName=' + searchMsg
      })
    }else{
      if (searchMsg != null && searchMsg!=""){
        wx.showToast({
          title: '请选择提示的专业报考，暂不支持手动输入',
          icon: 'none'
        })
        return
      }
      wx.showToast({
        title: '请选择/搜索报考的专业',
        icon:'none'
      })
    }

  },
})