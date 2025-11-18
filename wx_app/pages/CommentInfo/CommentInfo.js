// pages/CommentInfo/CommentInfo.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CommentDetail: '',
    answer: '',
    _id: '',
    LoveIndex: '',
    userInfo: '',
    active: false,
    actuser: '',
    selindex: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      _id: options.id
    })
    this.getMessage()
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
      urls: this.data.CommentDetail.CommentImage
    })
  },
  ChangeLike() {
    const db = wx.cloud.database()
    const _ = db.command
    if (this.data.LoveIndex == -1) {
      db.collection('jxComment').doc(this.data._id).update({
        data: {
          LoveID: _.push({
            each: [this.data.userInfo.openid]
          }),
          LoveNum: _.inc(1)
        }
      }).then(res => {
        console.log(res)
        this.getMessage()
      })
    } else {
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('jxComment').doc(this.data._id).update({
        data: {
          LoveID: _.pull(this.data.userInfo.openid),
          LoveNum: _.inc(-1)
        }
      }).then(res => {
        console.log(res)
        this.getMessage()
      })
    }
  },
  ChangeOwner() {
    this.setData({
      active: false
    })
  },
  ChangeChater(e) {
    this.setData({
      actuser: e.currentTarget.dataset.u,
      selindex: e.currentTarget.dataset.i,
      active: true
    })
  },
  sendComment() {
    if (this.data.answer.length <= 0) {
      Toast.fail('请输入答复')
    } else {
      if (this.data.active) {
        this.CommentChater()
      } else {
        this.CommentOwner()
      }
    }
  },
  CommentOwner() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('jxComment').doc(this.data._id).update({
      data: {
        ChatMessage: _.push({
          each: [{
            ChatUserInfo: {
              userImage: this.data.userInfo.userimage,
              userName: this.data.userInfo.username,
              userOpenId: this.data.userInfo.openid,
            },
            ChildComment: [],
            Message: this.data.answer,
            CurrentTime: wx.cloud.database().serverDate(),
            SendTime: this.getNowDate(),
          }],
          sort: {
            SendTime: -1
          }
        }),
        ChatNum: _.inc(1)
      }
    }).then(res => {
      console.log("更新成功")
      this.getMessage()
      this.setData({
        answer: ''
      })
    }).catch(err => {
      console.log(err)
    })
  },
  CommentChater() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('jxComment').doc(this.data._id).update({
      data: {
        ['ChatMessage.' + [this.data.selindex] + '.ChildComment']: _.push({
          each: [{
            sendUserInfo: {
              userImage: this.data.userInfo.userimage,
              userName: this.data.userInfo.username,
              userOpenId: this.data.userInfo.openid,
            },
            receiveUserInfo: {
              userImage: this.data.actuser.userImage,
              userName: this.data.actuser.userName,
              userOpenId: this.data.actuser.userOpenId,
            },
            Message: this.data.answer,
            CurrentTime: wx.cloud.database().serverDate(),
            SendTime: this.getNowDate(),
          }],
          sort: {
            ['ChatMessage.SendTime']: -1
          }
        }),
        ChatNum: _.inc(1)
      }
    }).then(res => {
      console.log("更新成功")
      this.getMessage()
    }).catch(err => {
      console.log(err)
    })
  },
  dm() {
    Dialog.confirm({
        message: '删除后无法找回，确认删除?',
      })
      .then(() => {
        var imageurl = this.data.CommentDetail.CommentImage
        wx.cloud.database().collection('jxComment').doc(this.data.CommentDetail._id)
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
  getMessage() {
    wx.cloud.database().collection('jxComment').where({
      _id: this.data._id
    }).get().then(res => {
      console.log("查询成功:", res.data)
      this.setData({
        CommentDetail: res.data[0],
        userInfo: getApp().globalData.userInfo
      })
      if (res.data[0].LoveID.indexOf(this.data.userInfo.openid) === -1) {
        this.setData({
          LoveIndex: -1
        })
      } else {
        this.setData({
          LoveIndex: res.data[0].LoveID.indexOf(this.data.userInfo.openid)
        })
      }
    })
  },
})