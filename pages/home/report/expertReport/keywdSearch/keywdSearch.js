//关键词搜索
const api = require("../../../../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cursor: 0,
    searchValue: '',
    msgList: [],
    index: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _index = options.index
    that.setData({
      index: _index
    })
  },

  /**
   * 获取输入框的内容
   */

  listenerSearchInput: function(e) {
    let that = this
    let _cursor = e.detail.cursor
    if (_cursor != that.data.cursor) {
      that.setData({
        cursor: _cursor,
        searchValue: e.detail.value
      })
      // 假设现在需要检测到用户输入的值，用户 500 毫秒内没有继续输入就将该值打印出来
      that.throttle(this.queryData, null, 500, this.data.searchValue);
    } else {
      console.log('输入拼音名没有确定输入内容, 不搜索')
    }

  },
  // 节流
  throttle: function(fn, context, delay, text) {
    clearTimeout(fn.timeoutId);
    fn.timeoutId = setTimeout(function() {
      fn.call(context, text);
    }, delay);
  },

  // 此处方法里面调用查询接口
  queryData: function(e) {
    let that = this
    console.log(e) // 打印 用户输入的值
    api.fetchRequest('fields/' + e + '/suggest', {
      "pageSize": 20,
      "page": 0
    }, 'GET', '0', {}).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        console.log(res.data.data)
        that.setData({
          msgList: res.data.data
        })
      }
    })
  },
  /**
   * 点击item获取名称
   */
  itemBitp: function(e) {
    let that = this
    let _name=''
    let _type = e.currentTarget.dataset.type
    if (_type =="search"){
      _name = that.data.searchValue
    }else{
      _name = e.currentTarget.dataset.name
    }
    var pages = getCurrentPages();
    //获取的是一个数组，第一个元素是上一个页面，第二个元素是该页面
    var prevPage = pages[pages.length - 2];
    // 此处设置的是最后一个条件的名称和在原页面数组中的索引值
    prevPage.setData({
      name: _name,
      index: that.data.index
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  }

})