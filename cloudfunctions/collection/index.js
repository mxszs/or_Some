// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const commad = db.command;

exports.main = async (event, context, cb) => {
  try {
    const collection = {
      collection: commad.push(event.collection),
    }
    const dianzan = {
      dianzan: commad.push(event.collection),
    }
    const updataKey = event.key === 'collection' ? collection : dianzan;
    await db.collection("info_list").doc(event._id).update({
      data: updataKey
    })
    return { updataKey, id: event._id};
  } catch (e) {
    console.error(e)
  }
}