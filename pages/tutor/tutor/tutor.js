const api = require("../../../utils/request.js")
var msgList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldId: 0,
    fieldName: "",
    courseName: "",
    backHome: false,
    msgList: [],
    toView: "", //控制scroll滚回底部
    numToView: 0, //控制scroll滚回底部
    type: '',
    moreId: 0, //back当前页接受到的id、name
    moreName: '',
    moreSecondFieldId: 0,
    moreSecondFieldName: '',
    moreScholar: [],
    moreBack: "", //用于判断导师列表页返回
    index: 0, //用来刷新导师关注的状态
    select: false //遮罩层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _id = options.id
    let _name = options.name
    let _courseName = options.courseName
    this.setData({
      fieldId: _id,
      fieldName: _name,
      courseName: _courseName
    })
    this.getFieldsData()
  },
  /**
   * 监听页面显示
   */
  onShow: function () {
    let that = this
    let type = that.data.type
    let _msgList = that.data.msgList
    let _moreBack = that.data.moreBack
    let _moreId = that.data.moreId
    let _moreName = that.data.moreName
    //判断领域、高校、导师列表返回
    if (type == 'fields') {
      that.setData({
        type: ""
      })
      _msgList.push({
        rightContent: '我要报考' + _moreName + '专业',
        resever: 'right'
      })
      setTimeout(function () {
        that.getOrgsData(_moreName, _moreId)
      }, 200) //延迟时间
    } else if (type == 'orgs') {
      that.setData({
        type: ""
      })
      _msgList.push({
        rightContent: '我要报考' + _moreName,
        resever: 'right'
      })
      //获取高校下的人才
      setTimeout(function () {
        that.getScholarsData(that.data.moreSecondFieldId, that.data.moreSecondFieldName, _moreId, _moreName)
      }, 200) //延迟时间
    } else if (type == 'scholars') {

    } else if (_moreBack == "scholarBack") {
      //导师列表关注后返回，改变对话列表的状态
      let _index = that.data.index

      let _msgList = that.data.msgList
      let _moreScholar = that.data.moreScholar
      let msgList = "msgList[" + _index + "].data"
      if (_moreScholar != null && _moreScholar.length > 0) {
        that.setData({
          [msgList]: _moreScholar
        })
      }

    }
  },

  /**
   * 一级领域id获取二级领域
   */
  getFieldsData: function () {
    let that = this
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
        page: 0,
        num: 5
      },
      success: function (res) {
        let code = res.data.code;
        if (code == 200) {
          let data = res.data.data
          let msgList = that.data.msgList
          msgList.push({
            data: data,
            // content: '你好同学，【' + that.data.fieldName + '】专业能够报考的专业如下，选择你想报考的专业吧！',
            content: '你好同学，你选择的学科报考方向如下，选择你想报考的专业吧!',
            type: 'field',
            resever: 'left'
          })
          that.setData({
            msgList: msgList,
          })
        }
        wx.hideLoading()
      }
    })

    // api.fetchRequest('fields/getChildrenField/' + that.data.fieldId, {
    //   courseName: that.data.courseName,
    //   page: 0,
    //   num: 4
    // }, 'GET', 0, {

    //   'Authorization': 'Bearer' + _token
    // }).then(function (res) {
    //   let code = res.data.code;
    //   if (code == 200) {
    //     let data = res.data.data
    //     let msgList = that.data.msgList
    //     msgList.push({
    //       data: data,
    //       // content: '你好同学，【' + that.data.fieldName + '】专业能够报考的专业如下，选择你想报考的专业吧！',
    //       content: '你好同学，你选择的学科报考方向如下，选择你想报考的专业吧!',
    //       type: 'field',
    //       resever: 'left'
    //     })
    //     that.setData({
    //       msgList: msgList,
    //     })
    //   }
    //   wx.hideLoading()
    // })

  },

  enterCatap: function (e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let _itemindex = e.currentTarget.dataset.itemindex
    let _orgIndex = e.currentTarget.dataset.orgindex
    let _type = e.currentTarget.dataset.type
    let _msgList = that.data.msgList
    //type判断当前点击的领域/高校
    if (_type == 'field') {
      let name = _msgList[_index].data[_itemindex].name
      let fieldId = _msgList[_index].data[_itemindex].field
      _msgList.push({
        rightContent: '我要报考' + name + '专业',
        resever: 'right'
      })
      //获取二级领域下的高校
      setTimeout(function () {
        that.getOrgsData(name, fieldId)
      }, 200) //延迟时间
    } else if (_type == 'org') {
      let orgId = _msgList[_index].data[_itemindex].orgId
      let name = _msgList[_index].data[_itemindex].name
      let secondFieldId = _msgList[_index].secondFieldId
      let secondFieldName = _msgList[_index].secondFieldName
      _msgList.push({
        rightContent: '我要报考' + name,
        resever: 'right'
      })
      //获取高校下的人才
      setTimeout(function () {
        that.getScholarsData(secondFieldId, secondFieldName, orgId, name)
      }, 200) //延迟时间
    }
  },
  /**
   * 二级领域id获取高校列表
   */
  getOrgsData: function (name, fieldId) {
    let that = this
    let _msgList = that.data.msgList
    let _token = wx.getStorageSync('token')
    wx.request({
      url: 'http://47.92.240.36/academic/api/v1/rank/top-organizations-by-orgInnovation',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        field: fieldId,
        orgType: 'university',
        sortType: 'innovationIndex',
        page: 0,
        num: 5
      },
      success: function (res) {
          let code = res.data.code;
          if (code == 200) {
            let _data = res.data.data
            _msgList.push({
              secondFieldId: fieldId,
              secondFieldName: name,
              content: '好的，我知道啦！' + name + '专业来看，国内的高校排名如下，请选择你要报考的学校吧',
              data: _data,
              resever: 'left',
              type: 'org',
            })
            that.setData({
              msgList: _msgList,
              toView: that.data.numToView * 600,
              numToView: that.data.numToView + 1,
            })
          }
          wx.hideLoading()
        }
    })

    // api.fetchRequest('rank/top-organizations-by-orgInnovation', {
    //   field: fieldId,
    //   orgType: 'university',
    //   sortType: 'innovationIndex',
    //   page: 0,
    //   num: 4
    // }, 'GET', 0, {
    //   'Authorization': 'Bearer' + _token
    // }).then(function (res) {
    //   let code = res.data.code;
    //   if (code == 200) {
    //     let _data = res.data.data
    //     _msgList.push({
    //       secondFieldId: fieldId,
    //       secondFieldName: name,
    //       content: '好的，我知道啦！' + name + '专业来看，国内的高校排名如下，请选择你要报考的学校吧',
    //       data: _data,
    //       resever: 'left',
    //       type: 'org',

    //     })
    //     that.setData({
    //       msgList: _msgList,
    //       toView: that.data.numToView * 600,
    //       numToView: that.data.numToView + 1,
    //     })
    //     console.log(that.data.msgList)
    //   }
    //   wx.hideLoading()
    // })

  },

  /**
   * 高校id获取导师列表
   */
  getScholarsData: function (secondFieldId, secondFieldName, orgId, orgName) {
    let that = this
    let _msgList = that.data.msgList
    let _token = wx.getStorageSync('token')
    wx.request({
      url: 'http://47.92.240.36/academic/api/v2/scholars/suggest-scholar',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        fieldId: secondFieldId,
        orgId: orgId,
        page: 0,
        num: 2
      },
      success: function (res) {
        let code = res.data.code;
        if (code == 200) {
          let _scholarsList = res.data.data
          _msgList.push({
            orgName: orgName,
            orgId: orgId,
            secondFieldName: secondFieldName,
            secondFieldId: secondFieldId,
            data: _scholarsList,
            content: '嗯嗯，' + orgName + '-' + secondFieldName + '专业的导师按照综合评分如下，评分越高的导师在领域学术活跃度越强呦',
            resever: 'left',
            type: 'scholar',
          })
          that.setData({
            msgList: _msgList,
            toView: that.data.numToView * 900,
            numToView: that.data.numToView + 1,
            backHome: true
          })
        }
      }
    })

    // api.fetchRequest('scholars/getOutTeacher', {
    //   fieldId: secondFieldId,
    //   orgId: orgId,
    //   page: 0,
    //   num: 2
    // }, 'GET', 0, {
    //   'Authorization': 'Bearer' + _token
    // }, true).then(function (res) {
    //   let code = res.data.code;
    //   if (code == 200) {
    //     let _scholarsList = res.data.data
    //     _msgList.push({
    //       orgName: orgName,
    //       orgId: orgId,
    //       secondFieldName: secondFieldName,
    //       secondFieldId: secondFieldId,
    //       data: _scholarsList,
    //       content: '嗯嗯，' + orgName + '-' + secondFieldName + '专业的导师按照综合评分如下，评分越高的导师在领域学术活跃度越强呦',
    //       resever: 'left',
    //       type: 'scholar',
    //     })

    //     that.setData({
    //       msgList: _msgList,
    //       toView: that.data.numToView * 900,
    //       numToView: that.data.numToView + 1,
    //       backHome: true
    //     })
    //     console.log(that.data.msgList)
    //   }
    // })
  },
  /**
   * 回到首页
   */
  backHomeBitp: function () {
    wx.switchTab({
      url: '/pages/home/home',
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
    let _scholarIndex = e.currentTarget.dataset.scholarindex
    let msgList = that.data.msgList

    let _follow = msgList[_index].data[_scholarIndex].follow
    let _scholarId = msgList[_index].data[_scholarIndex].scholarId
    var _token = wx.getStorageSync('token');
    let attentionType = 'people'
    if (_follow) {
      api.fetchRequest('users/unFollow?type=' + attentionType + '&followeeId=' + _scholarId, {}, 'DELETE', 0, {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer' + _token
      }).then(function (res) {
        let code = res.data.code;
        if (code == 200) {
          var _follow = "msgList[" + _index + "].data[" + _scholarIndex + "].follow"
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

          var _follow = "msgList[" + _index + "].data[" + _scholarIndex + "].follow"
          that.setData({
            [_follow]: true
          })
        }
      })
    }
    wx.hideLoading()
  },
  /**
   * 查看全部
   */
  viewMoreBitp: function (e) {
    let that = this
    let _type = e.currentTarget.dataset.type
    let _index = e.currentTarget.dataset.index
    let _itemIndex = e.currentTarget.dataset.itemindex
    let _msgList = that.data.msgList
    let secondFieldId = 0
    let secondFieldName = ""

    if (_type == 'field') {
      wx.navigateTo({
        url: '/pages/tutor/fieldsMore/fieldsMore?fieldId=' + that.data.fieldId + "&fieldName=" + that.data.fieldName + "&courseName=" + that.data.courseName
      })
    } else if (_type == 'org') {
      secondFieldId = _msgList[_index].secondFieldId
      secondFieldName = _msgList[_index].secondFieldName
      wx.navigateTo({
        url: '/pages/tutor/orgsMore/orgsMore?secondFieldId=' + secondFieldId + "&secondFieldName=" + secondFieldName + "&fieldName=" + that.data.courseName
      })
    } else if (_type == 'scholar') {
      that.setData({
        index: _index
      })
      secondFieldId = _msgList[_index].secondFieldId
      secondFieldName = _msgList[_index].secondFieldName
      let orgName = _msgList[_index].orgName
      let orgId = _msgList[_index].orgId
      wx.navigateTo({
        url: '/pages/tutor/scholarsMore/scholarsMore?secondFieldId=' + secondFieldId + "&secondFieldName=" + secondFieldName + "&orgName=" + orgName + "&orgId=" + orgId
      })
    }
  },
  /**
   * 点击邮箱
   */
  emailCatap: function () {
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
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * item弹窗
   */
  fieldsBitp: function (e) {

    let that = this
    let _type = e.currentTarget.dataset.type
    let _loginType = 0
    let _info_item = JSON.stringify(e.currentTarget.dataset.info)
    let _info = encodeURIComponent(_info_item)
    if (_type == "field") {
      wx.showModal({
        content: '下载app查看领域学术圈哟',
        cancelText: '取消',
        confirmText: '去下载',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/downloadApp/downloadApp?type=' + _loginType
            })
          } else if (res.cancel) {}
        }
      })
    } else {
      let id = e.currentTarget.dataset.id
      let typeNum = 0
      if (_type == "org") {
        typeNum = 2
      } else if (_type == "scholar") {
        typeNum = 1
      }
      
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + id 
        + "&type=" + typeNum + "&scholarInfo=" + _info
      })
    }
  },

  shareBitp: function () {
    this.setData({
      select: true
    })
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    let that = this
    let _type = 2
    if (res.from === 'button') {

    }
    return {
      title: '考研不提前找导师，你还在等着学校给安排吗？',
      imageUrl: '../../../assets/share_img.png',
      path: '/pages/tutor/tutorGuide/tutorGuide',
      success: function (res) {
        that.setData({
          select: false
        })
      }
    }
  },
  /**
   * 保存到相册
   */
  saveImageBitp: function () {
    let self = this
    let imgSrc = "../../../assets/share_tutor.png"
    //获取图片信息
    wx.getImageInfo({
      src: imgSrc,
      success: function (res) {
        var path = res.path;
        //保存图片到本地
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function () {
            wx.showToast({
              title: '保存成功，'
            })
            self.setData({
              select: false
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        })
      }
    })
  },
  cancelCatp:function(){
    this.setData({
      select: false
    })
  }
})