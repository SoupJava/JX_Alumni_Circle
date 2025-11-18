// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //该函数是来根据临时的unionid_temp来获取对应用户的计划表
  const openid = event.openid
  return await db.collection('jxnote').field({
    noteTitle:true,
    _id:false
  }).where({
      openid: openid
    }).get().then(res=>{
      return {
        data:res.data,
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