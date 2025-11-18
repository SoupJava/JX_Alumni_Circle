// pages/regist/regist.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    jxid: '',
    password: '',
    againpassword: '',
    telephone: '', 
    sex:'',
    school:''
  },
  loginback(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  regist() {
    if (this.data.password == this.data.againpassword) {
      if(this.data.sex==""||this.data.password==""||this.data.username==""||this.data.jxid==""||this.data.telephone==""){
        Toast.fail('请填写完整')
      }else{
        wx.cloud.database().collection('jxuser')
        .where({
          openid: getApp().globalData.user_openid,
        }).get()
        .then(res => {
          console.log("查询成功:", res.data)
          getApp().globalData.userInfo = res.data[0]
          if (res.data.length === 0) {
            wx.cloud.database().collection('jxuser').add({
              data: {
                jxid: this.data.jxid,
                openid: getApp().globalData.user_openid,
                password: this.data.password,
                telephone: this.data.telephone,
                username: this.data.username,
                school:this.data.school,
                userimage:'cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/userImage/'+getApp().globalData.user_openid+'.jpg',
                sex:this.data.sex,
                theme:{
                  color:'#FC9F9D',
                  emoji:0
                },
                token_time:{
                  begintime:'',
                  endtime:'',
                  token:'',
                },
                unionid_temp:'',
                jxclass:'',
                tree:{
                  num:0,
                  thirsty_time:Date.parse(new Date())
                }
              }
            }).then(res => {
              console.log("注册成功", res.data)
              this.createusers()
              this.createtable()
              this.createjxtomato()
            })
          } else {
            getApp().onLaunch()
            this.loginback()
          }
        })
        .catch(err => {
          console.log("查询失败:", err)
        })
      }
    } else {
      Toast.fail('密码不一致')
    }

  },
  ChangeSex(e){
    this.setData({
      sex:e.detail,
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
  createjxtomato(){
    wx.cloud.database().collection('jxtomato').add({
      data:{
        openid: getApp().globalData.user_openid,
        jxid:this.data.jxid,
        task:[]
      }
    }).then(res=>{
      console.log("注册成功", res.data)
    })
  },
  createusers(){
    wx.cloud.database().collection('users').add({
      data:{
        openid: getApp().globalData.user_openid,
        houseId:'',
        roomId:'',
        telephone:'',
        address:''
      }
    }).then(res=>{
      console.log("注册成功", res.data)
    })
  },
  createtable() { //添加其他表数据
    wx.cloud.database().collection('jxClassTable').add({
      data: {
        openid: getApp().globalData.user_openid,
        wList: [],
        course_time: [
          ["10:00", ""],
          ["", "11:30"],
          ["12:10", ""],
          ["", "13:40"],
          ["15:30", ""],
          ["", "17:00"],
          ["17:30", ""],
          ["", "18:10"],
          ["20:00", ""],
          ["", "21:30"]
        ]
      }
    }).then(res => {
      wx.cloud.database().collection('jxPlanTable').add({
        data: {
          openid: getApp().globalData.user_openid,
          pList: [],
        }
      }).then(res => {
        console.log('创建成功')
        getApp().onLaunch()
        this.loginback()
      })
    })
  }
})