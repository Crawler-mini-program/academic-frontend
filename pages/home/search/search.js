// 搜索
var page = 0
var num = 10
var type = 0
const api = require("../../../utils/request.js")
var cityJson = require("../../../utils/cityJson.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reportType: 1,
    isHideLoadMorePerson: true,
    isLoadMorePerson: true,
    isHideLoadMoreInstitution: true,
    isLoadMoreInstitution: true,
    isHideLoadMoreFields: true,
    isLoadMoreFields: true,
    hotType: true,
    noSearchPerson: true,
    noSearchInstitution: true,
    noSearchFields: true,
    // 筛选
    screenBoo: false, //控制筛选显示隐藏
    tabTxt: ['年龄', '领域', '职称', '地点'], //分类
    tab: [true, true, true, true],
    ageList: ['35以下', '35-45', '45以上'],
    fieldsList: [],
    orgList: [
      "院士", "教授", "副教授", "助理教授", "讲师", "研究员", "副研究员", "助理研究员",
      "主任医师", "副主任医师", "主治医师", "医师", "医士", "主任药师", "副主任药师", "主管药师", "执业药师", "研究馆员",
      "副研究馆员", "工程师", "助理工程师", "技术员", "实验师", "实验员", "助理讲师", "其它"
    ],
    placeArray: [],
    age_id: 0, //年龄
    age_txt: '',
    fields_id: 0, //领域
    fields_txt: '',
    orgName_id: 0, //职称
    orgName_txt: '',
    place_id: 0, //地点
    city_id: 0, //城市
    place_txt: '',
    cityCode: '',
    cityBoo: false,
    // 顶部tab
    numType: 0,
    currentIndex: 0,
    nowRole: 0,
    searchInput: '',
    personMsg: [],
    institutionMsg: [],
    fieldsMsg: [],
    imgUrl: ["http://img01.guokezy.com/avatars/5c412f187bc75e89d4c7e47b.jpg",
      "http://img01.guokezy.com/avatars/5c412f217bc75e89d4c7e481.jpg",
      "http://img01.guokezy.com/avatars/5c412f267bc75e89d4c7e487.jpg",
      "http://img01.guokezy.com/avatars/5c412f2a7bc75e89d4c7e48d.jpg",
      "http://img01.guokezy.com/avatars/5c412f317bc75e89d4c7e493.jpg"
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let _reportType = options.reportType
    if (_reportType == 1) {
      that.setData({
        reportType: _reportType
      })
    } else {
      that.setData({
        reportType: _reportType,
        placeArray: cityJson.proJson
      })
    }

    if (_reportType != 1) {
      wx.setNavigationBarTitle({
        title: '搜索',
      })
    }
    type = 2
    that.hotApiNet()
  },
  /**
   * 获取热词，一开始没有搜索内容时，下方默认显示的内容
   */
  hotApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest('s/top-searches-type', {
      type: type
    }).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data.length != 0) {
          if (that.data.currentIndex == 0) {
            that.setData({
              personMsg: res.data.data,
              numType: 0
            })
          } else if (that.data.currentIndex == 1) {
            that.setData({
              institutionMsg: res.data.data,
              numType: 0
            })
          } else if (that.data.currentIndex == 2) {
            that.setData({
              fieldsMsg: res.data.data,
              numType: 0
            })
          }
        }
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setStorageSync("ageId", 0)
    wx.setStorageSync("fieldsId", 0)
    wx.setStorageSync("orgName", '')
    wx.setStorageSync("proName", '')
    wx.setStorageSync("cityName", '')
  },
  /**
   * 获取输入框的内容
   */
  listenerSearchInput: function(e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  /**
   * 点击搜索按钮
   */
  toSearch: function(e) {
    let that = this

    let _searchInput = that.data.searchInput
    if (_searchInput == '' || _searchInput == null) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }
    that.setData({
      hotType: false,
      screenBoo: true
    })
    page = 0
    let _currentIndex = that.data.currentIndex
    /** 
     * currentIndex=0 -> type=2，人才 
     * currentIndex=1 -> type=4，机构
     * currentIndex=2 -> type=3，领域 
     */
    if (_currentIndex == 0) {
      that.data.personMsg = []
      type = 2
      that.searchPersonApiNet()
    } else if (_currentIndex == 1) {
      that.data.institutionMsg = []
      type = 4
      that.searchInstitutionApiNet()
    } else if (_currentIndex == 2) {
      that.data.fieldsMsg = []
      type = 3
      that.searchFieldsApiNet()
    }
  },
  /**
   * 获取数据、人才
   * 每次搜索之后人才机构领域下面都会出现年龄、领域、职称和地点的一个栏
   */
  searchPersonApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _age = 0,
      _field = 0,
      _title = '',
      _location = ''
    let ageId = wx.getStorageSync("ageId")
    if (ageId == '') {
      _age = 0
    } else {
      _age = ageId
    }
    let fieldsId = wx.getStorageSync("fieldsId")
    if (fieldsId == '') {
      _field = 0
    } else {
      _field = fieldsId
    }
    _title = wx.getStorageSync("orgName")
    let proName = wx.getStorageSync("proName")
    let cityName = wx.getStorageSync("cityName")
    if (proName == '地点' || proName == '') {
      _location = ''
    } else {
      if (cityName == '地点') {
        _location = proName
      } else {
        _location = proName + '-' + cityName
      }
    }
    api.fetchRequest('s', {
      content: that.data.searchInput,
      type: type,
      page: page,
      num: num,
      age: _age,
      field: _field,
      title: _title,
      location: _location
    }, 'GET', '0', {}).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data != null && res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _personMsg = that.data.personMsg
            _personMsg.push(res.data.data[i])
            that.setData({
              numType: 1,
              personMsg: _personMsg,
              isHideLoadMorePerson: true,
              isLoadMorePerson: true,
              noSearchPerson: true,
            })
          }
        } else {
          if (page == 0) {
            that.setData({
              isHideLoadMorePerson: true,
              isLoadMorePerson: true,
              noSearchPerson: false
            })
          } else {
            that.setData({
              isHideLoadMorePerson: true,
              isLoadMorePerson: false,
              noSearchPerson: true
            })
          }

        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 获取数据、机构
   * 机构下方也会出现一个栏，为地点
   */
  searchInstitutionApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    let _location = ''
    let proName = wx.getStorageSync("proName")
    let cityName = wx.getStorageSync("cityName")
    if (proName == '地点' || proName == '') {
      _location = ''
    } else {
      if (cityName == '地点') {
        _location = proName
      } else {
        _location = proName + '-' + cityName
      }
    }
    api.fetchRequest('s', {
      content: that.data.searchInput,
      type: type,
      page: page,
      num: num,
      location: _location
    }, 'GET', '0', {}).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data != null && res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _institutionMsg = that.data.institutionMsg
            _institutionMsg.push(res.data.data[i])
            that.setData({
              numType: 1,
              institutionMsg: _institutionMsg,
              isHideLoadMoreInstitution: true,
              isLoadMoreInstitution: true,
              noSearchInstitution: true,
            })
          }
        } else {
          if (page == 0) {
            that.setData({
              isHideLoadMoreInstitution: true,
              isLoadMoreInstitution: true,
              noSearchInstitution: false
            })
          } else {
            that.setData({
              isHideLoadMoreInstitution: true,
              isLoadMoreInstitution: false,
              noSearchInstitution: true,
            })
          }

        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 获取数据、领域
   */
  searchFieldsApiNet: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    api.fetchRequest('s', {
      content: that.data.searchInput,
      type: type,
      page: page,
      num: num
    }, 'GET', '0', {}).then(function(res) {
      let code = res.data.code;
      if (code == 200) {
        if (res.data.data != null && res.data.data.length != 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            let _fieldsMsg = that.data.fieldsMsg
            _fieldsMsg.push(res.data.data[i])
            that.setData({
              numType: 1,
              fieldsMsg: _fieldsMsg,
              isHideLoadMoreFields: true,
              isLoadMoreFields: true,
              noSearchFields: true,
            })
          }
        } else {
          if (page == 0) {
            that.setData({
              isHideLoadMoreFields: true,
              isLoadMoreFields: true,
              noSearchFields: false
            })
          } else {
            that.setData({
              isHideLoadMoreFields: true,
              isLoadMoreFields: false,
              noSearchFields: true,
            })
          }

        }
        wx.hideLoading()
      }
    })
  },
  /**
   * 点击人才item
   */
  personBitp: function(e) {
    let that = this
    let _token = wx.getStorageSync('token')
    // 如果有token，显示界面，否则跳转到登录界面
    if (_token) {
      let _index = e.currentTarget.dataset.index
      let _university_id = ''
      let _typeNum = ''
      if (that.data.currentIndex == 0) {
        _university_id = that.data.personMsg[_index].id
        _typeNum = 1
      } else {
        _university_id = that.data.institutionMsg[_index].id
        _typeNum = 2
      }
      wx.navigateTo({
        url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + _university_id + "&type=" + _typeNum
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?loginType=0'
      })
    }
  },
  /**
   * 点击排行榜
   */
  rankCatp: function(e) {
    let that = this
    let _index = e.currentTarget.dataset.index

    let _fields_id = ''
    let _university_id = ''
    let _title = ''
    let _innovationIndex = ''
    let _increase = ''
    let _increasePercentage = ''
    let _searchType = ''
    if (that.data.currentIndex == 1) {
      _fields_id = 0
      //判断是否点击搜索、取name或fieldName
      if (that.data.hotType) {
        _title = that.data.institutionMsg[_index].orgName
      } else {
        _title = that.data.institutionMsg[_index].name
      }
      _innovationIndex = that.data.institutionMsg[_index].innovationIndex
      _increase = that.data.institutionMsg[_index].increase
      _increasePercentage = that.data.institutionMsg[_index].increasePercentage
      _university_id = that.data.institutionMsg[_index].id
      _searchType = 0
    } else {
      //判断是否点击搜索、取name或fieldName
      if (that.data.hotType) {
        _title = that.data.fieldsMsg[_index].fieldName
      } else {
        _title = that.data.fieldsMsg[_index].name
      }
      _fields_id = that.data.fieldsMsg[_index].id
      _innovationIndex = that.data.fieldsMsg[_index].innovationIndex
      _increase = that.data.fieldsMsg[_index].increase
      _increasePercentage = that.data.fieldsMsg[_index].increasePercentage
      _university_id = 0
      _searchType = 1
    }
    wx.navigateTo({
      url: '/pages/firstField/manCelebrity/manCelebrity?fieldId=' + _fields_id + '&orgId=' + _university_id + '&name=' + _title + '&innovationIndex=' + _innovationIndex + '&increase=' + _increase + '&increasePercentage=' + _increasePercentage + '&searchType=' + _searchType
    })
  },

  /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    page++
    that.setData({
      isHideLoadMore: false,
      isLoadMore: true
    })
    //获取id判断人才、机构、领域
    let _currentIndex = that.data.currentIndex
    //判断是否点击搜索按钮
    let _hotType = that.data.hotType
    if (!_hotType) {
      if (_currentIndex == 0) {
        that.searchPersonApiNet()
      } else if (_currentIndex == 1) {
        that.searchInstitutionApiNet()
      } else if (_currentIndex == 2) {
        that.searchFieldsApiNet()
      }
    }

  },
  //人才、高校、院所tabbar切换
  toggleView: function(event) {
    let that = this;
    let currentIndex = that.data;
    currentIndex = event.target.dataset.index;
    that.setData({
      currentIndex
    })
    // 判断tab切换
    if (currentIndex == 0) {
      type = 2
      wx.setStorageSync("proName", '')
      wx.setStorageSync("cityName", '')
      let _tabTxt = that.data.tabTxt;
      _tabTxt[3] = '地点'
      that.setData({
        tab: [true, true, true, true],
        place_id: 0,
        tabTxt: _tabTxt,
        cityBoo: false
      })
      // 判断是否点击过搜索
      if (that.data.hotType) {
        that.hotApiNet()
      } else {
        that.data.personMsg = []
        page = 0
        that.searchPersonApiNet()
      }
    } else if (currentIndex == 1) {
      type = 4
      wx.setStorageSync("proName", '')
      wx.setStorageSync("cityName", '')
      let _tabTxt = that.data.tabTxt;
      _tabTxt[3] = '地点'
      that.setData({
        tab: [true, true, true, true],
        place_id: 0,
        tabTxt: _tabTxt,
        cityBoo: false
      })
      if (that.data.hotType) {
        that.hotApiNet()
      } else {
        that.data.institutionMsg = []
        page = 0
        that.searchInstitutionApiNet()
      }
    } else if (currentIndex == 2) {
      type = 3
      if (that.data.hotType) {
        that.hotApiNet()
      } else {
        that.data.fieldsMsg = []
        page = 0
        that.searchFieldsApiNet()
      }
    }
  },
  //swiper切换
  toggleSwiper: function(event) {
    let that = this;
    let nowRole = that.data;
    nowRole = event.detail.current;
    that.setData({
      nowRole
    })
  },
  /**
   * 禁止左右滑动
   */
  stopTouchMove: function() {
    return false
  },
  // 选项卡，比如搜索人才，下面会出现年龄等选项，点击之后看到的一个下拉框
  filterTab: function(e) {
    let that = this
    var data = [true, true, true, true],
      index = e.currentTarget.dataset.index;
    if (index == 1) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      api.fetchRequest('fields')
        .then(function(res) {
          if (res.data.code == 200) {
            data[index] = !that.data.tab[index];
            that.setData({
              fieldsList: res.data.data,
              tab: data
            })
          }
          wx.hideLoading()
        })
    } else {
      data[index] = !that.data.tab[index];
      let tabTxt = this.data.tabTxt;
      let proName = wx.getStorageSync("proName")
      let cityName = wx.getStorageSync("cityName")
      if (proName == '地点' || proName == '') {
        tabTxt[3] = '地点'
      } else {
        if (cityName == '' || cityName == '地点') {
          tabTxt[3] = proName
        } else {
          tabTxt[3] = cityName
        }
      }
      that.setData({
        tab: data,
        tabTxt: tabTxt
      })
    }

  },

  //筛选项点击操作
  filter: function(e) {
    var self = this,
      id = e.currentTarget.dataset.index,
      code = e.currentTarget.dataset.code,
      txt = e.currentTarget.dataset.txt,
      tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.id) {
      // 0代表年龄
      case '0':
        tabTxt[0] = txt;
        wx.setStorageSync("ageId", id)
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          age_id: id,
        });
        break;
        // 1代表领域
      case '1':
        tabTxt[1] = txt;
        if (id == 0) {
          wx.setStorageSync("fieldsId", id)
        } else {
          wx.setStorageSync("fieldsId", self.data.fieldsList[id - 1].id)
        }
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          fields_id: id,
        });
        break;
        // 2代表职称
      case '2':
        tabTxt[2] = txt;
        if (id == 0) {
          wx.setStorageSync("orgName", '')
        } else {
          wx.setStorageSync("orgName", txt)
        }
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          orgName_id: id,
        });
        break;
        // 3代表省份，id为0代表不限
      case '3':
        let pro = true
        let _cityBoo = true
        wx.setStorageSync('proName', txt)
        wx.setStorageSync("cityName", '')
        if (id == 0) {
          tabTxt[3] = txt;
          pro = true
          _cityBoo = false
        } else {
          pro = false
          _cityBoo = true
        }
        self.setData({
          tab: [true, true, true, pro],
          tabTxt: tabTxt,
          place_id: id,
          cityCode: code,
          cityBoo: _cityBoo
        });

        break;
        // 4代表市区，id为0代表不限
      case '4':
        if (id == 0) {
          tabTxt[3] = wx.getStorageSync("proName")
        } else {
          tabTxt[3] = txt;
          wx.setStorageSync("cityName", txt)
        }
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          city_id: id,
        });
        break;
    }
    // 人才和机构才有筛选框，因此currentindex为0和1才有接下来的操作
    if (self.data.searchInput != null && self.data.searchInput != '') {
      if (self.data.currentIndex == 0) {
        type = 2;
        page = 0;
        self.data.personMsg = []
        self.searchPersonApiNet()
      } else if (self.data.currentIndex == 1) {
        type = 4;
        page = 0;
        self.data.institutionMsg = []
        self.searchInstitutionApiNet()
      }
    } else {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 500
      })
    }
  },
  /**
   * 下拉框画布
   */
  hideMenuTap: function() {
    let that = this
    that.setData({
      select: !that.data.select
    })
  },
  onUnload: function() {
    wx.setStorageSync("ageId", 0)
    wx.setStorageSync("fieldsId", 0)
    wx.setStorageSync("orgName", '')
    wx.setStorageSync("proName", '')
    wx.setStorageSync("cityName", '')
  }

})