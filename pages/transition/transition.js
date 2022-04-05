// pages/transition.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const value = wx.getStorageSync("logined");
      if (value && value === '0705') {
        wx.reLaunch({
          url: '/pages/list/list',
        })
      }
    } catch(e) {
      console.error(e)
    }
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

  submit: function () {
    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    };
    if (this.data.password === '0705') {
      wx.reLaunch({
        url: '/pages/list/list',
        success: () => {
          wx.setStorageSync("logined", this.data.password);
        }
      })
    } else {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }
  },

  onChange: function (e) {
    this.data.password = e.detail;
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