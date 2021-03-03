//专家列表报告
const api = require("../../../../utils/request.js")
var cityJson = require("../../../../utils/cityJson.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 普通选择器列表设置,及初始化
    countryList: ['全国'],
    countryIndex: 0,
    // 省市区三级联动初始化
    region: ["四川省"],
    selectTitle: [],
    keywordsNum: 1,
    fieldsList: [],
    index: 0,
    name: '',
    keywdName: ['请输入领域或技术名称', '请输入领域或技术名称', '请输入领域或技术名称', '请输入领域或技术名称', '请输入领域或技术名称'],
    emailInput:'',
    numInput:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _cityJson = cityJson.proJson
    let _countryList = that.data.countryList
    for (let i = 0; i < _cityJson.length; i++) {
      let _item_code = _cityJson[i].item_code
      if (_item_code.length > 5 && _item_code.substring(2, 6) == "0000") {
        _countryList.push(_cityJson[i].item_name)
      }
    }
    that.setData({
      countryList: _countryList
    })
  },

  onShow: function() {
    let that = this
    let _fieldsList = that.data.fieldsList
    let _keywdName = that.data.keywdName
    /**关键词搜索、回跳当前页传回数据
     * fieldsList 存储传回的数据，用于接口-----暂时未用
     * keywdName  关键词显示的名称
     * **/
    // keywdsearch中传过来的name和index
    if (that.data.name != '') {
      _keywdName[that.data.index] = that.data.name
      _fieldsList.push(that.data.name)
      that.setData({
        keywdName: that.data.keywdName
      })
    }
  },
  // 选择地区
  changeCountry: function(e) {
    this.setData({
      countryIndex: e.detail.value
    });
  },
  /**
   * 关键词搜索
   */
  keywordsBitp: function(e) {
    let that = this
    // 这里就把最后一栏的index获取到了，然后赋值给data中的index，给keywdsearch使用
    let _index = e.currentTarget.dataset.index
    that.setData({
      index: _index,
      name: ''
    })
    wx.navigateTo({
      url: '/pages/home/report/expertReport/keywdSearch/keywdSearch?index=' + _index
    })
  },
  /**
   * 关键词---添加
   */
  keywordsAddCatap: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    if (that.data.keywordsNum >= 5) {
      wx.showToast({
        title: '最多添加5个领域或技术名称',
        icon: 'none'
      })
      return
    }

    if (that.data.fieldsList[_index] == null) {
      wx.showToast({
        title: '请输入领域或技术名称',
        icon: 'none'
      })
      return
    }
    // 这里虽然只给keywordsnum加了1，但是因为显示搜索栏的循环就是按照keywordsnum循环的
    // 因此keywordsnum加1之后相当于加了一个view，达到加了一个搜索栏的效果
    that.setData({
      keywordsNum: that.data.keywordsNum + 1
    })

  },
  /**
   * 关键词---删除
   */
  keywordsDeleteCatap: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    if (that.data.keywordsNum == 1) {
      wx.showToast({
        title: '已经是最后一个了',
        icon: 'none'
      })
      return
    }
    //点击删除同时根据index删除keywdName、fieldsList 中的内容
    that.data.keywdName[that.data.index] = "请输入领域或技术名称"
    that.data.fieldsList.splice(that.data.index, 1);
    // 同样，keywordsnum-1之后，当前循环中的最后一个view就不展示了，相当于少了一个栏
    that.setData({
      keywordsNum: that.data.keywordsNum - 1,
      keywdName: that.data.keywdName,
      fieldsList: that.data.fieldsList
    })
  },
  /**
   * 职称-选择
   */
  selectBitp: function() {
    let that = this
    wx.navigateTo({
      url: '/pages/home/report/expertReport/selectTitle/selectTitle'
    })
  },
  /**
   * 输入邮箱内容
   */
  listenerEmailInput:function(e){
    this.setData({
      emailInput: e.detail.value
    })
  },
  /**
   * 输入人数
   */
  listenerNumInput:function(e){
    this.setData({
      // detail里可以包含值，此处的value就是输入框中的值
      numInput: e.detail.value
    })
  },
  /**
   * 点击生成专家列表报告
   */
  commitBitp: function() {
    let that = this
    if (that.data.fieldsList[0] == null) {
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