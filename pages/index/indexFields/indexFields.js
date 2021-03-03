//选择领域
const api = require("../../../utils/request.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityBoo: false,
    fieldIdArray: [],
    apifields: [],
    apifieldsTwo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.oneFields()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 一级领域获取数据
   */
  oneFields: function() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    api.fetchRequest('fields')
      .then(function(res) {
        if (res.data.code == 200) {
          that.setData({
            apifields: res.data.data
          })
        }
        wx.hideLoading()
      })

  },
  /**
   *  点击一级领域
   * */
  filter: function(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _index = e.currentTarget.dataset.index
    let _cityBoo = true
    if (!_cityBoo) {
      _cityBoo = false
    } else {
      _cityBoo = true
    }
    /**
     * 上传一级领域id到后台
     */

    let _token = wx.getStorageSync('token')
    api.fetchRequest('accounts/like-field?level=1', {
      'fieldId': [that.data.apifields[_index].id]
    }, 'POST', 0, {
      "content-Type": "application/json",
      'Authorization': 'Bearer' + _token
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        console.log('成功')
      }
    })
    /**
     * 根据一级领域id获取二级领域数据
     */
    api.fetchRequest('fields' + '/' + that.data.apifields[_index].id + '/children').then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          apifieldsTwo: res.data.data,
        })
        let _apifieldsTwo = that.data.apifieldsTwo
        for (let i = 0; i < _apifieldsTwo.length; i++) {
          _apifieldsTwo[i].isChack = false
        }
        that.setData({
          apifieldsTwo: _apifieldsTwo,
        })
      }
      wx.hideLoading()
    })
    that.setData({
      place_id: _index,
      cityBoo: _cityBoo,
      fieldIdArray: []
    });
  },
  /**
   * 点击二级领域、多选
   */
  filterBitp: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index

    let _fieldIdArray = that.data.fieldIdArray
    let _id = that.data.apifieldsTwo[_index].id
    let _isChack = that.data.apifieldsTwo[_index].isChack
    let ckack = "apifieldsTwo[" + _index + "].isChack"
    if (!_isChack) {
      _fieldIdArray.push(_id)
    } else {
      for (let i = 0; i < _fieldIdArray.length; i++) {
        if (_fieldIdArray[i] == _id) {
          _fieldIdArray.splice(i, 1)
          break;
        }
      }
    }
    console.log(_fieldIdArray)
    that.setData({
      [ckack]: !_isChack,
      fieldIdArray: _fieldIdArray
    })
  },
  /**
   * 完成按钮
   */
  finishBitp: function() {
    let that = this
    if (!that.data.cityBoo) {
      wx.showToast({
        title: '请选择一级领域',
        icon: 'none',
        duration: 1000
      })
    } else{
      if (that.data.fieldIdArray == null || that.data.fieldIdArray.length == 0) {
        wx.showToast({
          title: '请选择二级领域',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        /**
      * 上传二级领域id到后台
      */
        let _token = wx.getStorageSync('token')
        api.fetchRequest('accounts/like-field?level=2', {
          'fieldId': that.data.fieldIdArray
        }, 'POST', 0, {
            "content-Type": "application/json",
            'Authorization': 'Bearer' + _token
          }).then(function (res) {
            let code = res.data.code;
            if (code == 200) {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }
            wx.hideLoading()
          })
      }
    }
     
  }
})