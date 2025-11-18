// pages/StaTomato/StaTomato.js
import * as echarts from '../../ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecage: {
      // onInit: function (canvas, width, height, dpr) {
      //   const AgeChart = echarts.init(canvas, null, {
      //     width: width,
      //     height: height,
      //     devicePixelRatio: dpr // new
      //   });
      //   canvas.setChart(AgeChart);
      //   AgeChart.setOption(getBarOption());
      //   return AgeChart;
      // }
    },
    task: '',
    alltime:0
  },
   // 初始化图表
   init_echart: function (data) {
     console.log(data)
    this.Component.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart,data)
      this.chart = chart;
      return chart;
    });
  },
  // getOption: function () {
  //   let db = wx.cloud.database().collection('echarts')
  //   db.get().then(res => {
  //     console.log('获取数据成功', res);
  //     this.init_echart(res.data[0].time, res.data[0].num)
  //   })
  //   .catch(err => {
  //     console.log('获取数据失败', err);
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.database().collection('jxtomato').where({
        openid: getApp().globalData.user_openid
      }).get()
      .then(res => {
        console.log(res.data[0].task)
        // this.setData({
        //   task: res.data[0].task
        // })
        var tt=res.data[0].task
        var all=0
        for(var i=0;i<tt.length;i++){
          all+=parseInt(tt[i].continueTime)
          if(tt[i].event=='工作'){
            tt[i].img="cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/icon/works.png"
            continue
          }
          if(tt[i].event=='学习'){
            tt[i].img="cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/icon/学习经历.png"
            continue
          }
          if(tt[i].event=='思考'){
            tt[i].img="cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/icon/思考.png"
            continue
          }
          if(tt[i].event=='写作'){
            tt[i].img="cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/icon/写作.png"
            continue
          }
          if(tt[i].event=='阅读'){
            tt[i].img="cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/icon/阅读.png"
            continue
          }
          if(tt[i].event=='其他'){
            tt[i].img="cloud://cloud1-7g48m2a6e2ac093c.636c-cloud1-7g48m2a6e2ac093c-1320787210/icon/其他.png"
            continue
          }
        }
        this.setData({
          task: tt.reverse(),
          alltime:all
        })
        var show=[{
          value: 0,
          name: '工作'
        }, {
          value: 0,
          name: '学习'
        }, {
          value: 0,
          name: '思考'
        }, {
          value: 0,
          name: '写作'
        }, {
          value: 0,
          name: '阅读'
        }, {
          value: 0,
          name: '其他'
        }]
        for(var i=0;i<tt.length;i++){
          if(tt[i].event=='工作'){
            console.log(123)
            show[0].value=show[0].value+parseInt(tt[i].continueTime)
            continue
          }
          if(tt[i].event=='学习'){
            show[1].value=show[1].value+parseInt(tt[i].continueTime)
            continue
          }
          if(tt[i].event=='思考'){
            show[2].value=show[2].value+parseInt(tt[i].continueTime)
            continue
          }
          if(tt[i].event=='写作'){
            show[3].value=show[3].value+parseInt(tt[i].continueTime)
            continue
          }
          if(tt[i].event=='阅读'){
            show[4].value=show[4].value+parseInt(tt[i].continueTime)
            continue
          }
          if(tt[i].event=='其他'){
            show[5].value=show[5].value+parseInt(tt[i].continueTime)
            continue
          }
        }
        this.setData({
          lineops:show
        })
        this.init_echart(show)
      })
      .catch(err => {
        console.log(err)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.Component = this.selectComponent('#mychart-multi');
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
// function getBarOption() {
//   console.log(lineops)
  
// }

function setOption(chart,data){
  console.log(data)
  const option={
    legend: {
      bottom: 0,
      left: 'center'
    },
    series: [{
      type: 'pie',
      radius: ['30', '60%'],
      clockwise: false,
      center: ['50%', '40%'],
      labelLine: {
        smooth: true
      },
      label: {
        formatter: '{b}: {d}%'
      },
      itemStyle: {
        color: function (params) {
          let colorList = [
            ['#FFBBA8', '#FF3E3E'],
            ['#766EF9', '#FF9CF3'],
            ['#7DB6EE', '#90ECC7'],
            ['#FFE18F', '#FF9C62'],
            ['#0fd850', '#f9f047'],
            ['#ebc0fd', '#90ECC7'],
          ]
          let index = params.dataIndex
          if (params.dataIndex >= colorList.length) {
            index = params.dataIndex - colorList.length
          }
          return new echarts.graphic.LinearGradient(0, 0, 0, 1,
            [{
                offset: 0,
                color: colorList[index][0]
              },
              {
                offset: 1,
                color: colorList[index][1]
              }
            ], )
        }
      },
      data: data,
    }, ]

  };
  chart.setOption(option)
}