// pages/study/study.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const SUBSCRIBE_ID = 'q7n7UlthAQLnbgg4j6dmZK1c2PyuiwDUW1AxSkDbONo'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'study',
    additem: 0,
    activename: 'b',
    height: 0,
    dsweek: 1,
    selclass: '',
    showclass: false,
    showtime: false,
    timeindex: '',
    setstarttime: '',
    setendtime: '',
    mindate: '',
    maxdate: '',
    addclass: '',
    addclassname: '',
    addclassaddress: '',
    addclassteacher: '',
    addclassdays: '7',
    addclassjie: '1',
    addclassdsweek: '1',
    addclasscolor: '',
    kcbcolor: [
      "#AEEC34",
      "#FFC44F",
      "#85B0FD",
      "#FEA17C",
      "#FF9392",
      "#D48DF9",
      "#7FCFF8",
      "#85B8CF",
      "#90C652",
      "#D8AA5A",
      "#FC9F9D",
      "#0A9A84",
      "#61BC69",
      "#12AEF3",
      "#E29AAD"
    ],
    weekArray: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周', '第21周'],
    pageNum: 0, // 当前所在分类的索引
    todayDate: new Date().getTime(),
    todayDay: '', // 今日日期
    todayMonth: '', // 今日月份
    todayWeek: '', // 今日周
    day: '', // 日期
    month: '', // 月份
    monthNum: 1,
    week: ['日', '一', '二', '三', '四', '五', '六'], // 周日为起始日
    nowDay: [7, 1, 2, 3, 4, 5, 6], // 本周的七天日期
    // schoolTime: ['2022', '02', '28'], // 本学期开学时间
    nowWeek: 1, // 当前周
    course_time: '',
    wList: '',
    //Plan
    pList0: '',
    pList1: '',
    showplan: false,
    seltime: false,
    datetime: {
      minHour: 0,
      maxHour: 23,
      minDate: new Date(1999, 10, 1).getTime(),
      maxDate: new Date(2099, 10, 1).getTime(),
      currentDate: '',
      showDate: '',
    },
    planmessage: {
      uuid: '',
      pMessage: '',
      pTime: '',
      door: '0'
    },
    lxtime:new Date().getTime()
  },
  settime(e) {
    console.log(e)
    if (e.currentTarget.dataset.st === "") {
      if (e.currentTarget.dataset.in === 0) {
        var mind = "00:00"
        var maxd = this.data.course_time[e.currentTarget.dataset.in + 1][0]
      } else if (e.currentTarget.dataset.in === 9) {
        var mind = this.data.course_time[e.currentTarget.dataset.in - 1][0]
        var maxd = "23:59"
      } else {
        var mind = this.data.course_time[e.currentTarget.dataset.in - 1][0]
        var maxd = this.data.course_time[e.currentTarget.dataset.in + 1][0]
      }
      this.setData({
        showtime: true,
        timeindex: e.currentTarget.dataset.in,
        setstarttime: e.currentTarget.dataset.st,
        setendtime: e.currentTarget.dataset.en,
        mindate: mind,
        maxdate: maxd
      })
    } else {
      if (e.currentTarget.dataset.in === 0) {
        var mind = "00:00"
        var maxd = this.data.course_time[e.currentTarget.dataset.in + 1][1]
      } else if (e.currentTarget.dataset.in === 9) {
        var mind = this.data.course_time[e.currentTarget.dataset.in - 1][1]
        var maxd = "23:59"
      } else {
        var mind = this.data.course_time[e.currentTarget.dataset.in - 1][1]
        var maxd = this.data.course_time[e.currentTarget.dataset.in + 1][1]
      }
      this.setData({
        showtime: true,
        timeindex: e.currentTarget.dataset.in,
        setstarttime: e.currentTarget.dataset.st,
        setendtime: e.currentTarget.dataset.en,
        mindate: mind,
        maxdate: maxd
      })
    }
  },
  IsInDuaring(begintime, endtime, time) {
    var bt = begintime.split(":")
    var et = endtime.split(":")
    var t = time.split(":")
    var btn = parseInt(bt[0]) * 60 + parseInt(bt[1])
    var etn = parseInt(et[0]) * 60 + parseInt(et[1])
    var tn = parseInt(t[0]) * 60 + parseInt(t[1])
    if (tn > btn && tn < etn) {
      return true
    } else {
      return false
    }
  },
  keeptime() {
    if (this.IsInDuaring(this.data.mindate, this.data.maxdate, this.data.setstarttime === "" ? this.data.setendtime : this.data.setstarttime)) {
      if (this.data.setstarttime === "") {
        var temp = this.data.course_time
        temp[this.data.timeindex][1] = this.data.setendtime
        this.setData({
          course_time: temp,
        })
      } else {
        var temp = this.data.course_time
        temp[this.data.timeindex][0] = this.data.setstarttime
        this.setData({
          course_time: temp,
        })
      }
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('jxClassTable').where({
        openid: getApp().globalData.user_openid
      }).update({
        data: {
          course_time: temp,
        }
      }).then(res => {
        console.log("更新成功")
        this.setData({
          showtime: false,
        })
      })
    } else {
      Toast.fail('请设置正确的时间段  T_T');
    }
  },

  changedate(e) {
    var id = e.currentTarget.dataset.it
    if (id == 0) {
      this.setData({
        setendtime: e.detail,
      })
    } else {
      this.setData({
        setstarttime: e.detail,
      })
    }
  },
  ShowAddPlan(e) {
    var t = e.detail.index
    this.setData({
      additem: t

    })
    if (e.detail.index === 1) {
      this.getPlanTable()
    }
  },
  changedsweek() {
    if (this.data.dsweek === 1) {
      this.setData({
        dsweek: 2,
      })
    } else {
      this.setData({
        dsweek: 1,
      })
    }

  },
  SelClass(e) {
    console.log(e.currentTarget.dataset.it)
    var sc = e.currentTarget.dataset.it
    sc.jie = parseInt(e.currentTarget.dataset.it.jie)
    this.setData({
      showclass: true,
      selclass: sc,
    })
  },
  closeSelClass() {
    this.setData({
      showclass: false,
      showtime: false,
      showplan: false,
    })
  },
  addmessage(e) {
    console.log(e.currentTarget.dataset.it)
    if (e.currentTarget.dataset.it === 0) {
      this.setData({
        showclass: true,
        selclass: ""
      })
    } else if (e.currentTarget.dataset.it === 1) {
      this.setData({
        showplan: true,
        planmessage: {
          uuid: '',
          pMessage: '',
          pTime: '',
          door: '0'
        }
      })
    }
  },
  Changedays(e) {
    this.setData({
      addclassdays: e.detail.name,
    })
  },
  Changejie(e) {
    this.setData({
      addclassjie: e.detail.name,
    })
  },
  Changedsweek(e) {
    this.setData({
      addclassdsweek: e.detail,
    })
  },
  Changecolor(e) {
    this.setData({
      addclasscolor: e.currentTarget.dataset.it,
    })
  },
  keepaddclass() {
    if (this.data.addclassname === "") {
      console.log(123);
      Toast.fail('请填写课程名');
    } else {
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('jxClassTable').where({
        openid: getApp().globalData.user_openid
      }).update({
        data: {
          wList: _.push({
            address: this.data.addclassaddress,
            classid: this.data.addclassdays + '-' + this.data.addclassjie + '-' + this.data.addclassdsweek,
            color: this.data.addclasscolor,
            days: this.data.addclassdays,
            dsweek: this.data.addclassdsweek,
            jie: this.data.addclassjie,
            name: this.data.addclassname,
            teacher: this.data.addclassteacher,
          })
        }
      }).then(res => {
        console.log("更新成功")
        this.getClassTable()
        this.closeSelClass()
        this.setData({
          addclass: '',
          addclassname: '',
          addclassaddress: '',
          addclassteacher: '',
          addclassdays: '7',
          addclassjie: '1',
          addclassdsweek: '1',
          addclasscolor: '',
        })
      })
    }
  },
  deleteClass() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('jxClassTable').where({
      openid: getApp().globalData.user_openid
    }).update({
      data: {
        wList: _.pull({
          classid: _.eq(this.data.selclass.classid)
        })
      }
    }).then(res => {
      console.log("更新成功")
      this.getClassTable()
      this.closeSelClass()
    })
  },
  inputChange(e) {
    this.setData({
      ['planmessage.pMessage']: e.detail.value
    });
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
    this.setData({
      lxtime:e.detail
    })
    var oDate = new Date(e.detail),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.getBz(oMonth) + '-' + this.getBz(oDay) + ' ' + this.getBz(oHour) + ':' + this.getBz(oMin) + ':' + this.getBz(oSen);
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
  courseSubscribe(e) {
    // 获取课程相关信息
    let coueseInfo = {
        thing1: {
          value: this.data.planmessage.pMessage
        },
        time3: {
          value: this.getBzTime(this.data.lxtime)
        },
        thing4: {
          value: "是不是忘记这个计划啦?(●'◡'●)"
        },
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
                sendtime:that.data.lxtime,
              },
            })
            .then(() => {
              const db = wx.cloud.database()
              const _ = db.command
              that.data.planmessage.uuid = getApp().uuid()
              db.collection('jxPlanTable').where({
                openid: getApp().globalData.user_openid
              }).update({
                data: {
                  pList: _.push(that.data.planmessage)
                }
              }).then(res => {
                console.log("更新成功")
                that.getPlanTable()
                that.closeSelClass()
              })
            })
            .catch((e) => {
              console.log(e)
            });
        }
      },
    });
  },
  addok() {
    if (this.data.planmessage.pMessage != '') {
      if (this.data.planmessage.uuid === '') {
        if (this.data.pList0.length + this.data.pList1.length < 20) {
          this.courseSubscribe()
        } else {
          Toast.fail('别太累了宝子');
        }
      } else {
        this.UpdatePlanTable()
      }
    }
  },
  deleteplan(e) {
    Dialog.confirm({
      title: '删除',
      message: '是否要确认删除？',
    }).then(() => {
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('jxPlanTable').where({
        openid: getApp().globalData.user_openid
      }).update({
        data: {
          pList: _.pull({
            uuid: _.eq(e.currentTarget.dataset.it.uuid)
          })
        }
      }).then(res => {
        this.getPlanTable()
      })
    })
    .catch((e)=>{

    })
  
  },
  changeDone(e) {
    var pmt = e.currentTarget.dataset.it
    if (pmt.door == "0")
      pmt.door = "1"
    else
      pmt.door = "0"
    this.setData({
      planmessage: pmt,
    })
    this.UpdatePlanTable()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      activename:options.activename
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getClassTable()
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
  getClassTable() {
    wx.cloud.database().collection('jxClassTable')
      .where({
        openid: getApp().globalData.user_openid
      }).get()
      .then(res => {
        console.log("查询成功:", res.data[0])
        this.setData({
          course_time: res.data[0].course_time,
          wList: res.data[0].wList
        })
      })
      .catch(err => {
        console.log("查询失败:", err)
      })
  },
  getPlanTable() {
    wx.cloud.database().collection('jxPlanTable')
      .where({
        openid: getApp().globalData.user_openid
        // pList:{
        //   door:wx.cloud.database().command.eq("0")
        // }
      }).get()
      .then(res => {
        console.log("查询成功:", res.data[0])
        this.splitList(res.data[0].pList)
      })
      .catch(err => {
        console.log("查询失败:", err)
      })
  },
  splitList(pList) {
    var p0 = [],
      p1 = []
    for (var i = 0; i < pList.length; i++) {
      if (pList[i].door == "0") {
        // console.log(this.data.todayDate)
        var startDate = pList[i].pTime;
        startDate = startDate.replace(/-/g, "/");
        if (new Date(startDate).getTime() < new Date(this.data.todayDate).getTime()) {
          pList[i].overTime = 0
        } else {
          pList[i].overTime = 1
        }
        p0.push(pList[i])
      } else {
        p1.push(pList[i])
      }
    }
    p0 = p0.sort(this.comparetime('pTime'))
    p1 = p1.sort(this.comparetime('pTime'))
    this.setData({
      pList0: p0,
      pList1: p1
    })
  },
  comparetime(prop) {
    return function (a, b) {
      var Date1 = a[prop];
      Date1 = Date1.replace(/-/g, "/");
      var Date2 = b[prop];
      Date2 = Date2.replace(/-/g, "/");
      return new Date(Date1).getTime() - new Date(Date2).getTime() // 升序
    }
  },
  UpdatePlanTable() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('jxPlanTable').where({
      openid: getApp().globalData.user_openid
    }).update({
      data: {
        pList: _.pull({
          uuid: _.eq(this.data.planmessage.uuid)
        })
      }
    }).then(res => {
      console.log("删除成功")
      db.collection('jxPlanTable').where({
        openid: getApp().globalData.user_openid
      }).update({
        data: {
          pList: _.push(this.data.planmessage)
        }
      }).then(res => {
        console.log("更新成功")
        this.getPlanTable()
        this.closeSelClass()
      })
    })
  },
  getBzTime(e){
    var oDate = new Date(e),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear + '年' + oMonth + '月' + oDay+'日 '+oHour+':'+oMin;
    return oTime
  },
})