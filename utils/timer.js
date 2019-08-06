
const timestampToTime = (valueTime) => {
  var newData = Date.parse(new Date());
  var diffTime = Math.abs(newData - valueTime);
  if (diffTime > 7 * 24 * 3600 * 1000) {
    var date = new Date(valueTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('1' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return m + '-' + d + ' ' + h + ':' + minute;

  } else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
    // //注释("一周之内");

    // var time = newData - diffTime;
    var dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    return dayNum + "天前";

  } else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
    // //注释("一天之内");
    // var time = newData - diffTime;
    var dayNum = Math.floor(diffTime / (60 * 60 * 1000));
    return dayNum + "小时前";

  } else if (diffTime < 3600 * 1000 && diffTime > 60 * 1000) {
    // //注释("一小时之内");
    // var time = newData - diffTime;
    var dayNum = Math.floor(diffTime / (60 * 1000));
    return dayNum + "分钟前";
  } else if (diffTime < 60 * 1000 && diffTime > 0) {
    console.log(diffTime, 111)
    var dayNum = Math.floor(diffTime / 1000);
    return dayNum + "秒前";
  }
}
module.exports = {
  setTimer: timestampToTime
}