// pages/TomatoTime/TomatoTime.js
import Toast from '@vant/weapp/toast/toast';
const SUBSCRIBE_ID = 'lpMxg_8kTHw7-fyj9OKD1GCa8cBckq0tY9SM9ziOndQ'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      currentValue: 50,
      gradientColor: {
        '0%': '#ffd01e',
        '100%': '#00ac84',
      },
      event:'其他',
      change:0
    },
    c1(){
      this.setData({
        event:'工作',
        change:1
      })
      Toast('当前选择:工作')
    },
    c2(){
      this.setData({
        event:'学习',
        change:2
      })
      Toast('当前选择:学习')
    },
    c3(){
      this.setData({
        event:'思考',
        change:3
      })
      Toast('当前选择:思考')
    },
    c4(){
      this.setData({
        event:'写作',
        change:4
      })
      Toast('当前选择:写作')
    },
    c5(){
      this.setData({
        event:'阅读',
        change:5
      })
      Toast('当前选择:阅读')
    },
    c6(){
      this.setData({
        event:'其他',
        change:0
      })
      Toast('当前选择:其他')
    },
    onDrag(event) {
      this.setData({
        currentValue: event.detail.value,
      });
    },
    getBzTime(e){
      var oDate = new Date(e),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '年' + oMonth + '月' + oDay+'日 '+oHour+':'+oMin;
      return oTime
    },
    courseSubscribe(e) {
      // 获取课程相关信息
      let coueseInfo = {
          thing1: {
            value: "番茄钟截至提醒"
          },
          thing2: {
            value: this.data.event
          },
          time3: {
            value: this.getBzTime(new Date().getTime())
          },
          time4:{
            value:this.getBzTime(new Date().getTime()+this.data.currentValue*60000)
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
                  sendtime:new Date().getTime()+that.data.currentValue*60000,
                },
              })
              .then(() => {
                wx.navigateTo({
                  url: '/pages/ShowTomato/ShowTomato?alltime='+that.data.currentValue+'&event='+that.data.event,
                })
              })
              .catch((e) => {
                console.log(e)
              });
          }
        },
      });
    },
    begin(){
      this.courseSubscribe()
    },
    history(){
      wx.navigateTo({
        url: '/pages/StaTomato/StaTomato',
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