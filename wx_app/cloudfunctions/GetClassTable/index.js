// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const openid = event.openid
  return await db.collection('jxClassTable').field({
    course_time:true,
    wList:true,
    _id:false
  }).where({
      openid: openid
    }).get().then(res=>{
      return{
        course_time:res.data[0].course_time,
        wList:res.data[0].wList,
        State:1
      }
    })
    .catch(err => {
      console.log(err)
      return {
        State: -1
        //程序异常
      }
    })
}