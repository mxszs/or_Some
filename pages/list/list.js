// pages/list/list.js
import { setTimer } from '../../utils/timer'
const app = getApp()
wx.cloud.init({
  env:'orso-w05bu',
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    openid: '',
    info_list: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    wx.checkSession({
      success: function (res) {
        that.loadDate();
      },
      fail: function (res) {
        console.log("需要重新登录");
        wx.login({})
      }
    })
   
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
  wx.showLoading({
    title: '正在加载...',
    mask: true
  })
  const db = wx.cloud.database();
    db.collection('info_list').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      // console.log(res.data)
      wx.hideLoading({
        mask: false
      })
      const openid = wx.getStorageSync("openid")
      const setList = [];
       res.data.forEach(item => {
         if (item.collection && item.collection.includes(openid)) {
           item.isCollection = true;
         } else {
           item.isCollection = false;
         }
         setList.push({
           ...item,
           timer: setTimer(item.timer || Date.now())
         })
       })
      // console.log(setList.reverse(), 111)
      that.setData({
        info_list: setList.reverse(),
        loading: res.data.length === 0 && true,
      }, () => {
        wx.stopPullDownRefresh()
      })
    })
},
  addCollection: function(e) {
    console.log(23434)
    const that = this;
    const clickid = e.target.dataset.id;
    // // console.log(getApp().globalData.userInfo, 111)
    // const db = wx.cloud.database();
    // const _ = db.command;
    // db.collection('info_list').doc(clickid).update({
    //   // data 传入需要局部更新的数据
    //   data: {
    //     collectionOpenid: _.push(app.globalData.userInfo.openid),
    //     collectionNickname: _.push(app.globalData.userInfo.nickName),
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: err => {
    //     icon: 'none',
    //       console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })
    const openid = wx.getStorageSync("openid")
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'collection',
      // 传递给云函数的参数
      data: {
        _id: clickid,
        collection: openid,
      },
      success: res => {
        console.log(res, 11);
        that.loadDate();
        // output: res.result === 3
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        // ...
      }
    })
  },
  deleteCollection: function (e) {
    const that = this;
    const clickid = e.target.dataset.id;
    // // console.log(getApp().globalData.userInfo, 111)
    // const db = wx.cloud.database();
    // const _ = db.command;
    // db.collection('info_list').doc(clickid).update({
    //   // data 传入需要局部更新的数据
    //   data: {
    //     collectionOpenid: _.push(app.globalData.userInfo.openid),
    //     collectionNickname: _.push(app.globalData.userInfo.nickName),
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: err => {
    //     icon: 'none',
    //       console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })
    const openid = wx.getStorageSync("openid")
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'delete-collection',
      // 传递给云函数的参数
      data: {
        _id: clickid,
        collection: openid,
      },
      success: res => {
        console.log(res, 11);
        that.loadDate();
        // output: res.result === 3
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        // ...
      }
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
    this.loadDate();
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