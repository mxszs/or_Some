// pages/overview/overview.js

const app = getApp()
wx.cloud.init();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    recommend: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBanner();
    this.loadRecommend();
  },
  loadBanner: function() {
      var that = this;
    db.collection('banner').where({
      _id: '1'
    }).get().then(res => {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        that.setData({
          imgUrls: res.data[0].images,
        }, () => {
          wx.stopPullDownRefresh()
        })
      })
  },
  loadRecommend: function() {
    var that = this;
    db.collection('recommend').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      console.log(res)
      that.setData({
        recommend: res.data,
      }, () => {
        wx.stopPullDownRefresh()
      })
    })
  },
  // 预览图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = e.target.dataset.list

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  postData: () => {
    db.collection('list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: "learn cloud database",
        due: Date.now(),
        tags: [
          "cloud",
          "database"
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
      // 取消下拉刷新
    this.loadRecommend()
      this.loadBanner()
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target, 21312)
    }
  }
})