// pages/comment/comment.js
const app = getApp()
wx.cloud.init({
  env: 'orso-xobx1',
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentCount: 0,
    content: '',
    detailId: '11111',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      detailId: options.id,
    })
  },
  handleContentInput: function(e) {
    const value = e.detail.value
    this.setData({
      content: value,
      contentCount: value.length
    })
  },
  submit: function() {
    const that = this;
    const comment = this.data.content;
    // avatarUrl: app.globalData.userInfo.avatarUrl,
    //   nickName: app.globalData.userInfo.nickName,
    const db = wx.cloud.database();
    wx.showLoading({
      title: '正在提交...',
      mask: true,
    })
    db.collection('comment').add({
      data: {
        detailId: this.data.detailId,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        comment: comment,
        timer: Date.now(),
      },
      success: function(res) {
        console.log(res)
        wx.redirectTo({
          url: `../list-detail/list-detail?id=${that.data.detailId}`,
        })
        wx.hideLoading({
          mask: false,
        })
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