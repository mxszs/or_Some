// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 116.4965075,
    latitude: 40.006103,
    speed: 0,
    accuracy: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMap();
  },
  loadMap: function() {
  var that = this
  wx.showLoading({
    title: "定位中",
    mask: true
  })
  wx.getLocation({
    type: 'gcj02',
    altitude: true,//高精度定位
    //定位成功，更新定位结果
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy

      that.setData({
        longitude: longitude,
        latitude: latitude,
        speed: speed,
        accuracy: accuracy,
      }, () => {
        wx.stopPullDownRefresh()
      })
    },
    //定位失败回调
    fail: function () {
      wx.showToast({
        title: "定位失败",
        icon: "none"
      })
    },
    complete: function () {
      //隐藏定位中信息进度
      wx.hideLoading()
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
    this.loadMap();
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