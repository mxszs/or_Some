// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const commad = db.command;
exports.main = async (event, context, cb) => {
  try {
    var collectionList = [];
    await db.collection("info_list").doc(event._id).get().then(res =>{
          collectionList = res.data.collection.filter(item => item !== event.collection)
    }).then(() => {
      return db.collection("info_list").doc(event._id).update({
        data: {
          collection: collectionList,
        }
      })
    })
    
  } catch (e) {
    console.error(e)
  }
}