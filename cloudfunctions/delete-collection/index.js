// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const commad = db.command;
exports.main = async (event, context, cb) => {
  try {
    var collectionList = [];
    var collection = {};
    var dianzan = {};
    await db.collection("info_list").doc(event._id).get().then(res =>{
      const collectionList = res.data[event.key].filter(item => item !== event.collection)
      collection = {
        collection: collectionList,
      }
      dianzan = {
        dianzan: collectionList
      }
    }).then(() => {
      return db.collection("info_list").doc(event._id).update({
        data: event.key === 'collection' ? collection : dianzan
      })
    })
    
  } catch (e) {
    console.error(e)
  }
}