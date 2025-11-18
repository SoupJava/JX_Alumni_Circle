// pages/note/note.js
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showaddnote:false,
    addnote:{
      noteTitle:'',
      noteTime:'',
      notemessage:''
    },
    Note: []
  },
  addmessage(e){
    this.setData({
      showaddnote:true
    })
  },
  closeSelClass(e){
    this.setData({
      showaddnote:false
    })
  },
  inputChange(e) {
    this.setData({
      ['addnote.noteTitle']: e.detail.value
    });
  },
  addok(e){
    var oDate=new Date(new Date().getTime()),
     oYear = oDate.getFullYear(),
     oMonth = oDate.getMonth() + 1,
     oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay) + ' ' + this.getBz(oHour) + ':' + this.getBz(oMin) + ':' + this.getBz(oSen);
    this.setData({
      ['addnote.noteTime']: oTime
    })
    wx.cloud.database().collection('jxnote').add({
      data:{
        openid:getApp().globalData.user_openid,
        noteTitle:this.data.addnote.noteTitle,
        noteTime:this.data.addnote.noteTime,
        notemessage:''
      }
    }).then(res=>{
      this.selectnote()
    }).catch(err=>{
      console.log(err)
    })
    this.setData({
      ['addnote.noteTitle']:'',
      showaddnote:false
    })
  },
  getBz(num) { //补零
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  deleteplan(e){
    Dialog.confirm({
      title: '删除',
      message: '是否要确认删除？',
    }).then(() => {
      wx.cloud.database().collection('jxnote')
      .doc(e.currentTarget.dataset.it._id)
      .remove()
      .then(res=>{
        console.log('删除成功',res.data)
        this.selectnote()
      })
      .catch(err=>{
        console.log("删除失败")
      })
    })
    .catch((e)=>{

    })
  },
  GoKeep(e){
    wx.navigateTo({
      url: '/pages/noteKeep/noteKeep?id='+e.currentTarget.dataset.it._id,
    })
  },
  selectnote(e){
    wx.cloud.database().collection('jxnote').where({
      openid: getApp().globalData.user_openid
    }).get()
    .then(res=>{
      console.log("查询成功:", res.data)
      res.data=res.data.sort(this.comparetime('noteTime'))
      this.setData({
        Note:res.data
      })
    })
    .catch(err => {
      console.log("查询失败:", err)
    })
  },
  comparetime(prop) {
    return function (a, b) {
      var Date1 = a[prop];
      Date1 = Date1.replace(/-/g, "/");
      var Date2 = b[prop];
      Date2 = Date2.replace(/-/g, "/");
      return new Date(Date2).getTime() - new Date(Date1).getTime() // 升序
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.selectnote()
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