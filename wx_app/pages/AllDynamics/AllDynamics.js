// pages/AllDynamics/AllDynamics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    SchoolComment: [],
    HelpDiscuss: [],
    shSale: [],
    LossReturn: [],
    openid: '',
    userinfo: '',
    nomore: [false, false, false, false],
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,
    goodWidth: wx.getSystemInfoSync().windowWidth,
  },
  LookComment(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/CommentInfo/CommentInfo?id=' + id,
    })
  },
  LookHelp(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/HelpInfo/HelpInfo?id=' + id,
    })
  },
  LookSale(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/SaleInfo/SaleInfo?id=' + id,
    })
  },
  LookReturn(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/ReturnInfo/ReturnInfo?id=' + id,
    })
  },
  LookUser(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
    })
  },
  ChangeComment() {
    this.setData({
      active: 0,
    })
    this.getSchoolComment()
  },
  ChangeHelp() {
    this.setData({
      active: 1,
    })
    this.getHelpDiscuss()
  },
  ChangeSale() {
    this.setData({
      active: 2,
    })
    this.getshSale()
  },
  ChangeReturn() {
    this.setData({
      active: 3,
    })
    this.getLossReturn()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      active: options.active,
      openid: options.openid
    })
    wx.cloud.database().collection('jxuser').where({
        openid: this.data.openid
      }).get()
      .then(res => {
        console.log("查询成功:", res.data)
        this.setData({
          userinfo: res.data[0]
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: res.data[0].theme.color
        });
      }).catch(err => {
        console.log("查询失败:", err)
      })
    if (this.data.active == 0) {
      this.getSchoolComment()
    } else if (this.data.active == 1) {
      this.getHelpDiscuss()
    } else if (this.data.active == 2) {
      this.getshSale()
    } else {
      this.getLossReturn()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.active==0){
      this.getSchoolComment()
    }else if(this.data.active==1){
      this.getHelpDiscuss()
    }else if(this.data.active==2){
      this.getshSale()
    }else if(this.data.active==3){
      this.getLossReturn()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getSchoolComment() {
    wx.cloud.database().collection('jxComment').field({
        LoveID: false,
        ChatMessage: false
      }).orderBy('sendCurrentTime', 'desc').where({
        openid: this.data.openid
      }).limit(20).skip((this.data.SchoolComment.length / 20) * 20).get()
      .then(res => {
        if (res.data.length == 0) {
          this.setData({
            'nomore[0]': true
          })
        } else {
          this.setData({
            'nomore[0]': false
          })
        }
        let temp = this.data.SchoolComment
        this.setData({
          SchoolComment: temp.concat(res.data)
        })
        // console.log("SchoolComment:", this.data.SchoolComment[0].userInfo.userName)
      }).catch(err => {
        console.log("查询失败:", err)
      })
  },
  getHelpDiscuss() {
    wx.cloud.database().collection('jxHelp').field({
        ChatMessage: false
      }).orderBy('sendCurrentTime', 'desc').where({
        openid: this.data.openid
      }).limit(20).skip((this.data.HelpDiscuss.length / 20) * 20).get()
      .then(res => {
        if (res.data.length == 0) {
          this.setData({
            'nomore[1]': true
          })
        } else {
          this.setData({
            'nomore[1]': false
          })
        }
        let temp = this.data.HelpDiscuss
        this.setData({
          HelpDiscuss: temp.concat(res.data)
        })
        // console.log("HelpDiscuss:", this.data.HelpDiscuss[0].userInfo.userName)
      }).catch(err => {
        console.log("查询失败:", err)
      })
  },
  getshSale() {
    wx.cloud.database().collection('jxSale').orderBy('sendCurrentTime', 'desc').where({
      openid: this.data.openid
    }).limit(20).skip((this.data.shSale.length / 20) * 20).get()
      .then(res => {
        if (res.data.length == 0) { 
          this.setData({
            'nomore[2]': true
          })
        } else {
          this.setData({
            'nomore[2]': false
          })
        }
        let temp = this.data.shSale
        this.setData({
          shSale: temp.concat(res.data)
        })
      }).catch(err => {
        console.log("查询失败:", err)
      })
  },
  getLossReturn() {
    wx.cloud.database().collection('jxReturn').orderBy('sendCurrentTime', 'desc').where({
      openid: this.data.openid
    }).limit(20).skip((this.data.LossReturn.length / 20) * 20).get()
      .then(res => {
        if (res.data.length == 0) {
          this.setData({
            'nomore[3]': true
          })
        } else {
          this.setData({
            'nomore[3]': false
          })
        }
        let temp = this.data.LossReturn
        this.setData({
          LossReturn: temp.concat(res.data)
        })
      }).catch(err => {
        console.log("查询失败:", err)
      })
  }
})