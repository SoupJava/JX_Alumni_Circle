// pages/tree/tree.js
import Toast from '@vant/weapp/toast/toast';
const SUBSCRIBE_ID = 'fggVPG4bcxBtFKIXzaFvVCto0JZH6JLB8ZP99QEmyaA'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'tree',
    userinfo: '',
    wateringnum: 520,
    thirsty: false,
    doingcontrol: 0,
    thirsty_time:0,
  },
  onChange(event) {
    this.setData({
      active: event.detail
    });
  },
  back(e) {
    // console.log(1)
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },
  courseSubscribe(e) {
    // 获取课程相关信息
    let coueseInfo = {
        thing1: {
          value: "智慧树浇水提醒"
        },
        character_string3: {
          value: this.data.userinfo.tree.num + 1
        },
        date14: {
          value: this.getBzTime(this.data.userinfo.tree.thirsty_time)
        },
        thing19:{
          value:"缺水"
        },
        thing21:{
          value:"我渴了，该浇水啦！ ┭┮﹏┭┮"
        }
      }
      var that=this
    wx.requestSubscribeMessage({
      tmplIds: [SUBSCRIBE_ID],
      success(res) {
        if (res[SUBSCRIBE_ID] === 'accept') {
          // 调用云函数subscribe
          wx.cloud
            .callFunction({
              name: 'addCountDay',
              data: {
                data: coueseInfo,
                templateId: SUBSCRIBE_ID,
                sendtime:that.data.thirsty_time,
              },
            })
            .then(() => {
              that.setData({
                thirsty: false,
                doingcontrol: 1,
                ['userinfo.tree.num']: that.data.userinfo.tree.num + 1,
              })
              wx.cloud.database().collection('jxuser').where({
                openid: getApp().globalData.user_openid,
              }).update({
                data: {
                  tree:{
                    num:that.data.userinfo.tree.num,
                    thirsty_time:that.data.thirsty_time
                  }
                }
              }).then(res => {
                console.log("修改成功", res.data)
              }).catch(err => {
                console.log("err:", err)
              })
            })
            .catch((e) => {
              console.log(e)
            });
        }
      },
    });
  },
  watering() {
    var n=12*60*60*1000
    this.setData({
     thirsty_time:Date.parse(new Date())+Math.random()*n + n
    })
    console.log(getApp().globalData.userInfo.tree.thirsty_time)
    if (Date.parse(new Date()) > getApp().globalData.userInfo.tree.thirsty_time&&this.data.doingcontrol==0) {
      this.courseSubscribe()
    }else{
      Toast('我还不渴呦')
    }
  },
  AIChat(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/ChatAI/ChatAI?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userinfo: getApp().globalData.userInfo
    })
    if (Date.parse(new Date()) > getApp().globalData.userInfo.tree.thirsty_time) {
      this.setData({
        thirsty: true,
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getBzTime(e){
    var oDate = new Date(e),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds()
    if(oMin<10){
      oMin='0'+oMin
    }
    var oTime = oYear + '年' + oMonth + '月' + oDay+'日 '+oHour+':'+oMin;
    return oTime
  },
})