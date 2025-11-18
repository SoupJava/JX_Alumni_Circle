const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // 从云开发数据库中查询等待发送的消息列表

    const messages = await db
      .collection('CountDay')
      .where({
        isSend: false,
        sendtime:db.command.lt(new Date().getTime()+3,600,000*8)
      })
      .get();

    // 循环消息列表依次处理下发订阅操作
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('CountDay')
          .doc(message._id)
          .update({
            data: {
              isSend: true,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};
