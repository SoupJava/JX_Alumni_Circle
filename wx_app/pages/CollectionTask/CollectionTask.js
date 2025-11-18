// pages/CollectionTask/CollectionTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ThisClass:'',
    ThisCollection: '',
    DoneCollection: '',
    UnDoneCollection: ''
  },
  LookUser(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
    })
  },
  sendComment(e){
    wx.navigateTo({
      url: '/pages/SubmitCollection/SubmitCollection?classid='+this.data.ThisCollection._id,
    })
  },
  down(e){
    wx.setClipboardData({
      data: "http://192.168.130.48:8000/jxxyq/getzip",
      success(res2) {
        wx.getClipboardData({
          success(res2) {
            // Toast.success("下载地址已粘贴到剪贴板，请在2分钟内浏览器访问下载~~~")
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    let that=this
    wx.cloud.database().collection('jxCollection').doc(options.id)
      .get()
      .then(res => {
        console.log(res.data)
        this.setData({
          ThisCollection: res.data
        })
        wx.cloud.database().collection('jxclass').doc(res.data.jxclass)
          .get()
          .then(r => {
            that.setData({
              ThisClass:r.data
            })
            var UnDone = []
            for (var j =0;j<this.data.ThisClass.student.length;j++) {
              var control=true
              for(var i = 0; i < this.data.ThisCollection.SubmitStudent.length; i++){
                if(this.data.ThisClass.student[j].openid==this.data.ThisCollection.SubmitStudent[i].openid){
                  control=false
                  break
                }
              }
              if(control){
                UnDone.push(this.data.ThisClass.student[j])
              }
            }
            that.setData({
              UnDoneCollection:UnDone,
              DoneCollection:this.data.ThisCollection.SubmitStudent
            })
          }).catch(e => {
            console.log(e)
          })
      })
      .catch(err => {
        console.log(err)
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