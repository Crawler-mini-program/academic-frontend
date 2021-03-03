// 论文开题报告、技术分析报告
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    keywordsInputName:'请输入您所要查找的技术名称',
    bottomName:'生成开题报告',
    emailInput:'',
    msgInput:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let _type=options.type
    that.setData({
      type: _type
    })
    if(_type==0){
      wx.setNavigationBarTitle({
        title: '开题报告',
      })
      that.setData({
        keywordsInputName: '请输入您所要查找的技术名称',
        bottomName: '生成开题报告'
      })
    }else if(_type==1){
      wx.setNavigationBarTitle({
        title: '技术报告',
      })
      that.setData({
        keywordsInputName: '请输入您所要查找的技术名称(如：人工智能)',
        bottomName: '生成技术报告'
      })
    }
  },
  /**
 * 输入邮箱内容
 */
  listenerEmailInput: function (e) {
    this.setData({
      emailInput: e.detail.value
    })
  },
  /**
   * 输入技术名称
   */
  listenerMsgsInput: function (e) {
    this.setData({
      msgInput: e.detail.value
    })
  },
  /**
   * 点击生成报告
   */
  commitBitp: function () {
    let that = this
    if (that.data.msgInput == '' ||that.data.msgInput == null) {
      wx.showToast({
        title: '请输入领域或技术名称',
        icon: 'none'
      })
      return
    }
    if (that.data.emailInput == '' || that.data.emailInput == null) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '小程序暂不支持生成报告，如要生成报告请前往APP进行操作',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          var _type = 1;
          wx.navigateTo({
            url: '/pages/mine/downloadApp/downloadApp?type=' + _type,
          })
        }
      }
    })

  }
})