// pages/photo/photo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      message:'',
      words:[]
    },
  // 拍摄按钮按下, 执行record 触发拍摄
  record(){
    const that = this
    this.data.cameraContext = wx.createCameraContext()
    this.data.cameraContext.takePhoto({
      quality:"high", //高质量的图片
      success: res => {
        //res.tempImagePath照片文件在手机内的的临时路径
        let tempFilePath = res.tempImagePath
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: function (res) {
            //调用方法
            that.getImgInfo(res.data)
          },
        })
      }
    })
  },  //根据图片的内容调用API获取图片文字
  getImgInfo: function (imageData) {
    wx.showLoading({
      title: '识别中...',
    })
    var that = this
    that.getBaiduToken().then(res => {
      console.log(res)
      //获取token
      const token = res.data.access_token
      console.log(token)
      const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}` // baiduToken是已经获取的access_Token      
      wx.request({
        url: detectUrl,
        data: {
          image: imageData
        },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 必须的        
        },
        success: function (res, resolve) {
          console.log(res)
          //将 res.data.words_result数组中的内容加入到words中           
          that.setData({
            words: res.data.words_result
          })
          console.log('识别后： ' + res.data.words_result)
          var pages=getCurrentPages()
          var prevPage=pages[pages.length-2];
          var newmessage=that.data.message 
          // console.log(newmessage)
          var content=''
          for(var i=0;i<that.data.words.length;i++){
            content+=that.data.words[i].words
          }
          prevPage.setData({
            message:newmessage+content
          })
          wx.hideLoading()
          wx.navigateBack({
            delta:1
          })
        },
        fail: function (res, reject) {
          console.log('get word fail：', res.data);
          wx.hideLoading()
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    })
  },
  // 获取百度access_token  
  getBaiduToken: function () {
    return new Promise(resolve => {
      var APIKEY = "kwGS7aIyiiHpjAC5bDnnXPdd"
      var SECKEY = "65DsjVWanoOoh91GcY6lZ0Qcp2PcGivd"
      var tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${APIKEY}&client_secret=${SECKEY}`
      var that = this;
      wx.request({
        url: tokenUrl,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json; charset-UTF-8'
        },
        success: function (res) {
          console.log("[BaiduToken获取成功]", res);
          return resolve(res)
        },
        fail: function (res) {
          console.log("[BaiduToken获取失败]", res);
          return resolve(res)
        }
      })
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setData({
        message:options.message
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