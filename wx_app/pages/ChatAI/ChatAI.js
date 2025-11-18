// pages/ChatAI/ChatAI.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    toview: 'item',
    userinfo: '',
    userinfo2: '',
    chatMessage: [{
      Userid: 1,
      UserName: "AI",
      UserImage: "https://statics.moonshot.cn/kimi-chat/static/01.0245bc9d.png",
      Message: "你好呀，有什么需要帮助的吗？"
    }],
    waitMessage: [],
    content: '',
    contenttemp: '',
    selectKey: 'eSdcpxgHp4jrCbNxOo3to7bZcldcsLZc',
    apiKey: 'uEdNHxIfPibhSnWCLhb3awRh',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getToken() {
    var message = {
      Userid: 1,
      UserName: "AI",
      UserImage: "https://statics.moonshot.cn/kimi-chat/static/01.0245bc9d.png",
      Message: "正在思考中，别着急哦~🤔"
    }
    var messageTemp = this.data.chatMessage
    var waitTemp = this.data.waitMessage
    messageTemp.push(message)
    waitTemp.push(messageTemp.length - 1)
    this.setData({
      chatMessage: messageTemp,
      waitMessage: waitTemp,
      toview: `item${this.data.chatMessage.length-1}`
    })
    var that = this
    const url_token = "https://aip.baidubce.com/oauth/2.0/token?client_id=" + this.data.apiKey + "&client_secret=" + this.data.selectKey + "&grant_type=client_credentials";
    wx.request({
      url: url_token,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      success: res => {
        const access_token = res.data.access_token
        const url_chat = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=" + access_token
        const payload = {
          "messages": [{
            "role": "user",
            "content": this.data.contenttemp
          }]
        };
        wx.request({
          url: url_chat,
          method: "POST",
          data: payload,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res.data);
            var message = {
              Userid: 1,
              UserName: "AI",
              UserImage: "https://statics.moonshot.cn/kimi-chat/static/01.0245bc9d.png",
              Message: res.data.result
            }
            var messageTemp = that.data.chatMessage
            var waitTemp = that.data.waitMessage
            messageTemp[waitTemp[0]] = message
            waitTemp.shift()
            that.setData({
              chatMessage: messageTemp,
              waitMessage: waitTemp
              // toview:`item${that.data.chatMessage.length-1}`
            })
          },
        });
      },
    });
  },
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
      this.getToken()
      this.setData({
        content: ''
      })
    }
  },
  onLoad(options) {
    console.log('id', options.id)
    // const db = wx.cloud.database()
    // const _ = db.command
    // let watch = db.collection('jxChat')
    //   .where({
    //     // openid1: _.eq(options.openid).or(_.eq(getApp().globalData.userInfo.openid)),
    //     // openid2: _.eq(getApp().globalData.userInfo.openid).or(_.eq(options.openid))
    //     openid1:options.openid,
    //     // openid2:options.openid
    //   })
    //   .watch({
    //     onChange: (snapshot) => { //只要数据发生变化就会调用此方法
    //       this.setData({
    //         chatMessage: snapshot.ChatMessage,
    //       })
    //       console.log(snapshot)
    //     },
    //     onError: function (err) {
    //       console.error('the watch closed because of error', err)
    //     }
    //   })
    wx.cloud.database().collection('jxuser').where({
      openid: options.id
    }).get().then(res => {
      console.log("查询成功:", res.data)
      this.setData({
        userinfo2: res.data[0]
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
    wx.setNavigationBarTitle({
      title: '智慧树',
    })
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