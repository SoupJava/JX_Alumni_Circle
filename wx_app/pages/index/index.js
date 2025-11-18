// pages/index/index.js
import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'home',
    height: 0,
    SchoolComment: [],
    HelpDiscuss: [],
    shSale: [],
    LossReturn: [],
    search: '',
    nomore: [false, false, false, false],
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,
    goodWidth: wx.getSystemInfoSync().windowWidth,
  },
  changeSearch(e) {
    this.setData({
      search: e.detail,
    });
  },
  onSearch() {
    if (parseFloat(this.data.search).toString() == "NaN") {
      wx.cloud.database().collection('jxuser').where({
        username: this.data.search
      }).get().then(res => {
        console.log("查询成功:", res.data[0])
        if (res.data.length > 0)
          wx.navigateTo({
            url: '/pages/userinfo/userinfo?id=' + res.data[0].openid,
          })
        else {
          Toast.fail("查无此用户")
        }
      }).catch(err => {
        console.log("查询失败:", err)
      })
    } else {
      wx.cloud.database().collection('jxuser').where({
        jxid: this.data.search
      }).get().then(res => {
        console.log("查询成功:", res.data[0])
        if (res.data.length > 0)
          wx.navigateTo({
            url: '/pages/userinfo/userinfo?id=' + res.data[0].openid,
          })
        else {
          Toast.fail("查无此用户")
        }
      }).catch(err => {
        console.log("查询失败:", err)
      })
    }
  },
  ChangeTabs(e) {
    console.log(e.detail)
    if (e.detail.index == 1) {
      this.getHelpDiscuss()
    } else if (e.detail.index == 2) {
      this.getshSale()
    } else if (e.detail.index == 3) {
      this.getLossReturn()
    } else if (e.detail.index == 0) {
      this.getSchoolComment()
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onChange(event) {
    this.setData({
      active: event.detail
    });
  },
  onLoad(options) {
    let that = this;
    getApp().watch(that.watchBack)
  },
  watchBack(chatList){
    console.log(chatList)
    Notify({ type: 'primary', duration: 4000, message: getApp().globalData.chatList});
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.getSystemInfo({
      success: (
        windowHeight
      ) => {
        // todo
        this.setData({
          height: windowHeight.windowHeight - 190
        })
      }
    });
  },
  addnew(){
    wx.navigateTo({
      url: '/pages/send/send',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.onAccelerometerChange(function (res) {
      //console.log(res.x)
      //console.log(res.y)
     // console.log(res.z)
      if (res.x > .7 && res.y > .7) {
        wx.cloud.database().collection('jxuser').aggregate().match({
          school: getApp().globalData.userInfo.school
        }).sample({
          size: 1
        }).end()
        .then(res=>{
          console.log("test")
          console.log(res.list[0].openid)
          Toast.success("查找到一位校友")
          wx.vibrateLong();
          wx.redirectTo({
            url: '/pages/userinfo/userinfo?id=' + res.list[0].openid,
          })
        })
      }
    })
    this.getSchoolComment()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  loadMore() {
    this.getSchoolComment()
  },
  loadMore2() {
    this.getHelpDiscuss()
  },
  loadMore3() {
    this.getshSale()
  },
  loadMore4() {
    this.getLossReturn()
  },
  getSchoolComment() {
    wx.cloud.database().collection('jxComment').field({
        LoveID: false,
        ChatMessage: false
      }).orderBy('sendCurrentTime', 'desc').limit(20).skip((this.data.SchoolComment.length / 20) * 20).get()
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
      }).orderBy('sendCurrentTime', 'desc').limit(20).skip((this.data.HelpDiscuss.length / 20) * 20).get()
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
    wx.cloud.database().collection('jxSale').orderBy('sendCurrentTime', 'desc')
      .limit(20).skip((this.data.shSale.length / 20) * 20).get()
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
    wx.cloud.database().collection('jxReturn').orderBy('sendCurrentTime', 'desc')
      .limit(20).skip((this.data.LossReturn.length / 20) * 20).get()
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
  },
})