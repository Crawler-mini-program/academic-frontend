//获奖信息详情
Page({

  /**
   * 页面的初始数据
   */
  data: {
    awardProject:'',
    awardName:'',
    degree:'',
    year:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that=this
    let _awardProject = options.awardProject
    let _awardName = options.awardName
    let _year = options.year
    let _degree=options.degree
      that.setData({
        awardProject: _awardProject,
        awardName: _awardName,
        year:_year,
        degree:_degree
      })
  },
})