// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //因为公众号和小程序还没连通拿不到unionid，所以这个函数目的是设置临时key来连接一个用户的小程序和公众号
  const xcx_openid = event.xcx_openid
  const gzh_openid = event.openid
  return await db.collection('jxuser').where({
    openid:xcx_openid
  }).update({
    data: {
      unionid_temp: gzh_openid,
    }
  }).then((res => {
    return {
      State: 1
      //成功
    }
  }).catch(err => {
    console.log(err)
    return {
      State: -1
      //程序异常
    }
  }))
}