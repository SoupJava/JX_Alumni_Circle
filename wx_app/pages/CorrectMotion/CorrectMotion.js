// pages/CorrectMotion/CorrectMotion.js
import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      height:'',
      age:'',
      weight:'',
      sex:''
    },
    ChangeSex(e) {
      this.setData({
        sex: e.detail,
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.cloud.database().collection('jxMotionUserMessage').where({
        openid:getApp().globalData.user_openid
      }).get()
      .then(res=>{
        this.setData({
          age:res.data[0].age,
          height:res.data[0].height,
          sex:(res.data[0].sex=='男'?0:1),
          weight:res.data[0].weight
        })
      }).catch(err=>{
        console.log(err)
      })
    },
    keep(){
      if (this.data.sex == "" || this.data.age == "" || this.data.height == "" || this.data.weight == "")
      {
        Toast.fail('请填写完整')
      }else{
        wx.cloud.database().collection('jxMotionUserMessage').where({
          openid: getApp().globalData.user_openid,
        }).update({
          data: {
          age:this.data.age,
          height:this.data.height,
          sex:(this.data.sex==0?'男':'女'),
          weight:this.data.weight
          }
        }).then(res => {
          console.log("修改成功", res.data)
          wx.navigateBack()
        }).catch(err => {
          console.log("err:", err)
        })
      }
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