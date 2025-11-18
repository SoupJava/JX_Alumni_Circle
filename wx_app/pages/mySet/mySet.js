// pages/mySet/mySet.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    active: 'user',
    userInfo: '',
    isLogin: false,
    height: 0,
    // active: 'user',
    showShare: false,
    options: [{
        name: '微信',
        icon: 'wechat',
        openType: 'share'
      },
      {
        name: 'QQ',
        icon: 'qq',
        openType: 'share'
      },
      {
        name: '微博',
        icon: 'weibo',
        openType: 'share'
      },
      {
        name: '复制链接',
        icon: 'link',
        openType: 'share'
      },
      {
        name: '分享海报',
        icon: 'poster',
        openType: 'share'
      },
      {
        name: '二维码',
        icon: 'qrcode',
        openType: 'share'
      },
    ],
  },
  LookComment(){
    wx.navigateTo({
      url: '/pages/AllDynamics/AllDynamics?active=0&&openid='+this.data.userInfo.openid,
    })
  },
  LookHelp(){
    wx.navigateTo({
      url: '/pages/AllDynamics/AllDynamics?active=1&&openid='+this.data.userInfo.openid,
    })
  },
  LookSale(){
    wx.navigateTo({
      url: '/pages/AllDynamics/AllDynamics?active=2&&openid='+this.data.userInfo.openid,
    })
  },
  LookReturn(){
    wx.navigateTo({
      url: '/pages/AllDynamics/AllDynamics?active=3&&openid='+this.data.userInfo.openid,
    })
  },
  LookMessage(){
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  MyOrder(){
    wx.navigateTo({
      url: '/pages/MotionMessage/MotionMessage',
    })
  },
  MyShopMessage(){
    wx.navigateTo({
      url: '/pages/CorrectMotion/CorrectMotion',
    })
  },
  onClick(event) {
    this.setData({
      showShare: true
    });
  },
  onClose() {
    this.setData({
      showShare: false
    });
  },
  onSelect(event) {
    Toast(event.detail.name);
    this.onClose();
  },
  MyMessage() {
    wx.navigateTo({
      url: '/pages/CorrectMessage/CorrectMessage'
    })
  },
  MyTheme(){
    wx.navigateTo({
      url: '/pages/setTheme/setTheme?id='+this.data.userInfo.openid
    })
  },
  OnLogin() {
    console.log(123)
    console.log(this.data.userInfo)
    if (this.data.userInfo === undefined) {
      wx.navigateTo({
        url: '/pages/regist/regist'
      })
    }
  },
  onChange(event) {
    this.setData({
      active: event.detail
    });
  },
  connect(){
    var uuid=getApp().uuid()
    console.log(uuid)
    wx.cloud.database().collection('jxuser').where({
      openid:this.data.userInfo.openid}).update({
      data:{
        ['token_time.token']:"JavaSoup_"+uuid,
        ['token_time.begintime']:wx.cloud.database().serverDate(),
        ['token_time.endtime']:wx.cloud.database().serverDate({
          offset: 2.5 * 60 * 1000
        })
      }
    }).then(res=>{
      console.log("res:",res)
    }).catch(err=>{
      console.log("err:",err)
    })
    wx.setClipboardData({
      data: "JavaSoup_"+uuid,
      success(res2) {
          wx.getClipboardData({
              success(res2) {
                  // Toast.success("下载地址已粘贴到剪贴板，请在5分钟内浏览器访问下载~~~")
              }
          })
      }
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
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