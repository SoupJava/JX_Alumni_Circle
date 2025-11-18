// pages/userinfo/userinfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userinfo:'',
      jxCommentNum:0,
      jxHelpNum:0,
      jxSaleNum:0,
      jxReturnNum:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      console.log('id', options.id)
      wx.cloud.database().collection('jxuser').where({
        openid:options.id
      }).get().then(res=>{
        console.log("查询成功:", res.data)
        this.setData({
          userinfo:res.data[0]
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: res.data[0].theme.color
        });
      }).catch(err=>{
        console.log("查询失败:", err)
      })
      wx.cloud.database().collection('jxComment').where({
        openid:options.id
      }).count().then(res=>{
        this.setData({
          jxCommentNum:res.total
        })
      })
      wx.cloud.database().collection('jxHelp').where({
        openid:options.id
      }).count().then(res=>{
        this.setData({
          jxHelpNum:res.total
        })
      })
      wx.cloud.database().collection('jxSale').where({
        openid:options.id
      }).count().then(res=>{
        this.setData({
          jxSaleNum:res.total
        })
      })
      wx.cloud.database().collection('jxReturn').where({
        openid:options.id
      }).count().then(res=>{
        this.setData({
          jxReturnNum:res.total
        })
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