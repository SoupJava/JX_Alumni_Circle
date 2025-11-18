// pages/message/message.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:'comment',
        messageList:[],
        userinfo:'',
    },
    onChange(event) {
        this.setData({ active: event.detail });
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setData({
        userinfo:getApp().globalData.userInfo
      })
      let watcher=wx.cloud.database().collection('jxChatList').where({
        $or:[
          {openid:getApp().globalData.userInfo.openid,openid2:options.openid},
          {openid:options.openid,openid2:getApp().globalData.userInfo.openid}
        ]
      // }).orderBy('CurrentTime', 'desc').get()
      //   .then(res => {
      //     console.log("查询成功:", res.data)
      //     this.setData({
      //       messageList: res.data
      //     })
      //   }).catch(err => {
      //     console.log("查询失败:", err)
      //   })
        }).orderBy('CurrentTime', 'desc').watch({
        onChange: (snapshot) => { //只要数据发生变化就会调用此方法
          this.setData({
            messageList: snapshot.docs,
          })
          console.log(snapshot)
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    },
    chatWith(e){
      wx.navigateTo({
        url: '/pages/ChatPage/ChatPage?openid='+e.currentTarget.dataset.id,
      })
    },
    chatWithAI(e){
      wx.navigateTo({
        url: '/pages/ChatAI/ChatAI?id='+e.currentTarget.dataset.id,
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
      if (this.watcher) {
        this.watcher.close()
      }
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