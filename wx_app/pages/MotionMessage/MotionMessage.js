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
    motion: '',
    alltime: 0
  },
  // 初始化图表
  init_echart: function (data) {
    console.log(data)
    this.Component.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: 400
      });
      setOption(chart, data)
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
    wx.cloud.database().collection('jxMotionUserMessage').where({
        openid: getApp().globalData.user_openid
      }).get()
      .then(res => {
        console.log(res.data[0].motion)
        // this.setData({
        //   task: res.data[0].task
        // })
        var tt = res.data[0].motion
        var all = 0
        for (var i = 0; i < tt.length; i++) {
          all += parseInt(tt[i].fruit)
        }
        all=(all/3600)+' '
        var b=all.substring(0, all.indexOf(".") + 3)
        var show = [{
          value: 0,
          name: '跑步'
        }, {
          value: 0,
          name: '骑行'
        }, {
          value: 0,
          name: '跳绳'
        }, {
          value: 0,
          name: '瑜伽'
        }, {
          value: 0,
          name: '仰卧起坐'
        }, {
          value: 0,
          name: '俯卧撑'
        }, {
          value: 0,
          name: '拳击'
        }, {
          value: 0,
          name: '健美操'
        }, {
          value: 0,
          name: '乒乓球'
        }, {
          value: 0,
          name: '羽毛球'
        }, {
          value: 0,
          name: '排球'
        }, {
          value: 0,
          name: '足球'
        }, {
          value: 0,
          name: '篮球'
        }, {
          value: 0,
          name: '游泳'
        }]
        for (var i = 0; i < tt.length; i++) {
          if (tt[i].name == '跑步') {
            show[0].value = show[0].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '骑行') {
            show[1].value = show[1].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '跳绳') {
            show[2].value = show[2].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '瑜伽') {
            show[3].value = show[3].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '仰卧起坐') {
            show[4].value = show[4].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '俯卧撑') {
            show[5].value = show[5].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '拳击') {
            show[6].value = show[6].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '健美操') {
            show[7].value = show[7].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '乒乓球') {
            show[8].value = show[8].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '羽毛球') {
            show[9].value = show[9].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '排球') {
            show[10].value = show[10].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '足球') {
            show[11].value = show[11].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '篮球') {
            show[12].value = show[12].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
          if (tt[i].name == '游泳') {
            show[13].value = show[13].value + parseInt(tt[i].fruit)
            var s=(tt[i].fruit/60)+''
            s=s.substring(0, s.indexOf(".") + 3)
            tt[i].fruit=s
            continue
          }
        }
        this.setData({
          motion: tt.reverse(),
          alltime: b
        })
        this.setData({
          lineops: show
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

function setOption(chart, data) {
  console.log(data)
  const option = {
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
            ['#FFBBA8', '#FF3E3E'],
            ['#766EF9', '#FF9CF3'],
            ['#7DB6EE', '#90ECC7'],
            ['#FFE18F', '#FF9C62'],
            ['#0fd850', '#f9f047'],
            ['#ebc0fd', '#90ECC7'],
            ['#FFBBA8', '#FF3E3E'],
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