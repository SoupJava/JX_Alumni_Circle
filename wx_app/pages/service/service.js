// pages/service/service.js
import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowtype: '',
    userinfo: '',
    show: false,
    active: 'service',
    currentIndex: 0,
    imgList: [{
        img: "https://ts2.cn.mm.bing.net/th?id=OIP-C.udV8wpN7uadg6IcEXUhKawHaEV&w=326&h=191&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
      },
      {
        img: "https://ts2.cn.mm.bing.net/th?id=OIP-C.udV8wpN7uadg6IcEXUhKawHaEV&w=326&h=191&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
      },
      {
        img: "https://ts2.cn.mm.bing.net/th?id=OIP-C.udV8wpN7uadg6IcEXUhKawHaEV&w=326&h=191&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
      }
    ],
  },
  onControl(e) {
    this.setData({
      nowtype: e.currentTarget.dataset.id
    })
    console.log(e)
    if (this.data.show) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  changeSwiper(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  onChange(event) {
    this.setData({
      active: event.detail
    });
  },
  upload(e) {
    var nowtype=this.data.nowtype
    wx.chooseMessageFile({ //调用选择文件接口
      count: Number(1), //文件数量
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        console.log('选择', res); //这里log一下res的值
        console.log(tempFilePaths);
        console.log(tempFilePaths[0].name)
        var type = tempFilePaths[0].name.split(".").slice(-1)
        if (type[0] == nowtype) {
          tempFilePaths.forEach(i => {
            console.log(i);
            wx.uploadFile({ //调用上传文件接口
              url: "http://192.168.130.48:8000/jxxyq/FileConversion", //这个接口是后台给的
              filePath: i.path,
              name: 'file',
              method: "post",
              header: { //headers记住传Authorization也就是token值，不然会返回401未登录
                "content-type": "multipart/form-data",
                "Authorization": wx.getStorageSync("token")
              },
              success(res) {
                console.log(res.data);
                var url = res.data.substring(1, res.data.length - 1);
                //上传成功后的一些操作
                wx.hideLoading();
                if (res.statusCode == 200) {
                  wx.setClipboardData({
                    data: url,
                    success(res2) {
                      wx.getClipboardData({
                        success(res2) {
                          Toast.success("下载地址已粘贴到剪贴板，请在2分钟内浏览器访问下载~~~")
                        }
                      })
                    }
                  })
                } else {
                  that.setData({
                    // isshow: true,
                    message: "上传失败,稍后重试"
                  });
                  setTimeout(() => {
                    that.setData({
                      //isshow: false,
                      message: ""
                    });
                  }, 2500);
                }
              }
            })
          })
        }else{
          Toast.fail("请选择正确的文件类型")
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userinfo: getApp().globalData.userInfo
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