// pages/ClassMessage/ClassMessage.js
import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      haveClass:false,
      show:false,
      AreYouOK:false,
      active: 0,
      class:'',
      classidForJ:'',
      classkeyForJ:'',
      nameForJ:'',
      classname:'',
      classkey:'',
      nameForC:''
    },
    OKShow(){
      this.setData({ AreYouOK: true });
    },
    OKHide(){
      this.setData({ AreYouOK: false });
    },
    onClickShow() {
      this.setData({ show: true });
    },
  
    onClickHide() {
      this.setData({ show: false });
    },
    addmessage(e){
      this.setData({
        control:true
      })
    },
    LookUser(e){
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/userinfo/userinfo?id=' + id,
      })
    },
    deleteClass(e){
      const db = wx.cloud.database()
      const _ = db.command
      if(this.data.class.creater_openid==getApp().globalData.user_openid){
        wx.cloud.database().collection('jxclass').doc(getApp().globalData.userInfo.jxclass)
        .remove()
        .then(res=>{
          wx.navigateBack()
        }).catch(err=>{
          console.log(err)
        })
      }else{
        wx.cloud.database().collection('jxclass').doc(getApp().globalData.userInfo.jxclass)
        .update({
          data: {
            student: _.pull({
              openid: _.eq(this.data.class.creater_openid),
            })
          }
        }).then(res=>{
          console.log('成功',res)
          wx.navigateBack()
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    createClass(e){
      wx.cloud.database().collection('jxclass').add({
        data:{
          classname:this.data.classname,
          classkey:this.data.classkey,
          creater_openid:getApp().globalData.user_openid,
          student:[
            {
              name:this.data.nameForC,
              openid:getApp().globalData.user_openid
            }
          ]
        }
      })
      .then(res=>{
        console.log("创建成功",res)
        wx.cloud.database().collection('jxuser').where({
          openid:getApp().globalData.user_openid,
        }).update({
          data:{
            jxclass:res._id
          }
        }).then(r=>{
          getApp().globalData.userInfo.jxclass=res._id
          this.onLoad()
          this.onClickHide()
        }).catch(e=>{
          console.log(e)
        })
      })
      .catch(err=>{
        console.log(err)
      })
    },
    joinClass(e){
      wx.cloud.database().collection('jxclass').doc(this.data.classidForJ)
      .get()
      .then(res=>{
        console.log(res)
        if(res.classkey==this.data.classkeyForJ){
          wx.cloud.database().collection('jxuser').where({
            openid:getApp().globalData.user_openid,
          }).update({
            data:{
              jxclass:this.data.classidForJ
            }
          }).then(r=>{
            console.log(r)
          }).catch(e=>{
            console.log(e)
          })
          wx.cloud.database().collection('jxclass').doc(this.data.classidForJ)
          .update({
            data:{
              student:_push({
                openid:getApp().globalData.user_openid,
                name:this.data.nameForJ
              })
            }
          }).then(r=>{
            console.log(r)
            this.onLoad()
            this.onClickHide()
          }).catch(e=>{
            console.log(e)
          })
        }else{
          Toast.fail('key值不对')
        }
      }).catch(e=>{
        Toast.fail('没有此班级')
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