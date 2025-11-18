// pages/InClassCollection/InClassCollection.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      jxCollection:'',
      DoneCollection:'',
      UnDoneCollection:''
    },
    addmessage(e){
      wx.navigateTo({
        url: '/pages/CreateCollectionTask/CreateCollectionTask',
      })
    },
    GoCollection(e){
      console.log(e)
      wx.navigateTo({
        url: '/pages/CollectionTask/CollectionTask?id='+e.currentTarget.dataset.id,
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      console.log(getApp().globalData.userInfo.jxclass)
      wx.cloud.database().collection('jxclass').doc(getApp().globalData.userInfo.jxclass)
      .get()
      .then(res=>{
        console.log("查询成功:", res.data)
        this.setData({
          class:res.data
        })
      }).catch(err=>{
        console.log(err)
      })
      wx.cloud.database().collection('jxCollection').where({
        jxclass:getApp().globalData.userInfo.jxclass
      })
      .get()
      .then(res=>{
        console.log(res.data)
        this.setData({
          jxCollection:res.data
        })
        var Done=[]
        var UnDone=[]
        for(var i=0;i<this.data.jxCollection.length;i++){
          var control=false
          for(var j=0;j<this.data.jxCollection[i].SubmitStudent.length;j++){
            if(getApp().globalData.user_openid==this.data.jxCollection[i].SubmitStudent[j].openid){
              control=true
              break;
            }
          }
          if(control){
            Done.push(this.data.jxCollection[i])
            console.log(this.data.jxCollection[i])
          }else{
            console.log(this.data.jxCollection[i])
            UnDone.push(this.data.jxCollection[i])
          }
        }
        this.setData({
          DoneCollection:Done,
          UnDoneCollection:UnDone
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
      this.onLoad()
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