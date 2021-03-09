var app = getApp();
import * as echarts from '../../../ec-canvas/echarts';
const api = require("../../../utils/request.js")
var chartAuthors = null
var chartLine = null
var chartTrend = null
var chartChord = null
var orgType = ''
var num = 3
var page = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vertexId:0,
    personId:0,
    selected: 1,
    type: '1',
    fieldId: '',
    fieldsShow: true,
    totalElements: '',
    personMsg: [],
    scholarInfo: {},
    fieldsMsg: [],
    fieldsMsgShow: [],
    paperMsg: [],
    patentMsg: [],
    projectMsg: [],
    adwardsMsg: [],
    //二级领域英文名
    fieldsTwo: [],
    //领域前沿度分析图
    trendMsg: [],
    //领域相关度图
    chordMsg: [],
    //趋势图
    linesMsg: [],
    // 图谱
    viewBoo: true,
    viewBooLine: true,
    viewBooTrend: true,
    viewBooChord: true,
    ec: {
      lazyLoad: true
    },
    categories: [],
    nodes: [],
    links: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    let that = this
    let _vertexId = wx.getStorageSync("vertexId")
    //判断人才、高校、院所进入的风云榜
    let _fieldId = options.fieldId
    let _type = options.type
    let _personId = options.personId
    let _scholar_str = options.scholarInfo
    let _scholar_item = decodeURIComponent(_scholar_str)
    let _scholarInfo = JSON.parse(_scholar_item)

    console.log(_scholarInfo);

    that.setData({
      type: _type,
      fieldId: _fieldId,
      vertexId: _vertexId,
      personId: _personId,
      scholarInfo: _scholarInfo
    })
    if (_type == 1) {
      orgType = 'scholars'
      wx.setNavigationBarTitle({
        title: '个人详情'
      })
    } else {
      orgType = 'organizations'
      wx.setNavigationBarTitle({
        title: '机构详情'
      })
    }
  },
  onShow: function() {
    let that = this
    // that.login()
    let _token = wx.getStorageSync('token')
    if (_token) {
      let _type = that.data.type
      let _selected = that.data.selected
      if (_type == 1 && _selected == 1) {
        orgType = 'scholars'
        that.personApiNet()
      } else if (_type == 2 || _type == 3) {
        orgType = 'organizations'
        that.sumApiNet()
        that.sumApiNetFields()
      } else if (_type == 1 && _selected == 3) {
        that.echartsComponnetTrend = that.selectComponent('#mychart-dom-trend');
        that.getOptionTrend()
        that.echartsComponnetChord = that.selectComponent('#mychart-dom-chord');
        that.getOptionChord()
        return
      }
      // that.echartsComponnet = that.selectComponent('#mychart-dom-pie');
      // that.getOptionAuthors()
      // that.echartsComponnetLine = that.selectComponent('#mychart-dom-line');
      // that.getOptionCount()
    }
  },

  onUnload: function() {
    let that = this
    that.data.categories = [],
      that.data.nodes = [],
      that.data.links = []
  },
  /**
   * tab切换
   */
  selected: function(e) {
    let that = this
    let _type = e.currentTarget.dataset.type
    let _selected = that.data.selected
    that.setData({
      selected: _type,
    })
    if (_type == 1) {
      let type = that.data.type
      if (type == 1) {
        that.setData({
          selected: 1
        })
        that.echartsComponnet = that.selectComponent('#mychart-dom-pie');
        that.getOptionAuthors()
        that.echartsComponnetLine = that.selectComponent('#mychart-dom-line');
        that.getOptionCount()
      }
    } else if (_type == 2) {
      that.sumApiNetPaper()
      that.sumApiNetPatent()
      that.sumApiNetProject()
    } else if (_type == 3) {
      that.echartsComponnetTrend = that.selectComponent('#mychart-dom-trend');
      that.getOptionTrend()
      that.echartsComponnetChord = that.selectComponent('#mychart-dom-chord');
      that.getOptionChord()
    }
  },
  /**
   * 人才详情
   */
  personApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _token = wx.getStorageSync('token')
    let _personId = that.data.personId
    wx.request({
      url: 'http://47.92.240.36/academic/api/v1/scholars/' + _personId,
      method: 'GET',
      success: function(res) {
        let code = res.data.code;
        if (code == 200) {
          console.log(res);
          let _personMsg = res.data.data
          let _fieldsTwo = []
          for (let i = 0; i < _personMsg.fieldsTwo.length; i++) {
            _fieldsTwo.push(_personMsg.fieldsTwo[i].fieldEnglishName)
          }
          let _id = res.data.data.id
          that.setData({
            personMsg: res.data.data,
            fieldsTwo: _fieldsTwo,
            personId: _id
          })
          // that.sumApiNetAdwards()
        }
        wx.hideLoading()
      }
    })

    // api.fetchRequest(orgType + '/' + that.data.fieldId, {}, 'GET', '0', {
    //   'Authorization': 'Bearer' + _token
    // }).
    // then(function(res) {
    //   let code = res.data.code;
    //   if (code == 200) {
    //     // that.setData({
    //     //   personMsg: res.data.data,
    //     // })
    //     let _personMsg = res.data.data
    //     let _fieldsTwo = []
    //     for (let i = 0; i < _personMsg.fieldsTwo.length; i++) {
    //       _fieldsTwo.push(_personMsg.fieldsTwo[i].fieldEnglishName)
    //     }
    //     let _id = res.data.data.id
    //     that.setData({
    //       personMsg: res.data.data,
    //       fieldsTwo: _fieldsTwo,
    //       personId: _id
    //     })
    //     that.sumApiNetAdwards()
    //   }
    //   wx.hideLoading()
    // })
  },
  /**
   * 高校、机构详情
   */
  sumApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _token = wx.getStorageSync('token')
    api.fetchRequest(orgType + '/' + that.data.fieldId, {}, 'GET', '0', {
      'Authorization': 'Bearer' + _token
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          personMsg: res.data.data,
        })
      }
      wx.hideLoading()
    })
  },

  /**
   * 高校、机构一级领域
   */
  sumApiNetFields: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest('questions/getOrganizationIndexNew/' + that.data.fieldId, {
      num: 15,
      page: 0
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        // that.setData({
        //   fieldsMsg: res.data.data,
        //   fieldsMsgShow: res.data.data,
        // })
        let _fieldsMsg = res.data.data
        if (_fieldsMsg.length > 4) {
          let msg = []
          for (let i = 0; i < 4; i++) {
            msg.push(_fieldsMsg[i])
          }
          that.setData({
            fieldsMsgShow: res.data.data,
            fieldsMsg: msg,
          })
        }
      }

    })
  },
  /**
   * 论文列表
   */
  sumApiNetPaper: function() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let author = new Array()
    let _paperMsg = []
    api.fetchRequest(orgType + '/' + that.data.fieldId + '/papers', {
      page: page,
      num: num
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        // that.setData({
        //   paperMsg: res.data.data.content,
        //   totalElements: res.data.data.totalElements
        // })
        _paperMsg = res.data.data.content
        for (let i = 0; i < _paperMsg.length; i++) {
          for (let j = 0; j < _paperMsg[i].authors.length; j++) {
            author.push(_paperMsg[i].authors[j].name)
          }
          let _author = author.join('、')
          _paperMsg[i].writer = _author
          author = []
        }
        that.setData({
          paperMsg: _paperMsg,
          totalElements: res.data.data.totalElements
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 专利列表
   */
  sumApiNetPatent: function() {
    let that = this
    let _patentMsg = []
    api.fetchRequest(orgType + '/' + that.data.fieldId + '/patents', {
      page: page,
      num: num
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        // that.setData({
        //   patentMsg: res.data.data,
        // })
        _patentMsg = res.data.data
        for (let i = 0; i < _patentMsg.content.length; i++) {
          let _publicationDate = _patentMsg.content[i].publicationDate
          if (_publicationDate != null) {
            let _publicData = _publicationDate.substring(0, 4)
            _patentMsg.content[i].publicData = _publicData
          }
        }
        that.setData({
          patentMsg: res.data.data,
        })
      }
    })
  },
  /**
   * 项目列表
   */
  sumApiNetProject: function() {
    let that = this
    api.fetchRequest(orgType + '/' + that.data.fieldId + '/projects', {
      page: page,
      num: num
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          projectMsg: res.data.data,
        })
      }
    })
  },
  /**
   * 获奖信息列表
   */
  sumApiNetAdwards: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _token = wx.getStorageSync('token')
    api.fetchRequest('questions/scholarAward', {
      name: that.data.personMsg.name,
      organization: that.data.personMsg.orgName
    }, 'GET', '0', {
      'Authorization': 'Bearer' + _token
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          adwardsMsg: res.data.data,
        })
      }
      wx.hideLoading()
    })
  },
  /**
   * 关注
   */
  attentionBit: function() {
    let that = this
    let _vertexId = wx.getStorageSync("vertexId")
    let _id = that.data.personMsg.id
    if (_vertexId == _id) {
      wx.showToast({
        title: '不能关注自己',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      let _type = that.data.type
      let _token = wx.getStorageSync('token')
      let attentionType = ''
      if (_type == 1) {
        attentionType = 'people'
      } else {
        attentionType = 'organization'
      }
      let _hasFollowed = that.data.personMsg.hasFollowed
      if (_hasFollowed) {
        api.fetchRequest('users/unFollow?type=' + attentionType + '&followeeId=' + that.data.fieldId, {}, 'DELETE', 0, {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer' + _token
        }).then(function(res) {
          let code = res.data.code;
          if (code == 200) {
            that.setData({
              'personMsg.hasFollowed': false
            })
          }
        })
      } else {
        api.fetchRequest('users/follow', {
          type: attentionType,
          followeeId: that.data.fieldId
        }, 'POST', 0, {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer' + _token
        }).then(function(res) {
          let code = res.data.code;
          if (code == 200) {
            that.setData({
              'personMsg.hasFollowed': true
            })
          }
        })
      }
      wx.hideLoading()
    }
  },
  /**
   * 分享
   */
  onShareAppMessage: function(res) {
    let that = this
    if (res.from === 'button') {

    }
    return {
      title: '转发',
      path: '/pages/firstField/personalDetails/personalDetails?personId=' + wx.getStorageSync("personId") + '&type=' + that.data.type + '&fieldId=' + that.data.fieldId,
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    that.data.personMsg = []
    that.data.fieldsMsg = []
    that.data.fieldsMsgShow = []
    that.data.paperMsg = []
    that.data.patentMsg = []
    that.data.projectMsg = []
  },

  // 判断是否有token
  login: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    // 如果有token
    if (token) {
      // 检查token是否有效
      api.fetchRequest('accounts/me', '', 'GET', '0', {
        'Authorization': 'Bearer' + token
      }).then(function(res) {
        // 如果token失效了
        if (res.data.code == 200) {
          wx.setStorageSync("personId", res.data.data.id)
          let _token = wx.getStorageSync('token')
          api.fetchRequest('users/detail', {}, 'GET', 0, {
            'Authorization': 'Bearer' + _token
          }).then(function(res) {
            let code = res.data.code;
            if (code == 200) {
              if (res.data.data.primaryField != null && res.data.data.fieldLevel2 != null && res.data.data.fieldLevel2.length > 0) {
                wx.setStorageSync('vertexId', res.data.data.vertexId)
              } else {
                wx.showModal({
                  title: '提示',
                  content: '请选择领域',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/index/indexFields/indexFields',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
      return;
    } else {
      let type = 1
      wx.showModal({
        title: '提示',
        content: '为了您更好的体验，请授权登录',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/index/index?loginType=' + type + '&type=' + that.data.type + '&fieldId=' + that.data.fieldId,
            })
          }
        }
      })
    }
  },
  /**
   * 高校、机构一级领域展开
   */
  fieldsShowBitp: function() {
    let that = this
    that.setData({
      fieldsShow: !that.data.fieldsShow
    })
  },
  /**
   * 点击更多进入下载页
   */
  moreBitp: function(e) {
    var _type = e.currentTarget.dataset.type;
    if (_type == 1) {
      wx.showModal({
        title: '提示',
        content: '小程序暂不支持生成报告，如要生成报告请前往APP进行操作',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/downloadApp/downloadApp?type=' + _type,
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/mine/downloadApp/downloadApp?type=' + _type,
      })
    }
  },
  /**
   * 更多论文
   */
  moreBitpPaper: function() {
    let that = this;
    if (that.data.paperMsg.length != 0) {
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/paperMore/paperMore?fieldId=' + that.data.fieldId + '&type=' + that.data.type,
      })
    }
  },
  /**
   * 更多专利
   */
  moreBitpPatent: function() {
    let that = this;
    if (that.data.patentMsg.content.length != 0) {
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/patentMore/patentMore?fieldId=' + that.data.fieldId + '&type=' + that.data.type,
      })
    }
  },
  /**
   * 更多项目
   */
  moreBitpProject: function() {
    let that = this;
    if (that.data.projectMsg.content.length != 0) {
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/projectMore/projectMore?fieldId=' + that.data.fieldId + '&type=' + that.data.type,
      })
    }
  },
  /**
   * 论文详情
   */
  paperDetailsBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;
    let _id = that.data.paperMsg[_index].id
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/paperMore/paperMoreDetails/paperMoreDetails?id=' + _id,
    })
  },
  /**
   * 专利详情
   */
  patentDetailsBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;
    let _id = that.data.patentMsg.content[_index].id
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/patentMore/patentMoreDetails/patentMoreDetails?id=' + _id,
    })
  },
  /**
   * 项目详情
   */
  projectDetailsBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;
    let _id = that.data.projectMsg.content[_index].id
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/projectMore/projectMoreDetails/projectMoreDetails?id=' + _id,
    })
  },
  /**
   * 获奖详情
   */
  awardsBitp: function(e) {
    let that = this

    var _index = e.currentTarget.dataset.index;
    let _awardProject = that.data.adwardsMsg[_index].awardProject
    let _awardName = that.data.adwardsMsg[_index].awardName
    let _year = that.data.adwardsMsg[_index].year
    let _degree = that.data.adwardsMsg[_index].degree
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/awardsDetails/awardsDetails?awardProject=' + _awardProject + '&awardName=' + _awardName + '&year=' + _year + '&degree=' + _degree,
    })
  },
  /**
   * 一级领域进入二级领域
   */
  indexFieldsBitp: function(e) {
    let that = this
    let _fieldsId = ''
    let _orgId = ''
    var _index = e.currentTarget.dataset.index;
    if (that.data.fieldsShow) {
      _fieldsId = that.data.fieldsMsg[_index].fieldId
      _orgId = that.data.fieldsMsg[_index].orgId
    } else {
      _fieldsId = that.data.fieldsMsgShow[_index].fieldId
      _orgId = that.data.fieldsMsgShow[_index].orgId
    }

    wx.navigateTo({
      url: '/pages/firstField/personalDetails/indexField/indexField?fieldId=' + _fieldsId + '&orgId=' + _orgId
    })
  },
  /**
   * 一级领域进入人才排行榜
   */
  fieldsBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;

    let _fields_id = ''
    let _university_id = ''
    let _title = ''
    let _innovationIndex = 0
    let _increase = 0
    let _increasePercentage = 0
    let _searchType = 1
    //判断是人才/高校
    if (that.data.type == 1) {
      _fields_id = that.data.personMsg.primaryFields[0].fieldId
      _university_id = that.data.personMsg.primaryFields[0].orgId
      _title = that.data.personMsg.primaryFields[0].fieldName
    } else {
      //高校一级领域是否展开
      if (that.data.fieldsShow) {
        _fields_id = that.data.fieldsMsg[_index].fieldId
        _university_id = that.data.fieldsMsg[_index].orgId
        _title = that.data.fieldsMsg[_index].name
      } else {
        _fields_id = that.data.fieldsMsgShow[_index].fieldId
        _university_id = that.data.fieldsMsgShow[_index].orgId
        _title = that.data.fieldsMsgShow[_index].name
      }

    }
    wx.navigateTo({
      url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fields_id + '&orgId=' + _university_id + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
    })
  },
  /**
   * 二级领域进入人才排行榜
   */
  fieldsTwoBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;

    let _fields_id = that.data.personMsg.fieldsTwo[_index].fieldId
    let _university_id = that.data.personMsg.fieldsTwo[_index].orgId
    let _title = that.data.personMsg.fieldsTwo[_index].fieldName
    let _innovationIndex = 0
    let _increase = 0
    let _increasePercentage = 0
    let _searchType = 1
    wx.navigateTo({
      url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fields_id + '&orgId=' + _university_id + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
    })
  },
  /**
   * 关系图谱
   */
  getOptionAuthors: function() { //这一步其实就要给图表加上数据
    var that = this;
    let _token = wx.getStorageSync('token')
    let _categories = []
    let _nodes_none = []
    let _nodes = []
    let _links = []
    if (that.data.type == 1) {
      api.fetchRequest('scholars/' + that.data.fieldId + '/co-authors', {}, 'GET', 0, {
        'Authorization': 'Bearer' + _token
      }).then(function(res) {
        let code = res.data.code;
        let categories_min = []
        let nodes_min = []
        let links_min = []
        if (code == 200) {
          if (res.data.data.categories.length >= 25) {
            for (let i = 0; i < 25; i++) {
              categories_min[i] = res.data.data.categories[i]
            }
          } else {
            for (let i = 0; i < res.data.data.categories.length; i++) {
              categories_min[i] = res.data.data.categories[i]
            }
          }
          if (res.data.data.nodes.length >= 25) {
            for (let i = 0; i < 25; i++) {
              nodes_min[i] = res.data.data.nodes[i]
            }
          } else {
            for (let i = 0; i < res.data.data.nodes.length; i++) {
              nodes_min[i] = res.data.data.nodes[i]
            }
          }
          if (res.data.data.links.length >= 24) {
            for (let i = 0; i < 24; i++) {
              links_min[i] = res.data.data.links[i]
            }
          } else {
            for (let i = 0; i < res.data.data.links.length; i++) {
              links_min[i] = res.data.data.links[i]
            }
          }
          that.setData({
            categories: categories_min,
            nodes: nodes_min,
            links: links_min,
            viewBoo: false
          })
          _categories = []
          _nodes_none = []
          _nodes = that.data.nodes
          _links = that.data.links
          for (let i = 0; i < that.data.nodes.length; i++) {
            _categories[i] = {
              "name": that.data.nodes[i].scholarId + ''
            }
          }
          for (let i = 0; i < that.data.nodes.length; i++) {
            _nodes[i].category = that.data.nodes[i].scholarId + ''
            _nodes[i].id = that.data.nodes[i].scholarId + ''
            if (that.data.nodes[i].symbolSize <= 8) {
              _nodes[i].symbolSize = 8 * 3
            } else if (that.data.nodes[i].symbolSize >= 25) {
              _nodes[i].symbolSize = 20 * 2
            } else {
              _nodes[i].symbolSize = that.data.nodes[i].symbolSize * 3
            }
          }
          for (let i = 0; i < that.data.links.length; i++) {
            _links[i].value = Math.random() * 20
            _links[i].source = that.data.nodes[i + 1].scholarId + ""
            _links[i].target = that.data.nodes[0].scholarId + ""
          }
          that.setData({
            nodesPromise: _nodes
          })
          that.initAuthors(_categories, _nodes, _links)
        }
      })
    } else {
      api.fetchRequest('organizations/' + that.data.fieldId + '/super-field', {}, 'GET', 0, {
        'Authorization': 'Bearer' + _token
      }).then(function(res) {
        let code = res.data.code;
        if (code == 200) {
          that.setData({
            categories: res.data.data.categories,
            nodes: res.data.data.nodes,
            links: res.data.data.links,
            viewBoo: false
          })
          _categories = []
          _nodes = that.data.nodes
          _links = that.data.links
          for (let i = 0; i < that.data.nodes.length; i++) {
            _categories[i] = {
              "name": that.data.nodes[i].name
            }
          }
          for (let i = 0; i < that.data.nodes.length; i++) {
            _nodes[i].category = that.data.nodes[i].name
            if (that.data.nodes[i].symbolSize <= 8) {
              _nodes[i].symbolSize = 8 * 2
            } else if (that.data.nodes[i].symbolSize >= 25) {
              _nodes[i].symbolSize = 25 * 2
            } else {
              _nodes[i].symbolSize = that.data.nodes[i].symbolSize * 3
            }
          }
          for (let i = 0; i < that.data.links.length; i++) {
            _links[i].value = Math.random() * 20
          }
          that.initAuthors(_categories, _nodes, _links)
        }
      })
    }
  },
  /**
   * 趋势图谱
   */
  getOptionCount: function() { //这一步其实就要给图表加上数据
    let that = this
    api.fetchRequest(orgType + '/' + that.data.fieldId + '/yearCount')
      .then(function(res) {
        that.setData({
          linesMsg: res.data.data,
          viewBooLine: false
        })
        let _categories = []
        let _count = []
        let _vaule = []
        for (let i = that.data.linesMsg.length - 1; i >= 0; i--) {
          _categories.push(that.data.linesMsg[i].year)
          _count.push(that.data.linesMsg[i].count)
          if (that.data.linesMsg[i].value != null) {
            _vaule.push(that.data.linesMsg[i].value)
          } else {
            _vaule.push(0)
          }
        }
        that.initCount(_categories, _count, _vaule)
      })
  },
  /**
   * 领域前沿度分析图
   */
  getOptionTrend: function() { //这一步其实就要给图表加上数据
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    let _fieldsTwo = that.data.fieldsTwo
    let series = [];
    let years = [];
    let legend = [];
    api.fetchRequest('scholars/trend', _fieldsTwo, 'POST', '0', {
      "content-Type": "application/json",
      'Authorization': 'Bearer' + _token
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          trendMsg: res.data.data,
          viewBooTrend: false,
        })
        let _trendMsg = that.data.trendMsg
        let keys = Object.keys(_trendMsg);
        legend = keys;
        for (let i in keys) {
          let key = _trendMsg[keys[i]]
          let data = []
          for (let j = 0; j < key.length; j++) {
            let year = _trendMsg[keys[i]][j]['year']
            let yearCount = _trendMsg[keys[i]][j]['yearCount']
            if (i == 0) {
              years.push(year);
            }
            data.push(yearCount)
          }
          let sery = {
            name: keys[i],
            type: 'line',
            animation: false,
            data: data
          }
          series.push(sery);
        }
        console.log(series)
        console.log(years)
        console.log(legend)
        that.initTrend(series, years, legend)
      }
      wx.hideLoading()
    })
  },
  /**
   * 领域相关度
   */
  getOptionChord: function() { //这一步其实就要给图表加上数据
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    let _fieldsTwo = that.data.fieldsTwo
    api.fetchRequest('scholars/chord-data', _fieldsTwo, 'POST', '0', {
      "content-Type": "application/json",
      'Authorization': 'Bearer' + _token
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        that.setData({
          chordMsg: res.data.data,
          viewBooChord: false
        })
        let nodes = []
        let categories = []
        let links = that.data.chordMsg.links
        let _nodes = that.data.chordMsg.nodes
        for (let i = 0; i < _nodes.length; i++) {
          _nodes[i].category = _nodes[i].name
          categories.push({
            'name': _nodes[i].name
          })
        }
        let map = new Map()
        for (let i in links) {
          let _source = links[i].source
          if (map.get(_source)) {
            map.set(_source, map.get(_source) + 1)
          } else {
            map.set(_source, 20)
          }
        }
        for (let j = 0; j < _nodes.length; j++) {
          if (map.get(_nodes[j].name) == null) {
            _nodes[j].symbolSize = 20
          } else {
            _nodes[j].symbolSize = map.get(_nodes[j].name)
          }

        }
        nodes = _nodes
        that.initChord(nodes, links, categories)
      }

      wx.hideLoading()
    })
  },
  /**
   *  初始化图表、关系图
   */
  initAuthors: function(_categories, _data, _links) {
    let that = this
    that.echartsComponnet.init((canvas, width, height) => {
      if (chartAuthors != null) {
        chartAuthors.clear()
      }
      chartAuthors = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionAuthors(that, chartAuthors, _categories, _data, _links)
      if (chartAuthors._$handlers.click) {
        chartAuthors._$handlers.click.length = 0;
      }
      if (that.data.type == 1) {
        //点击图谱进入人才详情
        chartAuthors.on('mousedown', function echarts(param) {
          //获取节点点击的数组序号
          var arrayIndex = param.dataIndex;
          let _scholarId = that.data.nodes[arrayIndex].scholarId
          let typeNum = 1
          wx.navigateTo({
            url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _scholarId + "&type=" + typeNum
          })
          chartAuthors.off()
        });
      } else {
        //点击图谱进入人才列表
        chartAuthors.on('mousedown', function echarts(param) {
          //获取节点点击的数组序号
          var arrayIndex = param.dataIndex;
          if (that.data.nodes[arrayIndex].filedId != null) {
            let _innovationIndex = 0
            let _increase = 0
            let _increasePercentage = 0
            let _searchType = 2
            let _fieldsId = that.data.nodes[arrayIndex].filedId
            let _orgId = that.data.fieldId
            let _title = that.data.nodes[arrayIndex].name
            wx.navigateTo({
              url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fieldsId + '&orgId=' + _orgId + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
            })
            chartAuthors.off()
          }


        });
      }
      return chartAuthors;
    });
  },

  //初始化图表、趋势图
  initCount: function(_categories, _count, _vaule) {
    let that = this
    that.echartsComponnetLine.init((canvas, width, height) => {
      chartLine = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionLine(that, chartLine, _categories, _count, _vaule)
      return chartLine;
    });
  },
  //初始化图表、领域前沿度分析图
  initTrend: function(series, years, legend) {
    let that = this
    that.echartsComponnetTrend.init((canvas, width, height) => {
      chartTrend = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionTrend(that, chartTrend, series, years, legend)
      return chartTrend;
    });
  },
  //初始化图表、领域相关度
  initChord: function(nodes, links, categories) {
    let that = this
    that.echartsComponnetChord.init((canvas, width, height) => {
      if (chartChord != null) {
        chartChord.clear()
      }
      chartChord = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionChord(that, chartChord, nodes, links, categories)
      if (chartChord._$handlers.click) {
        chartChord._$handlers.click.length = 0;
      }
      //点击图谱进入app下载页
      chartChord.on('mousedown', function echarts(param) {
        let _type = 1
        wx.navigateTo({
          url: '/pages/mine/downloadApp/downloadApp?type=' + _type
        })
        chartChord.off()
      });
      return chartChord;
    });
  }
});
/**
 * 绘制关系图谱
 */
function setOptionAuthors(that, chartAuthors, _categories, _data, _links) {
  var option = {
    label: {
      normal: {
        show: true,
        textStyle: {
          fontSize: 18
        },
      }
    },
    grid: {
      // containLabel: true
    },
    calculable: false,
    series: [{
      type: 'graph',
      layout: 'force',
      symbolSize: 10,
      focusNodeAdjacency: true,
      roam: false,
      data: _data,
      links: _links,
      categories: _categories,
      label: {
        normal: {
          show: true,
          position: 'bottom',
          textStyle: {
            fontSize: 12,
          },
        }
      },
      force: {
        repulsion: 220, //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
        gravity: 0.06, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
        edgeLength: [20, 50], //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
        layoutAnimation: true
      },
      edgeLabel: {
        normal: {
          show: false,
          textStyle: {
            fontSize: 18
          },
          formatter: '{c}'
        }
      },
      lineStyle: {
        normal: {
          opacity: 0.9,
          width: 1,
          curveness: 0,
        }
      },
    }]
  };
  chartAuthors.setOption(option, true);
  return chartAuthors;
}

/**
 * 趋势图
 */
function setOptionLine(that, chartLine, _categories, _count, _vaule) {
  var optionLine = {
    //   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
    backgroundColor: {
      type: 'linear',
      x: 0,
      y: 0.6,
      x2: 0,
      y2: 2,
      colorStops: [{
        offset: 0,
        color: '#FFFFFF' // 0% 处的颜色
      }, {
        offset: 1,
        color: '#4FF0B7' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    grid: {
      left: '2%',
      right: '2%',
      containLabel: true
    },
    color: ["#72E3B3", "#ECAD17"],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765'
        }
      }
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      axisLine: {
        onZero: false
      },
      data: _categories
    }],
    yAxis: [{
      type: 'value',
    },
    {
      type: 'value',
      splitLine: {
        show: false
      }
    }
    ],
    series: [{
      name: '成果',
      type: 'line',
      data: _count
    },
    {
      name: '被引量 ',
      type: 'line',
      yAxisIndex: 1,
      data: _vaule
    }
    ]
  };
  chartLine.setOption(optionLine);
  return chartLine;
}

/**
 * 领域前沿度分析图
 */

function setOptionTrend(that, chartTrend, series, years, legend) {
  var optionTrend = {
    grid: {
      bottom: 65,
      left: '15%',

    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765'
        }
      }
    },
    legend: {
      data: legend,
      x: 'center',
      width: 350,
      textStyle: {
        fontSize: 12,
      }
    },
    dataZoom: [{
        show: true,
        realtime: true,
        start: 75,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 75,
        end: 100
      }
    ],
    xAxis: [{
      type: 'category',
      splitLine: {
        show: true,
      },
      boundaryGap: false,
      axisLine: {
        onZero: false
      },
      data: years
    }],
    yAxis: {},
    series: series
  };
  chartTrend.setOption(optionTrend);
  return chartTrend;
}
/**
 * 领域相关度
 */

function setOptionChord(that, chartChord, nodes, links, categories) {
  var optionChord = {
    series: [{
      name: '',
      type: 'graph',
      layout: 'circular',
      circular: {
        rotateLabel: true
      },
      data: nodes,
      links: links,
      categories: categories,
      roam: false,
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: '{b}',
          textStyle: {
            fontSize: 10,
          },
        }
      },
      lineStyle: {
        normal: {
          color: 'source',
          curveness: 0.3
        }
      }
    }]
  };
  chartChord.setOption(optionChord);
  return chartChord;
}