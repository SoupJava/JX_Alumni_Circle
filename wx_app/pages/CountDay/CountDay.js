// pages/CountDay/CountDay.js
import Dialog from '@vant/weapp/dialog/dialog';
const SUBSCRIBE_ID = 'aDfV-lUvRza06jtvowrU5Z5dUyBxO-HGOaGlZlmn0Y4'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showplan: false,
    seltime: false,
    txtime:0,
    datetime: {
      minHour: 0,
      maxHour: 23,
      minDate: new Date(1999, 10, 1).getTime(),
      maxDate: new Date(2099, 10, 1).getTime(),
      currentDate: '',
      showDate: '',
    },
    message: [],
    planmessage: {
      img: '',
      pMessage: '',
      pTime: '',
      uuid: ''
    }
  },
  add(e) {
    this.setData({
      showplan: true
    })
  },
  closeAdd(e) {
    this.setData({
      showplan: false
    })
  },
  
courseSubscribe(e) {
    // 获取课程相关信息
    let coueseInfo = {
        thing4: {
          value: this.data.planmessage.pMessage
        },
        time5: {
          value: this.data.planmessage.pTime
        },
        thing2: {
          value: "不要忘记了┗|｀O′|┛ 嗷~~"
        }
      }
      var that=this
    wx.requestSubscribeMessage({
      tmplIds: [SUBSCRIBE_ID],
      success(res) {
        if (res[SUBSCRIBE_ID] === 'accept') {
          // 调用云函数subscribe
          wx.cloud
            .callFunction({
              name: 'addCountDay',
              data: {
                data: coueseInfo,
                templateId: SUBSCRIBE_ID,
                sendtime:that.data.txtime,
              },
            })
            .then(() => {
              wx.showToast({
                title: '订阅成功，我们将在倒数日前一天提醒您',
                icon: 'success'
              });
            })
            .catch((e) => {
              console.log(e)
            });
        }
      },
    });
  },
  addok(e) {
    this.courseSubscribe()
    if (this.data.planmessage.pMessage || this.data.planmessage.pTime || this.data.planmessage.img != '') {
      const db = wx.cloud.database()
      const _ = db.command
      if (this.data.message.length < 20) {
        this.data.planmessage.uuid = getApp().uuid()
        db.collection('jxCountDay').where({
          openid: getApp().globalData.user_openid
        }).update({
          data: {
            pList: _.push(this.data.planmessage)
          }
        }).then(res => {
          console.log("更新成功")
          this.getPlanTable()
          this.closeAdd()
        })
      } else {
        Toast.fail('别太累了宝子');
      }
    } else {
      // this.UpdatePlanTable()
    }
  },
  getPlanTable() {
    wx.cloud.database().collection('jxCountDay')
      .where({
        openid: getApp().globalData.user_openid
        // pList:{
        //   door:wx.cloud.database().command.eq("0")
        // }
      }).get()
      .then(res => {
        console.log("查询成功:", res.data[0])
        for (var i = 0; i < res.data[0].pList.length; i++) {
          res.data[0].pList[i].day = this.dateDiff(res.data[0].pList[i].pTime)
        }
        res.data[0].pList.sort(this.compare());
        this.setData({
          message: res.data[0].pList
        })
      })
      .catch(err => {
        console.log("查询失败:", err)
      })
  },
  compare(pro = 'day', order = 'asc') {
    return function (obj1, obj2) {
      let val1 = obj1[pro];
      let val2 = obj2[pro];
      if (order === 'desc') {
        val1 = obj2[pro];
        val2 = obj1[pro];
      }
      if (val2 < val1) { //正序
        return 1;
      } else if (val2 > val1) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  inputChange(e) {
    this.setData({
      ['planmessage.pMessage']: e.detail.value
    });
  },
  selectImg(e) {
    this.setData({
      ['planmessage.img']: e.currentTarget.dataset.img
    })
  },
  showseltime() {
    this.setData({
      seltime: true,
      ['datetime.currentDate']: new Date().getTime(),
    })
  },
  closeseltime() {
    this.setData({
      seltime: false
    })
  },
  changeplantime(e) {
    console.log(e.detail)
    this.setData({
      txtime:e.detail-86400000
    })
    var oDate = new Date(e.detail),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay);
    this.setData({
      ['datetime.currentDate']: e.detail,
      ['datetime.showDate']: oTime,
    });
  },
  getBz(num) { //补零
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  confirmtime() {
    this.setData({
      ['planmessage.pTime']: this.data.datetime.showDate,
    })
    this.closeseltime()
  },
  cancelseltime() {
    this.closeseltime()
  },
  changeplan(e) {
    this.setData({
      showplan: true,
      planmessage: e.currentTarget.dataset.it
    })
  },
  deleteM(e) {
    console.log(e.currentTarget.dataset.id)
    Dialog.confirm({
      title: '删除',
      message: '是否要确认删除？',
    }).then(() => {
      const db = wx.cloud.database()
      const _ = db.command
      console.log(123)
      wx.cloud.database().collection('jxCountDay').where({
          openid: getApp().globalData.user_openid
        })
        .update({
          data: {
            pList: _.pull({
              uuid: _.eq(e.currentTarget.dataset.id),
            })
          }
        }).then(res => {
          console.log('成功', res)
          this.getPlanTable()
        }).catch(err => {
          console.log(err)
        })
    }).catch(() => {
      // on cancel
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPlanTable()
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
  dateDiff(sDate2) {
    var sDate1 = this.formatDate(new Date());
    var startDate = Date.parse(sDate1);
    var endDate = Date.parse(sDate2);
    if (startDate > endDate) {
      return 0;
    }
    if (startDate == endDate) {
      return 1;
    }
    var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return parseInt(days);
  },
  formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
})