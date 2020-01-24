const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const commad = db.command;
exports.main = async (event, context, cb) => {
  let dbName = event.dbName;
  let fliter = event.fliter ? event.fliter : null;
  let pageIndex = event.pageIndex ? event.pageIndex : 1;
  let pageSize = event.pageSize ? event.pageSize : 10;
  const resultTotal = await db.collection(dbName).where(fliter).count();
  const total = resultTotal.total;
  const totalPage = Math.ceil(total / 10);
let hasMore;
  if (pageIndex > totalPage || pageIndex === totalPage) {
    hasMore = false;
  } else {
    hasMore = true;
  }
  return db.collection(dbName).where(fliter).skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
    res.hasMore = hasMore;
    return res;
  })


}