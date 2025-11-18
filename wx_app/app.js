// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
          // env 参数说明：
          //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
          //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
          //   如不填则使用默认环境（第一个创建的环境）
          // env: 'my-env-id',
          env: "cloud1-7g48m2a6e2ac093c",
          traceUser: true,
        }),
        wx.cloud.callFunction({
          name: 'getOpenId',
          data:{},
          success: res => {
            //获取用户openid
            this.globalData.user_openid = res.result.openid
            console.log(this.globalData.user_openid)
            console.log(res.result.unionid)
            wx.cloud.database().collection('jxuser')
              .where({
                openid:this.globalData.user_openid,
              }).get()
              .then(res=>{
                console.log("查询成功:", res.data)
                this.globalData.userInfo=res.data[0]
                this.globalData.isLogin=true
                var that = this;
                that.data.inter= setInterval(
                    function () {
                        // TODO 你需要无限循环执行的任务
                        // that.globalData.chatList=
                        that.XIAOXINnotify(parseInt(Math.ceil(Math.random()*10)))
                    }, 420000+parseInt(Math.ceil(Math.random()*10000)));    
              })
              .catch(err => {
                console.log("查询失败:", err)
              })
          },
          fail: err =>{
            console.error('调用失败',err)
          }
        })
    }
    this.globalData = {};
  },
  globalData: {
    _chatList:'原记录',
    isLogin:false,
    //用户openid
    user_openid: '',
    //用户信息
    userInfo: null,
    envcc:'cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/'
  },
  
  uuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  watch(method){
    var obj = this.globalData;
    Object.defineProperty(obj,"chatList", {
      configurable: true,//描述属性是否配置，以及可否删除 false 时，不能删除当前属性，且不能重新配置当前属性的描述符(有一个小小的意外：true时，可以删除当前属性，可以配置当前属性所有描述符。
      enumerable: true,//描述属性是否会出现在for in 或者 Object.keys()的遍历中
      set: function (value) {
        this._chatList = value;
        method(value);
      },
      get:function(){
      // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.chatList的时候，这里就会执行。
        return this._chatList
      }
    })
  },
  XIAOXINnotify(n){
    console.log(n)
    if(n==1){
     
    }
    if(n==2){
      var that=this
      wx.cloud.database().collection('jxPlanTable').aggregate().match({
        openid: getApp().globalData.userInfo.openid
      }).sample({
        size: 1
      }).end()
      .then(res=>{
        // console.log(res.list[0].pList.length)
        var event=res.list[0].pList[parseInt(Math.ceil(Math.random()*res.list[0].pList.length))-1]
        var word="小新提醒:"
        if(event.door=="0"){
          var word2="你的计划‘"+event.pMessage+"’将在"+event.pTime+"达到提醒日期，不要忘了嗷~~"
        }else{
          var word2="‘"+event.pMessage+"’你已经完成啦，可以删除了呦~~"
        }
        var final=word+word2
        that.globalData.chatList=final
      })
    }
    if(n==3){
      var that=this
      wx.cloud.database().collection('jxCountDay').aggregate().match({
        openid: getApp().globalData.userInfo.openid
      }).sample({
        size: 1
      }).end()
      .then(res=>{
        // console.log(res.list[0].pList.length)
        var event=res.list[0].pList[parseInt(Math.ceil(Math.random()*res.list[0].pList.length))-1]
        var word="小新提醒:"
        var day=this.dateDiff(event.pTime)
        if(day>=0){
          var word2="倒数日‘"+event.pMessage+"’还有"+day+"天，不要忘了嗷φ(゜▽゜*)♪"
        }
        else{
          var word2="倒数日‘"+event.pMessage+"’已经到期了，相信你已经知道啦o(*￣▽￣*)ブ"
        }
        var final=word+word2
        that.globalData.chatList=final
      })
    }
    if(n==4){
      var that=this
      wx.cloud.database().collection('jxtomato').aggregate().match({
        openid: getApp().globalData.userInfo.openid
      }).sample({
        size: 1
      }).end()
      .then(res=>{
        // console.log(res.list[0].pList.length)
        var event=res.list[0].task[parseInt(Math.ceil(Math.random()*res.list[0].task.length))-1]
        var word="小新提醒:"
        var day=0-parseInt(this.dateDiff(event.begintime))
        console.log(day)
        var word2="你已经有"+day+"天没有来专注"+event.event+"了，确定不来试试吗？"
        var final=word+word2
        that.globalData.chatList=final
      })
    }
    if(n==5){
      var that=this
      wx.cloud.database().collection('jxMotionUserMessage').where({
        openid:getApp().globalData.user_openid
      }).get()
      .then(res=>{
        var alltime=0
        for(var i=0;i<res.data[0].motion.length;i++){
          alltime+=res.data[0].motion[i].fruit
        }
       var aa=parseFloat(alltime)/3600+' '
       var a=aa.substring(0, aa.indexOf(".") + 3)
       var word="小新提醒:"
       if(res.data[0].sex=='男')
        var word2="你总计已经运动了"+a+"小时了，真是一个热爱运动的男孩🏀"
        else
        var word2="你总计已经运动了"+a+"小时了，真是一个热爱运动的女孩🧘‍"
        var final=word+word2
        that.globalData.chatList=final
      }).catch(err=>{
        console.log(err)
      })
    }
    if(n==6){
      var word="小新提醒:"
      var word2="不要‍忘记今天的智慧树浇水呀💧"
      var final=word+word2
      this.globalData.chatList=final
    }
    if(n==7){
      var word="小新会一直陪伴在你的身边😘"
      var final=word
      this.globalData.chatList=final
    }
    if(n==8){
      var word="小新发现听说摇一摇可以发现同校校友(⊙o⊙)？"
      var final=word
      this.globalData.chatList=final
    }
    if(n==9){
      var word="如果看腻了小新，可以设置修改小新的主题哟(＾Ｕ＾)ノ~ＹＯ"
      var final=word
      this.globalData.chatList=final
    }
    if(n==10){
      var word="不要忘记我的好朋友鱼汤（公众号搜索：喵喵鱼汤）"
      var final=word
      this.globalData.chatList=final
    }
  },
  dateDiff(sDate2) {
    var sDate1 = this.formatDate(new Date());
    var startDate = Date.parse(sDate1);
    var endDate = Date.parse(sDate2);
    // if (startDate > endDate) {
    //   return 0;
    // }
    // if (startDate == endDate) {
    //   return 1;
    // }
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
  },
  courseSubscribe(e) {
    wx.cloud.database().collection('jxHelp').aggregate().sample({
      size: 1
    }).end()
    .then(res=>{
      let coueseInfo = {
        thing1: {
          value: res.list[0].DiscussMessage
        },
        date3: {
          value: res.list[0].sendTime
        },
        thing5:{
          value:res.list[0].LookNum
        },
      }
      var that=this
    wx.requestSubscribeMessage({
      tmplIds: ["0slBBlD38Q0ZKLIWFfZD2HEbr-WvrxcEVEwIPq8f35I"],
      success(res) {
        if (res["0slBBlD38Q0ZKLIWFfZD2HEbr-WvrxcEVEwIPq8f35I"] === 'accept') {
          // 调用云函数subscribe
          wx.cloud
            .callFunction({
              name: 'addCountDay',
              data: {
                data: coueseInfo,
                templateId: "0slBBlD38Q0ZKLIWFfZD2HEbr-WvrxcEVEwIPq8f35I",
                sendtime:Date.parse(new Date())+Math.random()*(60*60*1000)+ (60*60*1000),
              },
            })
            .then(() => {
             
            })
            .catch((e) => {
              console.log(e)
            });
        }
      },
    });
    })
    
  },
});