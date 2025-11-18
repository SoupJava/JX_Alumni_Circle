// pages/SaleInfo/SaleInfo.js
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SaleDetail: '',
    myuserinfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      myuserinfo: getApp().globalData.userInfo
    })
    var commentid = options.id
    wx.cloud.database().collection('jxSale').where({
      _id: commentid
    }).get().then(res => {
      console.log("查询成功:", res.data)
      this.setData({
        SaleDetail: res.data[0]
      })
    })
  },
  LookUser(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
    })
  },
  LookPhoto(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: this.data.SaleDetail.GoodsImage
    })
  },
  dm() {
    Dialog.confirm({
      message: '删除后无法找回，确认删除?',
    })
      .then(() => {
        var imageurl = this.data.SaleDetail.GoodsImage
        wx.cloud.database().collection('jxSale').doc(this.data.SaleDetail._id)
          .remove()
          .then(res => {
            console.log("删除成功:", res)
            wx.cloud.deleteFile({
              fileList: imageurl,
            }).then(res => {
              console.log("图片删除成功", res)
            }).catch(e => {
              console.log('e:', e)
            })
          })
        wx.navigateBack()
      })
      .catch(() => {

      });
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