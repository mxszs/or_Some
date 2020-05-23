// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const commad = db.command;
exports.main = async (event, context, cb) => {
  try {
    await db.collection("info_list").where({
      _openid: event.openid
    }).update({
      data: {
        avatarUrl: commad.set(event.avatarUrl)
      }
    })
    return { message: '更新成功' };
  } catch (e) {
    console.error(e)
  }
}