const api = require("../../../utils/request.js")
var pageNo = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fieldName: "",
    secondFieldId: 0,
    secondFieldName: "",
    searchInput: '', //输入框输入的内容
    orgsList: [],
    nowRole: 1,
    currentIndex: 0,
    isHideLoadMoreOrg: true,
    isHideLoadMoreInstitution: true,
    isLoadMoreOrg: true,
    isLoadMoreInstitution: true,
    noSearchOrg: true,
    noSearchInstitution: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let secondFieldId = options.secondFieldId
    let secondFieldName = options.secondFieldName
    let fieldName = options.fieldName
    this.setData({
      secondFieldId: secondFieldId,
      secondFieldName: secondFieldName,
      fieldName: fieldName
    })
    wx.setNavigationBarTitle({
      title: secondFieldName + "-院校榜单"
    })
    pageNo = 0
    this.getData(this, "university")
  },
  /**
   * 获取输入框的内容
   */
  listenerSearchInput: function (e) {
    let that = this
    let value = e.detail.value
    let _nowRole = that.data.nowRole
    this.setData({
      searchInput: value
    })
    if (value == "") {
      pageNo = 0
      let type = ""
      if (_nowRole == 1) {
        type = "institution"
      } else {
        type = "university"
      }
      that.data.orgsList=[]
      that.getData(that, type)
    }
  },
  /**
   * 点击搜索按钮
   */
  toSearch: function (e) {
    let that = this
    let _searchInput = that.data.searchInput
    let _nowRole = that.data.nowRole
    if (_searchInput == '' || _searchInput == null) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }
    pageNo = 0
    let type = ""
    if (_nowRole == 1) {
      type = "institution"
    } else {
      type = "university"
    }
    that.data.orgsList = []

    that.getData(that, type)

  },
    /**
   * tab切换
   */
  toggleView: function(event) {
    let that = this;
    let currentIndex = that.data;
    let nowRole = that.data;
    currentIndex = event.target.dataset.index;
    let type = ""
    if (currentIndex == '1') {
      nowRole = 1
      type = "institution"
    } else {
      nowRole = 0
      type = "university"
    }
    that.data.orgsList=[]
    that.setData({
      nowRole: nowRole,
      currentIndex
    })
    pageNo = 0
    that.getData(that, type)
  },

  getData: function(that, type) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _token = wx.getStorageSync('token')
    wx.request({
      url: 'http://47.92.240.36/academic/api/v1/rank/top-organizations-by-orgInnovation',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        sortType: 'innovationIndex',
        field: that.data.secondFieldId,
        orgType: 'university',
        page: pageNo,
        num: 10
      },
      success: function(res) {
        let code = res.data.code;
        if (code == 200) {
          let data = res.data.data
          console.log(data);
          if (data != null && data.length > 0) {
            let _orgsList = that.data.orgsList
            for (let i in data) {
              _orgsList.push(data[i])
            }
            //0代表高校，1代表院所
            if (that.data.nowRole == 0) {
              that.setData({
                orgsList: _orgsList,
                isLoadMoreOrg: true,
                isHideLoadMoreOrg: true,
                noSearchOrg: true
              })
            } else {
              that.setData({
                orgsList: _orgsList,
                isLoadMoreInstitution: true,
                isHideLoadMoreInstitution: true,
                noSearchInstitution: true
              })
            }
          } else {
            if(pageNo!=0){
              if (that.data.nowRole == 0) {
                that.setData({
                  isLoadMoreOrg: false,
                  isHideLoadMoreOrg: true,
                  noSearchOrg:true
                })
              } else {
                that.setData({
                  isLoadMoreInstitution: false,
                  isHideLoadMoreInstitution: true,
                  noSearchInstitution:true
                })
              }
            }else{
              if (that.data.nowRole == 0) {
                that.setData({
                  isLoadMoreOrg: true,
                  isHideLoadMoreOrg: true,
                  noSearchOrg: false
                })
              } else {
                that.setData({
                  isLoadMoreInstitution: true,
                  isHideLoadMoreInstitution: true,
                  noSearchInstitution: false
                })
              }
            }
          }
        } else {
  
          if (that.data.nowRole == 0) {
            that.setData({
              isLoadMoreOrg: false,
              isHideLoadMoreOrg: true,
              noSearchOrg: true
            })
          } else {
            that.setData({
              isLoadMoreInstitution: false,
              isHideLoadMoreInstitution: true,
              noSearchInstitution: true
            })
          }
        }
        wx.hideLoading()
      }
    })

    // api.fetchRequest('organizations/' + that.data.secondFieldId + '/top-organizations', {
    //   content: that.data.searchInput,
    //   courseName: that.data.fieldName,
    //   orgType: type,
    //   pageNo: pageNo,
    //   pageSize: 10
    // }, 'GET', 0, {
    //   'Authorization': 'Bearer' + _token
    // }, true).then(function(res) {
    //   let code = res.data.code;
    //   if (code == 200) {
    //     let data = res.data.data
    //     if (data != null && data.length > 0) {
    //       let _orgsList = that.data.orgsList
    //       for (let i in data) {
    //         _orgsList.push(data[i])
    //       }
    //       if (that.data.nowRole == 0) {
    //         that.setData({
    //           orgsList: _orgsList,
    //           isLoadMoreOrg: true,
    //           isHideLoadMoreOrg: true,
    //           noSearchOrg: true
    //         })
    //       } else {
    //         that.setData({
    //           orgsList: _orgsList,
    //           isLoadMoreInstitution: true,
    //           isHideLoadMoreInstitution: true,
    //           noSearchInstitution: true
    //         })
    //       }
    //     } else {
    //       if(pageNo!=0){
    //         if (that.data.nowRole == 0) {
    //           that.setData({
    //             isLoadMoreOrg: false,
    //             isHideLoadMoreOrg: true,
    //             noSearchOrg:true
    //           })
    //         } else {
    //           that.setData({
    //             isLoadMoreInstitution: false,
    //             isHideLoadMoreInstitution: true,
    //             noSearchInstitution:true
    //           })
    //         }
    //       }else{
    //         if (that.data.nowRole == 0) {
    //           that.setData({
    //             isLoadMoreOrg: true,
    //             isHideLoadMoreOrg: true,
    //             noSearchOrg: false
    //           })
    //         } else {
    //           that.setData({
    //             isLoadMoreInstitution: true,
    //             isHideLoadMoreInstitution: true,
    //             noSearchInstitution: false
    //           })
    //         }
    //       }
    //     }
    //   } else {

    //     if (that.data.nowRole == 0) {
    //       that.setData({
    //         isLoadMoreOrg: false,
    //         isHideLoadMoreOrg: true,
    //         noSearchOrg: true
    //       })
    //     } else {
    //       that.setData({
    //         isLoadMoreInstitution: false,
    //         isHideLoadMoreInstitution: true,
    //         noSearchInstitution: true
    //       })
    //     }
    //   }
    //   wx.hideLoading()
    // })
  },
  /**
   * 报考
   */
  enterBitap: function (e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let fieldsList = that.data.orgsList
    let id = fieldsList[_index].orgId
    let name = fieldsList[_index].orgName
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      type: "orgs",
      moreId: id,
      moreName: name,
      moreSecondFieldId: that.data.secondFieldId,
      moreSecondFieldName: that.data.secondFieldName,
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  },
  
  /**
   * item条目
   */
  orgsBitp: function (e) {
    let that = this
    let _index = e.currentTarget.dataset.index
    let _type = e.currentTarget.dataset.type
    let orgsList = that.data.orgsList
    let id = orgsList[_index].orgId
    let name = orgsList[_index].orgName
    let typeNum = 2
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + id + "&type=" + typeNum
    })

  },

/**
   * 导师item
   */
  scholarsItem:function(e){
    let id = e.currentTarget.dataset.id
    let typeNum = 1
    wx.navigateTo({
      url: '/pages/firstField/personalDetails/personalDetails?fieldId=' + id + "&type=" + typeNum
    })
  },
  

  /**
   * 上拉加载
   */
  loadMore: function(e) {
    let that = this
    pageNo++
    let type = ""
    if (that.data.currentIndex == 0 || that.data.nowRole == 0) {
      type = "university"
      that.setData({
        isHideLoadMoreOrg: false,
        isLoadMoreOrg: true
      })
    } else if (that.data.currentIndex == 1 || that.data.nowRole == 1) {
      type = "institution"
      that.setData({
        isHideLoadMoreInstitution: false,
        isLoadMoreInstitution: true
      })
    }
    that.getData(that, type)
  },
  /**
 * 禁止左右滑动
 */
  stopTouchMove: function () {
    return false
  },
})