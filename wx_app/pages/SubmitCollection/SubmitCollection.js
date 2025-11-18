// pages/SubmitCollection/SubmitCollection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classid: '',
    ImageTemp: [],
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
  afterRead(e) {
    const {
      file
    } = e.detail;
    var temp = [{
      url: '',
      name: this.data.ImageTemp.length,
      realname: ''
    }]
    console.log(file.url)
    temp[0].url = file.url
    var t = this.data.ImageTemp
    t.push(temp[0])
    this.setData({
      ImageTemp: t
    });
  },
  sendComment() {
    if (this.data.ImageTemp.length > 0 || this.data.currentWord > 0) {
      if (this.data.ImageTemp.length > 0) {
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          this.data.ImageTemp[i].realname = getApp().globalData.user_openid + '-' + getApp().uuid() + '.' + this.data.ImageTemp[i].url.split('.')[1]
          wx.uploadFile({
            url: 'http://192.168.130.20:30000/uploadFile/',
            filePath: this.data.ImageTemp[i].url,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              console.log(res.data + "结果")
            }
          })
        }
        // const db = wx.cloud.database()
        // const _ = db.command
        // db.collection('jxCollection').doc(this.data.classid)
        // .update({
        //   data:{
        //     SubmitStudent:_.push({
        //       user_openid:getApp().globalData.user_openid,
        //       username:'',
        //       time:new Date().getDate(),
        //       fileaddress:this.data.ImageTemp
        //     })
        //   }
        // }).then(res=>{
        //   wx.navigateBack({
        //     delta:2
        //   })
        // }).catch(err=>{
        //   console.log(err)
        // })
        // for (var i = 0; i < this.data.ImageTemp.length; i++) {
        //   this.uploadImage('CommentImage/', imagename[i], i)
        // }
        // for (var i = 0; i < imagename.length; i++) {
        //   imageurl.push(this.data.envcc + 'CommentImage/' + imagename[i] + '.png')
        // }
      }
      console.log(this.data.ImageTemp)
    } else {
      Toast.fail("请输入内容!")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      classid: options.classid
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