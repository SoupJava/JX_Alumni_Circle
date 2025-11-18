// pages/noteKeep/noteKeep.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id:'',
    message:'',
    userinfo:'',
    Note:{}
  },
  takePhoto(){	
    wx.navigateTo({
      url: '/pages/photo/photo?message='+this.data.message,	//跳转到自定义的一个拍照页面
    })
  },
  keepnote(e){
    this.setData({
      ['Note.notemessage']:this.data.message
    })
    wx.cloud.database().collection('jxnote').doc(this.data.note_id)
    .update({
      data:{
        notemessage:this.data.Note.notemessage
      }
    }).then(res=>{
      console.log("保存成功",res)
      Toast.success('保存成功');
    }).catch(err=>{
      console.log("保存失败",err)
      Toast.fail('保存失败');
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    this.setData({
      userinfo:getApp().globalData.userInfo,
      note_id:options.id
    })
    wx.cloud.database().collection('jxnote').doc(options.id)
    .get()
    .then(res=>{
      this.setData({
        Note:res.data,
        message:res.data.notemessage
      })
    }) .catch(err => {
      console.log("查询失败:", err)
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