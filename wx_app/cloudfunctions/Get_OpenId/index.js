// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const gzh_openid = event.openid
  return await db.collection('jxuser').where({
      unionid_temp: gzh_openid
    }).get().then(res => {
      return {
        jxid: res.data[0].jxid,
        openid: res.data[0].openid,
        State: 1
        //成功
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