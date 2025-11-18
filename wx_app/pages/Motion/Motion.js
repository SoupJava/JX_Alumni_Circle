// pages/Motion/Motion.js
import Dialog from '@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      active:'money',
      MotionMessage:'',
      BMI:'',
      allhour:0,
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
    /**
     * 生命周期函数--监听页面加载
     */
    GoMotion(e){
      var motion=e.currentTarget.dataset.name;
      var img=e.currentTarget.dataset.img;
      Dialog.confirm({
        message: "是否要开始'"+motion+"'运动？",
      }).then(()=>{
        wx.navigateTo({
          url: '/pages/KeepMotion/KeepMotion?motion='+motion+'&img='+img,
        })
      }).catch(()=>{

      });
    },
    onLoad(options) {
      wx.cloud.database().collection('jxMotionUserMessage').where({
        openid:getApp().globalData.user_openid
      }).get()
      .then(res=>{
        var bb=parseFloat(res.data[0].weight)/parseFloat((res.data[0].height/100)*(res.data[0].height/100))+' '
        var b=bb.substring(0, bb.indexOf(".") + 3)
        this.setData({
          MotionMessage:res.data[0],
          BMI:b
        })
        var alltime=0
        for(var i=0;i<res.data[0].motion.length;i++){
          alltime+=res.data[0].motion[i].fruit
        }
       var aa=parseFloat(alltime)/3600+' '
       var a=aa.substring(0, aa.indexOf(".") + 3)
       this.setData({
         allhour:a
       })
      }).catch(err=>{
        console.log(err)
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
      this.onLoad()
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