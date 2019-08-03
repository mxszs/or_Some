// pages/list/list.js
const app = getApp()
wx.cloud.init() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    info_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDate();
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = e.target.dataset.list

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loadDate: function () {
  var that = this;
  const db = wx.cloud.database();
  db.collection('list').get().then(res => {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res.data)
    that.setData({
      list: res.data,
    })
  })
    db.collection('info_list').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      console.log(res.data)
      that.setData({
        info_list: res.data,
      })
    })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadDate();
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})