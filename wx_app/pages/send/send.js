// pages/send/send.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'add',
    show: false,
    selid: 0,
    maxWord: 500,
    currentWord: 0,
    ImageTemp: [],
    content: '',
    seltime: false,
    datetime: {
      minHour: 0,
      maxHour: 23,
      minDate: new Date(1999, 10, 1).getTime(),
      maxDate: new Date(2099, 10, 1).getTime(),
      currentDate: '',
      showDate: '',
    },
    returnMessage: {
      LorR: "0",
      sendtime: '',
      place: '',
      contract: '',
      describe: '',
      maxWord: 300
    },
    actions: [{
        name: '校园动态',
        id: 0
      },
      {
        name: '问答求助',
        id: 1
      },
      {
        name: '二手出售',
        id: 2
      },
      {
        name: '失物招领',
        id: 3
      },
    ],
    envcc: 'cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/'
  },
  closeseltime() {
    this.setData({
      seltime: false,
    })
  },
  confirmtime() {
    this.setData({
      ['returnMessage.sendtime']: this.data.datetime.showDate,
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
  ChangeLorR(e) {
    this.setData({
      ['returnMessage.LorR']: e.detail,
    })
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
  ShowSelect() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  placeInput(e) {
    this.setData({
      ['returnMessage.place']: e.detail
    })
  },
  contractInput(e) {
    this.setData({
      ['returnMessage.contract']: e.detail
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
  onSelect(event) {
    console.log(event.detail);
    this.setData({
      selid: event.detail.id
    })
  },
  sendComment() {
    if (this.data.ImageTemp.length > 0 || this.data.currentWord > 0) {
      var imagename = []
      var imageurl = []
      if (this.data.ImageTemp.length > 0) {
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          imagename.push(getApp().globalData.user_openid + '-' + getApp().uuid())
        }
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          this.uploadImage('CommentImage/', imagename[i], i)
        }
        for (var i = 0; i < imagename.length; i++) {
          imageurl.push(this.data.envcc + 'CommentImage/' + imagename[i] + '.png')
        }
      }
      wx.cloud.database().collection('jxComment').add({
        data: {
          ChatMessage: [],
          ChatNum: 0,
          CommentImage: imageurl,
          CommentMessage: this.data.content,
          LoveID: [],
          LoveNum: 0,
          openid: getApp().globalData.user_openid,
          sendCurrentTime: wx.cloud.database().serverDate(),
          sendTime: this.getNowDate(),
          userInfo: {
            userImage: getApp().globalData.userInfo.userimage,
            userName: getApp().globalData.userInfo.username,
            userSex: getApp().globalData.userInfo.sex,
          }
        }
      }).then(res => {
        console.log("发布成功", res.data)
        this.setData({
          content: '',
          currentWord:0
        })
        Toast.success("发布成功啦!")
      }).catch(err => {
        console.log("发布失败:", err)
      })
    } else {
      Toast.fail("请输入内容!")
    }
  },
  sendHelp() {
    if (this.data.ImageTemp.length > 0 || this.data.currentWord > 0) {
      var imagename = []
      var imageurl = []
      if (this.data.ImageTemp.length > 0) {
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          imagename.push(getApp().globalData.user_openid + '-' + getApp().uuid())
        }
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          this.uploadImage('HelpImage/', imagename[i], i)
        }
        for (var i = 0; i < imagename.length; i++) {
          imageurl.push(this.data.envcc + 'HelpImage/' + imagename[i] + '.png')
        }
      }
      wx.cloud.database().collection('jxHelp').add({
        data: {
          ChatMessage: [],
          CommentImage: imageurl,
          DiscussMessage: this.data.content,
          LookNum: 0,
          AnswerNum: 0,
          openid: getApp().globalData.user_openid,
          sendCurrentTime: wx.cloud.database().serverDate(),
          sendTime: this.getNowDate(),
          userInfo: {
            userImage: getApp().globalData.userInfo.userimage,
            userName: getApp().globalData.userInfo.username,
            userSex: getApp().globalData.userInfo.sex,
          }
        }
      }).then(res => {
        console.log("发布成功", res.data)
        this.setData({
          content: '',
          currentWord:0
        })
        Toast.success("发布成功啦!")
      }).catch(err => {
        console.log("发布失败:", err)
      })
    } else {
      Toast.fail("请输入内容!")
    }
  },
  sendSale() {
    if (this.data.ImageTemp.length > 0 || this.data.currentWord > 0) {
      var imagename = []
      var imageurl = []
      if (this.data.ImageTemp.length > 0) {
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          imagename.push(getApp().globalData.user_openid + '-' + getApp().uuid())
        }
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          this.uploadImage('SaleImage/', imagename[i], i)
        }
        for (var i = 0; i < imagename.length; i++) {
          imageurl.push(this.data.envcc + 'SaleImage/' + imagename[i] + '.png')
        }
      }
      wx.cloud.database().collection('jxSale').add({
        data: {
          // ChatMessage:[],
          GoodsImage: imageurl,
          SaleMessage: this.data.content,
          openid: getApp().globalData.user_openid,
          CurrentTime: wx.cloud.database().serverDate(),
          sendTime: this.getNowDate(),
          userInfo: {
            userImage: getApp().globalData.userInfo.userimage,
            userName: getApp().globalData.userInfo.username,
            userSex: getApp().globalData.userInfo.sex,
          }
        }
      }).then(res => {
        console.log("发布成功", res.data)
        this.setData({
          content: '',
          currentWord:0
        })
        Toast.success("发布成功啦!")
      }).catch(err => {
        console.log("发布失败:", err)
      })
    } else {
      Toast.fail("请输入内容!")
    }
  },
  sendReturn() {
    if (this.data.ImageTemp.length > 0 || this.data.currentWord > 0) {
      var imagename = []
      var imageurl = []
      if (this.data.ImageTemp.length > 0) {
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          imagename.push(getApp().globalData.user_openid + '-' + getApp().uuid())
        }
        for (var i = 0; i < this.data.ImageTemp.length; i++) {
          this.uploadImage('ReturnImage/', imagename[i], i)
        }
        for (var i = 0; i < imagename.length; i++) {
          imageurl.push(this.data.envcc + 'ReturnImage/' + imagename[i] + '.png')
        }
      }
      wx.cloud.database().collection('jxReturn').add({
        data: {
          // ChatMessage:[],
          GoodsImage: imageurl,
          recordOther: this.data.returnMessage.describe,
          recordContact: this.data.returnMessage.contract,
          recordPlace: this.data.returnMessage.place,
          recordTime: this.data.returnMessage.sendtime,
          LorR: this.data.returnMessage.LorR,
          openid: getApp().globalData.user_openid,
          sendCurrentTime: wx.cloud.database().serverDate(),
          sendTime: this.getNowDate(),
          userInfo: {
            userImage: getApp().globalData.userInfo.userimage,
            userName: getApp().globalData.userInfo.username,
            userSex: getApp().globalData.userInfo.sex,
          }
        }
      }).then(res => {
        console.log("发布成功", res.data)
        this.setData({
          content: '',
          currentWord:0
        })
        Toast.success("发布成功啦!")
      }).catch(err => {
        console.log("发布失败:", err)
      })
    } else {
      Toast.fail("请输入内容!")
    }
  },
  uploadImage(db, name, i) {
    wx.cloud.uploadFile({
      cloudPath: db + name + '.png',
      filePath: this.data.ImageTemp[i].url,
    }).then(res => {
      console.log('res:', res.fileID)
    }).catch(e => {
      console.log('e:', e)
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
})