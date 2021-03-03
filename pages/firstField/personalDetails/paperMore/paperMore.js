const api = require("../../../../utils/request.js")
var num = 10
var page = 0
var orgType = ''
var tabtype = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    tabTxt: ['按时间排序',  '筛选'], //分类
    // tabTxt: ['按时间排序', '按被引量', '筛选'], //分类
    tab: [true, true, true],
    fieldTab: true,
    scholarId: '',
    paperMsg: [],
    isHideLoadMore: true,
    isLoadMore: true,
    select: false,
    inputLeft: '',
    inputRight: '',
    searchInputLeft: '',
    searchInputRight: '',
    fieldIdArray: [],
    dateSort: true,
    ncitation: true,
    dateBegin: '',
    dateEnd: '',
    orgList1: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    page = 0
    that.data.paperMsg = []
    let _scholarId = options.fieldId
    let _type = options.type
    if (_type == 1) {
      orgType = 'scholars'
    } else {
      orgType = 'organizations'
    }
    that.setData({
      scholarId: _scholarId,
      type:_type
    })
    that.sumApiNetPaper()
  },
  /**
   * 获取输入框的内容
   */
  listenerSearchInput: function(e) {
    var _type = e.currentTarget.dataset.type;
    if (_type == 'left') {
      this.setData({
        searchInputLeft: e.detail.value
      })
    } else if (_type == 'right') {
      this.setData({
        searchInputRight: e.detail.value
      })
    }

  },
  /**
   * 论文列表
   */
  sumApiNetPaper: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let author = new Array()
    api.fetchRequest(orgType + '/' + that.data.scholarId + '/papers', {
      page: page,
      num: num
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.content.length != 0) {
          for (let i = 0; i < res.data.data.content.length; i++) {
            let _paperMsg = that.data.paperMsg
            _paperMsg.push(res.data.data.content[i])
            that.setData({
              paperMsg: _paperMsg,
            })
          }
          for (let i = 0; i < that.data.paperMsg.length; i++) {
            for (let j = 0; j < that.data.paperMsg[i].authors.length; j++) {
              author.push(that.data.paperMsg[i].authors[j].name)
            }
            let _author = author.join('、')
            that.data.paperMsg[i].writer = _author
            author = []
          }
          that.setData({
            paperMsg: that.data.paperMsg,
            isHideLoadMore: true,
            isLoadMore: true,
          })
        } else {
          that.setData({
            isHideLoadMore: true,
            isLoadMore: false,
          })
        }

        wx.hideLoading()
      }
    })
  },
  /**
   * 论文列表筛选
   */
  sumApiNetPaperTab: function() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _fieldIdArray = that.data.fieldIdArray
    let _searchInputLeft = that.data.searchInputLeft
    if (_searchInputLeft == '') {
      _searchInputLeft = null
    }
    let _searchInputRight = that.data.searchInputRight
    if (_searchInputRight == '') {
      _searchInputRight = null
    }
    let _dateSort = that.data.dateSort
    let _ncitation = that.data.ncitation
    let author = new Array()
    api.fetchRequest(orgType + '/papersFilterField?page=' + page + '&num=' + num, {
      scholarId: that.data.scholarId,
      fieldId: _fieldIdArray,
      dateSort: _dateSort,
      ncitation: _ncitation,
      dateBegin: _searchInputLeft,
      dateEnd: _searchInputRight,
    }, 'POST', 0, {
      "content-Type": "application/json"
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.content.length != 0) {
          for (let i = 0; i < res.data.data.content.length; i++) {
            let _paperMsg = that.data.paperMsg
            _paperMsg.push(res.data.data.content[i])
            that.setData({
              paperMsg: _paperMsg,
            })
          }
          for (let i = 0; i < that.data.paperMsg.length; i++) {
            for (let j = 0; j < that.data.paperMsg[i].authors.length; j++) {
              author.push(that.data.paperMsg[i].authors[j].name)
            }
            let _author = author.join('、')
            that.data.paperMsg[i].writer = _author
            author = []
          }
          that.setData({
            paperMsg: that.data.paperMsg,
            isHideLoadMore: true,
            isLoadMore: true,
          })
        } else {
          that.setData({
            isHideLoadMore: true,
            isLoadMore: false,
          })
        }

        wx.hideLoading()
      }
    })
  },
  /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    that.setData({
      isHideLoadMore: false,
      isLoadMore: true
    })
    let _type = that.data.type
    page++
    if (tabtype == 0) {
      if (_type == 1) {
        orgType = 'scholars'
      } else {
        orgType = 'organizations'
      }
      that.sumApiNetPaper()
    } else {
      that.sumApiNetPaperTab()
    }
  },
  /**
   * 详情
   */
  paperBitp: function(e) {
    let that = this
    var _index = e.currentTarget.dataset.index;
    let _id = that.data.paperMsg[_index].id
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/paperMore/paperMoreDetails/paperMoreDetails?id=' + _id,
    })
  },
  /**
   * 筛选
   */
  // 选项卡
  filterTab: function(e) {
    let that = this
    let _tab = that.data.tab
    let _select = that.data.select
    var index = e.currentTarget.dataset.index;
    if (index == 0) { //按时间排序
      tabtype = 1;
      page = 0;
      _tab[index] = !_tab[index];
      // if (!_tab[1]) {
      //   _tab[1] = !_tab[1];
      // }
      if (_select) {
        _select = !_select
      }

      _tab[2] = true
      this.setData({
        tab: _tab,
        select: _select,
        dateSort: !that.data.dateSort,
        ncitation: true,
        fieldTab: true
      })
      that.data.paperMsg = []
      page=0
      that.sumApiNetPaperTab()
    } else if (index == 2) { //按被引量排序
      tabtype = 1;
      page = 0;
      _tab[index] = !_tab[index];
      if (!_tab[0]) {
        _tab[0] = !_tab[0];
      }
      if (_select) {
        _select = !_select
      }
      _tab[2] = true
      this.setData({
        tab: _tab,
        select: _select,
        dateSort: true,
        ncitation: !that.data.ncitation,
        fieldTab: true
      })
      that.data.paperMsg = []
      page = 0
      that.sumApiNetPaperTab()
    } else if (index == 1) { //点击筛选
      if (that.data.orgList1.length == 0) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        api.fetchRequest(orgType + '/' + that.data.scholarId + '/papersSecondaryField', {
          type: 1
        }).then(function(res) {
          let code = res.data.code;
          let fields_two = []
          if (code == 200) {
            that.setData({
              orgList1: res.data.data,
            })
            let _orgList1 = that.data.orgList1
            let arr = Object.keys(_orgList1)
            for (let key in _orgList1) {
              fields_two.push({
                "id": _orgList1[key],
                "name": key,
                "isChack": false
              })
            }
            that.setData({
              orgList1: fields_two,
            })
          }
          wx.hideLoading()
        })
      }
        _tab[index] = !_tab[index];
      that.setData({
        tab: _tab,
        select: !that.data.select,
        fieldTab: !that.data.fieldTab
      })
    }

  },
  /**
   * 下拉框画布
   */
  hideMenuTap: function() {
    let that = this
    let _tab = that.data.tab
    _tab[2] = true
    that.setData({
      select: !that.data.select,
      tab: _tab,
      fieldTab: true
    })
  },
  /**
   * 二级领域多选
   */
  screenBitp: function(e) {
    let that = this
    let _fieldIdArray = that.data.fieldIdArray
    let _index = e.currentTarget.dataset.index
    let _id = that.data.orgList1[_index].id
    let _isChack = that.data.orgList1[_index].isChack
    let ckack = "orgList1[" + _index + "].isChack"
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
    that.setData({
      [ckack]: !_isChack,
      fieldIdArray: _fieldIdArray
    })


  },
  /**
   * 重置
   */
  resetBitp: function() {
    let that = this
    let _tab = that.data.tab
    let _orgList1 = that.data.orgList1
    _tab[2] = true
    for (let i = 0; i < _orgList1.length; i++) {
      _orgList1[i].isChack = false
    }
    that.setData({
      orgList1: _orgList1,
      fieldIdArray: [],
      searchInputLeft: '',
      searchInputRight: '',
      inputLeft: '',
      inputRight: '',
      dateSort: true,
      ncitation: true,
      select: !that.data.select,
      tab: _tab,
      fieldTab: true
    })
    that.data.paperMsg = []
    page = 0
    that.sumApiNetPaperTab()
  },
  /**
   * 确定
   */
  conBitp: function() {
    let that = this
    let _tab = that.data.tab
    if (that.data.fieldIdArray.length != 0 || that.data.searchInputLeft != '' || that.data.searchInputRight != '') {
      tabtype = 1;
      page = 0;
      _tab[1] = false
      that.setData({
        select: !that.data.select,
        tab: _tab,
        fieldTab: true,
        paperMsg:[]
      })
      page = 0
      that.sumApiNetPaperTab()
    } else {
      _tab[1] = true
      that.setData({
        select: !that.data.select,
        tab: _tab,
        fieldTab: true
      })
    }
  },
})