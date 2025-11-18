// pages/setTheme/setTheme.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kcbcolor: [
      "#AEEC34",
      "#FFC44F",
      "#85B0FD",
      "#FEA17C",
      "#FF9392",
      "#D48DF9",
      "#7FCFF8",
      "#85B8CF",
      "#90C652",
      "#D8AA5A",
      "#FC9F9D",
      "#0A9A84",
      '#00AC84',
      "#61BC69",
      "#12AEF3",
      "#E29AAD",
      '#C7EDCC',
      '#FAF9DE',
      '#FFF2E2',
      '#FDE6E0',
      '#E3EDCD',
      '#DCE2F1',
      '#E9EBFE',
      '#EAEAEF',
      '#B7E8BD',
      '#CCE8CF',
      '#404040'
    ],
    kcbemoji: [
      '向下看',
      '向上看',
      '眨眼',
      '睿智',
      '瞪着你',
      '无语',
    ],
    themecolor: '',
    themeemoji:0,
    userinfo:'',
  },
  OKCorrect(){
    wx.cloud.database().collection('jxuser').where({
      openid:this.data.userinfo.openid
    }).update({
      data:{
        theme:{
          color:this.data.themecolor,
          emoji:this.data.themeemoji
        }
      }
    }).then(res=>{
      console.log(res)
      var app = getApp();
      app.globalData.userInfo.theme.color = this.data.userinfo.theme.color;
      app.globalData.userInfo.theme.emoji = this.data.userinfo.theme.emoji;
      Toast.success('小新修改成功')
    }).catch(err=>{
      console.log(err)
    })
  },
  Changecolor(e) {
    this.setData({
      themecolor: e.currentTarget.dataset.it,
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: e.currentTarget.dataset.it
    });

  },
  ChangeEmoji(e){
    // console.log(e.currentTarget.dataset.it)
    this.setData({
      themeemoji: e.currentTarget.dataset.it,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.database().collection('jxuser').where({
      openid:options.id
    }).get().then(res=>{
      console.log("查询成功:", res.data)
      this.setData({
        userinfo:res.data[0],
        themecolor: res.data[0].theme.color,
        themeemoji:res.data[0].theme.emoji,
      })
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: res.data[0].theme.color
      });
    }).catch(err=>{
      console.log("查询失败:", err)
    })
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

  }
})