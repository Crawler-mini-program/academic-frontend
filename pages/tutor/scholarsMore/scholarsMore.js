const api = require("../../../utils/request.js")
var page=0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    secondFieldId: 0,
    secondFieldName:"",
    orgId: 0,
    orgName:"",
    isLoadMore: true,
    isHideLoadMore: true,
    scholarList:[],
    select:false //判断app引导页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let secondFieldId = options.secondFieldId
    let secondFieldName = options.secondFieldName
    let orgName = options.orgName
    let orgId = options.orgId
    this.setData({
      secondFieldId: secondFieldId,
      secondFieldName: secondFieldName,
      orgName: orgName,
      orgId: orgId
    })
    wx.setNavigationBarTitle({
      title: orgName+"-"+secondFieldName+"导师排行"
    })
    page = 0
    this.getData(this)
  },

  getData: function (that) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    api.fetchRequest('scholars/getOutTeacher', {
      orgId:that.data.orgId,
      fieldId: that.data.secondFieldId,
      page: page,
      num: 10
    }, 'GET', 0, {
        'Authorization': 'Bearer' + _token
      },true).then(function (res) {
        let code = res.data.code;
        if (code == 200) {
          let data = res.data.data
          let _scholarList = that.data.scholarList
          if(data!=null&&data.length>0){
            for (let i in data) {
              _scholarList.push(data[i])
            }
            that.setData({
              scholarList: _scholarList,
              isLoadMore:false
            })
          }
        }
        wx.hideLoading()
      })

  },

  itemBitp:function(e){
      // let that = this
  //     that.setData({
  //       select: !that.data.select
  //     })
    let id = e.currentTarget.dataset.id
    let typeNum = 1
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + id + "&type=" + typeNum
    })

  },

  /**
   * 点击下载
   */
  downBitp: function (e) {
    let _type = 0
    wx.navigateTo({
      url: '/pages/mine/downloadApp/downloadApp?type=' + _type
    })
  },
  /**
   * showDialog
   */
  showDialogBitp: function (e) {
    let _type = 0
    wx.showModal({
      content: '下载app查看全部导师排行',
      cancelText: '取消',
      confirmText: '去下载',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/mine/downloadApp/downloadApp?type=' + _type
          })
        } else if (res.cancel) { }
      }
    })
  },
  /**
   * 点击邮箱
   */
  emailCatap:function(){
    let _type = 0
    wx.showModal({
      content: '下载知兔app查看导师邮箱哟',
      cancelText: '取消',
      confirmText: '去下载',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/mine/downloadApp/downloadApp?type=' + _type
          })
        } else if (res.cancel) { }
      }
    })
  },
  /**
     * 点击关注
     */
  attentionBitp: function (e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _index = e.currentTarget.dataset.index
    let _scholarList = that.data.scholarList
    
    let _follow = _scholarList[_index].follow
    let _scholarId = _scholarList[_index].scholarId
    var _token = wx.getStorageSync('token');
    let attentionType = 'people'
    if (_follow) {
      api.fetchRequest('users/unFollow?type=' + attentionType + '&followeeId=' + _scholarId, {}, 'DELETE', 0, {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer' + _token
      }).then(function (res) {
        let code = res.data.code;
        if (code == 200) {
          var _follow = "scholarList[" + _index + "].follow"
          that.setData({
            [_follow]: false
          })
        }
      })
    } else {
      api.fetchRequest('users/follow', {
        type: attentionType,
        followeeId: _scholarId
      }, 'POST', 0, {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer' + _token
        }).then(function (res) {
          let code = res.data.code;
          if (code == 200) {
            var _follow = "scholarList[" + _index + "].follow"
            that.setData({
              [_follow]: true
            })
          }
        })
    }
    wx.hideLoading()
  },
  /**
   * 页面卸载
   */
  onUnload:function(){
    let that=this
    let scholarList = that.data.scholarList
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    let _scholarList = []
    for (let i in scholarList){
      if(i<2){
        _scholarList.push(scholarList[i])
      }
    }
    prevPage.setData({
      moreScholar: _scholarList,
      moreBack:"scholarBack"
    })
    // wx.navigateBack({ //返回
    //   delta: 1
    // })
  }
})