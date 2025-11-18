// pages/KeepMotion/KeepMotion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    name:'',
    h: '00',
    m: '00',
    s: '00',
    //存储计时器
    setInter: '',
    num: 1,
    continue:false
  },
  queryTime() {
    const that = this;
    var hou = that.data.h
    var min = that.data.m
    var sec = that.data.s
    that.data.setInter = setInterval(function () {
      sec++
      if (sec >= 60) {
        sec = 0
        min++
        if (min >= 60) {
          min = 0
          hou++
          that.setData({
            h: (hou < 10 ? '0' + min : min)
          })
        } else {
          that.setData({
            m: (min < 10 ? '0' + min : min)
          })
        }
      } else {
        that.setData({
          s: (sec < 10 ? '0' + sec : sec)
        })
      }
      var numVal = that.data.num + 1;
      that.setData({
        num: numVal
      });
      console.log('setInterval==' + that.data.num);
    }, 1000)
  },

  taskStart() {
    this.queryTime()
  },
  taskEnd() {
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },
  start(){
    this.queryTime()
    this.setData({
      continue:false
    })
  },
  pause(){
    var that =this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    this.setData({
      continue:true
    })
  },
  end(){
    var that =this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    const db = wx.cloud.database()
      const _ = db.command
    db.collection('jxMotionUserMessage').where({
      openid:getApp().globalData.user_openid
    }).update({
      data: {
        motion:_.push({
          name:this.data.name,
          fruit:this.data.num,
          keeptime:this.data.h+':'+this.data.m+':'+this.data.s,
          begintime:this.getNowDate(),
          img:this.data.img
        })
      }
    }).then(res=>{
      console.log(res)
      wx.navigateBack();
    }).catch(err=>{
      console.log(err)
    })
  },
  getNowDate() {
    var oDate = new Date(),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay) + ' ' + this.getBz(oHour) + ':' + this.getBz(oMin) + ':' + this.getBz(oSen);
    return oTime
  },
  getBz(num) { //补零
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.motion)
    console.log(options.img)
    this.setData({
      img:options.img,
      name:options.motion
    })
   this.queryTime()
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
    var that =this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
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