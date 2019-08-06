// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const commad = db.command;
exports.main = async (event, context, cb) => {
  try {
    return await db.collection("info_list").doc(event._id).update({
      data: {
        collection: commad.push(event.collection),
      }
    })
  } catch (e) {
    console.error(e)
  }
}