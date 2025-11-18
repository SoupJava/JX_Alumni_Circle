// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //因为公众号和小程序还没连通拿不到unionid，所以这个函数目的是设置临时key来连接一个用户的小程序和公众号
  const token_message = event.token
  return await db.collection('jxuser').where({
    ['token_time.token']: token_message
  }).get().then(res => {
    if (res.data[0].token_time.endtime.getTime() > Date.now()) {
      return {
        jxid:res.data[0].jxid,
        openid:res.data[0].openid,
        State: 1
        //成功
      }
    } else {
      return {
        State: 2
        //token过期
      }
    }
  }).catch(err => {
    console.log(err)
    return {
      State: -1
      //程序异常
    }
  })
}