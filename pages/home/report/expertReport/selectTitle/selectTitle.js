//选择职称
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectMsgList: [{
      "selectName": "院士"
    }, {
      "selectName": "千人计划"
    }, {
      "selectName": "万人计划"
    }, {
      "selectName": "长江学者"
    }, {
      "selectName": "杰出青年"
    }, {
      "selectName": "教授"
    }, {
      "selectName": "副教授"
    }, {
      "selectName": "助理教授"
    }, {
      "selectName": "讲师"
    }, {
      "selectName": "研究员"
    }, {
      "selectName": "副研究员"
    }, {
      "selectName": "助理研究员"
    }, {
      "selectName": "主任医师"
    }, {
      "selectName": "副主任医师"
    }, {
      "selectName": "主治医师"
    }, {
      "selectName": "医师"
    }, {
      "selectName": "医士"
    }, {
      "selectName": "主任药师"
    }, {
      "selectName": "副主任药师"
    }, {
      "selectName": "主管药师"
    }, {
      "selectName": "执业药师"
    }, {
      "selectName": "研究馆员"
    }, {
      "selectName": "副研究馆员"
    }, {
      "selectName": "工程师"
    }, {
      "selectName": "助理工程师"
    }, {
      "selectName": "技术员"
    }, {
      "selectName": "实验师"
    }, {
      "selectName": "实验员"
    }, {
      "selectName": "助理讲师"
    }],
    selectMsg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _selectMsgList = that.data.selectMsgList
    // 初始化为均未选择
    for (let i = 0; i < _selectMsgList.length; i++) {
      _selectMsgList[i].select = false
    }
    that.setData({
      selectMsgList: _selectMsgList
    })
    console.log(that.data.selectMsgList)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 选择、取消item
   */
  selectBitp: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let _selectMsgList = that.data.selectMsgList
    let _selectMsg = that.data.selectMsg
    _selectMsgList[_index].select = !_selectMsgList[_index].select
    // 如果已选择，就把已经选好的放到selectMsg数组中，否则利用splice移出数组
    if (_selectMsgList[_index].select) {
      _selectMsg.push(_selectMsgList[_index].selectName)
    } else {
      for (let i = 0; i < _selectMsg.length; i++) {
        if (_selectMsg[i] == _selectMsgList[_index].selectName) {
          _selectMsg.splice(i,1)
        }
      }
    }
    that.setData({
      selectMsgList: _selectMsgList,
      selectMsg: _selectMsg
    })
  },
  /**
   * 点击确定
   */
  commitBitp:function(){
    let that=this
    var pages = getCurrentPages();
    // 依然是获取前一个页面，给前一个页面的数据赋值
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      selectTitle: that.data.selectMsg
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  }
})