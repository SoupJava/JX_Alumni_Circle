// pages/ChatPage/ChatPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    toview: 'item',
    userinfo: '',
    userinfo2: '',
    chatMessage: [],
    content: '',
    contenttemp: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */

  sendComment() {
    if (this.data.content.length != 0) {
      var message = {
        Userid: this.data.userinfo.jxid,
        UserName: this.data.userinfo.username,
        UserImage: this.data.userinfo.userimage,
        Message: this.data.content
      }
      var messageTemp = this.data.chatMessage
      messageTemp.push(message)
      this.setData({
        chatMessage: messageTemp,
        toview: `item${this.data.chatMessage.length-1}`,
        contenttemp: this.data.content
      })
      this.sendmessage()
      this.setData({
        content: ''
      })
    }
  },
  sendmessage() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('jxChat').add({
      data: {
        openid1: this.data.userinfo.openid,
        openid2: this.data.userinfo2.openid,
        message: this.data.contenttemp,
        currentTime: wx.cloud.database().serverDate(),
        sendTime: this.getNowDate(),
      },
      success: (res) => {
        console.log('success:', res)
      },
      fail: (err) => {
        console.log('fail:', err)
      }
    })
    if (this.data.chatMessage.length > 1) {
      db.collection('jxChatList')
        .where({
          $or: [{
              openid: getApp().globalData.userInfo.openid,
              openid2: this.data.userinfo2.openid
            },
            {
              openid: this.data.userinfo2.openid,
              openid2: getApp().globalData.userInfo.openid
            }
          ]
        })
        .update({
          data: {
            openid: getApp().globalData.userInfo.openid,
            openid2: this.data.userinfo2.openid,
            CurrentTime: wx.cloud.database().serverDate(),
            LastSendTime: this.getNowDate(),
            lastMessage: this.data.contenttemp,
            userImage: getApp().globalData.userInfo.userimage,
            userImage2: this.data.userinfo2.userimage,
            userName: getApp().globalData.userInfo.username,
            userName2: this.data.userinfo2.username,
          }
        }).then(res => {
          console.log("更新成功")
        })
    } else {
      db.collection('jxChatList').add({
        data: {
          openid: getApp().globalData.userInfo.openid,
          openid2: this.data.userinfo2.openid,
          CurrentTime: wx.cloud.database().serverDate(),
          LastSendTime: this.getNowDate(),
          lastMessage: this.data.contenttemp,
          userImage: getApp().globalData.userInfo.userimage,
          userImage2: this.data.userinfo2.userimage,
          userName: getApp().globalData.userInfo.username,
          userName2: this.data.userinfo2.username,
        },
        success: (res) => {
          console.log('success:', res)
        },
        fail: (err) => {
          console.log('fail:', err)
        }
      })
    }
  },
  LookUser(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/userinfo/userinfo?id=' + id,
    })
  },
  onLoad(options) {
    console.log('id', options.openid)
    const db = wx.cloud.database()
    const _ = db.command
    let watcher = db.collection('jxChat')
      .where({
        $or: [{
            openid1: getApp().globalData.userInfo.openid,
            openid2: options.openid
          },
          {
            openid1: options.openid,
            openid2: getApp().globalData.userInfo.openid
          }
        ]
      })
      .orderBy('currentTime', 'asc')
      .watch({
        onChange: (snapshot) => { //只要数据发生变化就会调用此方法
          this.setData({
            chatMessage: snapshot.docs,
            toview: `item${snapshot.docs.length-1}`,
          })
          console.log(snapshot)
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    wx.cloud.database().collection('jxuser').where({
      openid: options.openid
    }).get().then(res => {
      console.log("查询成功:", res.data)
      this.setData({
        userinfo2: res.data[0]
      })
      wx.setNavigationBarTitle({
        title: res.data[0].username,
      })
    }).catch(err => {
      console.log("查询失败:", err)
    })
    this.setData({
      userinfo: getApp().globalData.userInfo
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: this.data.userinfo.theme.color
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.getSystemInfo({
      success: (
        windowHeight
      ) => {
        // todo
        this.setData({
          height: windowHeight.windowHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      userinfo: getApp().globalData.userInfo
    })
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

  },
  getNowDate() {
    var oDate = new Date(),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay) + ' ' + this.getBz(oHour) + ':' + this.getBz(oMin) + ':' + this.getBz(oSen);
    return oTime
  },
  getBz(num) { //补零
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
})