// pages/ShowTomato/ShowTomato.js
import Notify from '@vant/weapp/notify/notify';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      continue:false,
      value:0,
      alltime:0,
      event:'',
      gradientColor: {
        '0%': '#ffd01e',
        '100%': '#ff976a',
      },
      time: 1 *  60 * 1000,
      begintime:0
    },
    onChange(e) {
      this.setData({
        timeData: e.detail,
        value:((this.data.alltime*60*1000-((e.detail.hours*60+e.detail.minutes)*60*1000+e.detail.seconds*1000+e.detail.milliseconds))/(this.data.alltime*60*1000))*100
      });

    },
    start() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.start();
      this.setData({
        continue:false
      })
    },
    pause() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.pause();
      this.setData({
        continue:true
      })
    },
    end(){
      wx.navigateBack()
    },
    finished(){
      Notify({ type: 'primary', message: "'"+this.data.event+"'"+'任务已完成，已保存至云端！' });
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('jxtomato').where({
        openid:getApp().globalData.user_openid,
      }).update({
        data:{
          task:_.push({
            event:this.data.event,
            continueTime:this.data.alltime,
            begintime:this.data.begintime
          })
        }
      }).then(res=>{
        wx.navigateBack()
      }).catch(e=>{
        console.log(e)
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var oDate=new Date(new Date().getTime()),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
       oHour = oDate.getHours(),
       oMin = oDate.getMinutes(),
       oSen = oDate.getSeconds(),
       oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay) + ' ' + this.getBz(oHour) + ':' + this.getBz(oMin) + ':' + this.getBz(oSen);
      this.setData({
        alltime:options.alltime,
        event:options.event,
        time:options.alltime*  60 * 1000,
        begintime:oTime
      })
    },
    getBz(num) { //补零
      if (parseInt(num) < 10) {
        num = '0' + num;
      }
      return num;
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