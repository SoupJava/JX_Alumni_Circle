// pages/CreateCollectionTask/CreateCollectionTask.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      title:"收青年大学习",
      message:"请大家及时提交青年大学习截图！",
      seltime:false,
      time:'',
      ImageTemp: [],
      datetime: {
        minHour: 0,
        maxHour: 23,
        minDate: new Date(1999, 10, 1).getTime(),
        maxDate: new Date(2099, 10, 1).getTime(),
        currentDate: '',
        showDate: '',
      },
      maxWord:500,
      currentWord:15,
    },
    sendComment(e){
      wx.cloud.database().collection('jxCollection').add({
        data:{
          jxclass:getApp().globalData.userInfo.jxclass,
          creater_openid:getApp().globalData.user_openid,
          TaskTitle:this.data.title,
          TaskMain:this.data.message,
          Image:[],
          DeathlineDate:this.data.datetime.currentDate,
          DeathlineDateShow:this.data.datetime.showDate,
          SubmitStudent:[

          ]
        }
      })
      .then(res=>{
        console.log('成功',res)
        wx.navigateBack()
      })
      .catch(err=>{
        console.log(err)
      })
    },
    closeseltime() {
      this.setData({
        seltime: false,
      })
    },
    confirmtime() {
      this.setData({
        time: this.data.datetime.showDate,
      })
      this.closeseltime()
    },
    changeseltime(e) {
      var oDate = new Date(e.detail),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay) + ' ' + this.getBz(oHour) + ':' + this.getBz(oMin) + ':' + this.getBz(oSen);
      this.setData({
        ['datetime.currentDate']: e.detail,
        ['datetime.showDate']: oTime,
      });
    },
    getBz(num) { //补零
      if (parseInt(num) < 10) {
        num = '0' + num;
      }
      return num;
    },
    showseltime() {
      this.setData({
        seltime: true,
        ['datetime.currentDate']: new Date().getTime(),
      })
    },
    showseltime() {
      this.setData({
        seltime: true,
        ['datetime.currentDate']: new Date().getTime(),
      })
    },
    limitWord(e) {
      var that = this;
      var value = e.detail.value;
      //解析字符串长度转换成整数。
      var wordLength = parseInt(value.length);
      if (that.data.maxWord < wordLength) {
        return;
      }
      that.setData({
        ['returnMessage.describe']: value,
        currentWord: wordLength
      });
    },
    afterRead(e) {
      const {
        file
      } = e.detail;
      var temp = [{
        url: '',
        name: this.data.ImageTemp.length
      }]
      console.log(file.url)
      temp[0].url = file.url
      var t = this.data.ImageTemp
      t.push(temp[0])
      this.setData({
        ImageTemp: t
      });
    },
    deleteImg(event) {
      console.log(event.detail.index)
      var delIndex = event.detail.index
      var newtemp = []
      var con = false
      for (var i = 0; i < this.data.ImageTemp.length; i++) {
        if (i == delIndex) {
          con = true
        } else {
          var temp = {
            url: this.data.ImageTemp[i].url,
            name: con ? i - 1 : i
          }
          newtemp.push(temp)
        }
      }
      this.setData({
        ImageTemp: newtemp
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