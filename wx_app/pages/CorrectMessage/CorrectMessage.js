// pages/CorrectMessage/CorrectMessage.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImage: [],
    username: '',
    jxid: '',
    password: '',
    againpassword: '',
    telephone: '',
    sex: '',
    school:'',
  },
  getLocalUrl(e) {
    console.log(e.detail)
    this.setData({
      userImage: [{
        url: e.detail.file.tempFilePath,
        name: '头像',
      }]
    })
  },
  loginback() {
    wx.navigateTo({
      url: '/pages/mySet/mySet'
    })
  },
  keep() {
    if (this.data.sex == "" || this.data.password == "" || this.data.username == "" || this.data.jxid == "" || this.data.telephone == "" || this.data.userImage == "")
      Toast.fail('请填写完整')
    else if ('1'+this.data.userImage[0].url.substring(0, 5) == "cloud")
    {
      console.log(this.data.userImage[0].url.substring(0, 5))
      this.keepMessage(this.data.userImage[0].url)
    }
    else{
      console.log('2'+this.data.userImage[0].url.substring(0, 5))
      this.uploadImage()
    }
  },
  uploadImage() {
    wx.cloud.uploadFile({
      cloudPath: 'userImage/' + getApp().globalData.userInfo.openid + '.png',
      filePath: this.data.userImage[0].url,
    }).then(res => {
      console.log('res:', res.fileID)
      this.keepMessage(res.fileID)
    }).catch(e => {
      console.log('e:', e)
    })
  },
  keepMessage(userImgUrl) {
    wx.cloud.database().collection('jxuser').where({
      openid: getApp().globalData.user_openid,
    }).update({
      data: {
        password: this.data.password,
        sex: this.data.sex,
        telephone: this.data.telephone,
        username: this.data.username,
        userimage: userImgUrl,
        school:this.data.school
      }
    }).then(res => {
      console.log("修改成功", res.data)
      getApp().onLaunch()
      // this.loginback()
      Toast.success('保存成功')
    }).catch(err => {
      console.log("err:", err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userImage: [{
        url: getApp().globalData.userInfo.userimage,
        name: '头像',
      }],
      username: getApp().globalData.userInfo.username,
      jxid: getApp().globalData.userInfo.jxid,
      password: getApp().globalData.userInfo.password,
      againpassword: getApp().globalData.userInfo.password,
      telephone: getApp().globalData.userInfo.telephone,
      sex: getApp().globalData.userInfo.sex,
      school:getApp().globalData.userInfo.school
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
    // this.setData({
    //   userImage: [{
    //     url: getApp().globalData.userInfo.userimage,
    //     name: '头像',
    //   }],
    //   username: getApp().globalData.userInfo.username,
    //   jxid: getApp().globalData.userInfo.jxid,
    //   password: getApp().globalData.userInfo.password,
    //   againpassword: getApp().globalData.userInfo.password,
    //   telephone: getApp().globalData.userInfo.telephone,
    //   sex: getApp().globalData.userInfo.sex,
    // })
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
  ChangeSex(e) {
    this.setData({
      sex: e.detail,
    })
  },
  afterRead(event) {
    const {
      file
    } = event.detail;
    var userImg = [{
      url: '',
      name: '头像'
    }]
    console.log(file.url)
    userImg[0].url = file.url
    this.setData({
      userImage: userImg
    });
  },
  deleteImg() {
    this.setData({
      userImage:[]
    })
  },
})