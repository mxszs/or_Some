// pages/list/list.js
import { setTimer } from '../../utils/timer'
const app = getApp()
wx.cloud.init({
  env: 'orso-xobx1',
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
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.infoList = [];
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
  loadDate: function (pageIndex = 1) {
    const that = this;
    wx.cloud.callFunction({
      name: 'limt-data',
      data: {
        dbName: 'info_list',
        pageIndex,
        pageSize: 100,
      },
    }).then(res => {
      console.log(res, 111)
      wx.hideLoading({
        mask: false
      })
      const openid = wx.getStorageSync("openid")
      const setList = [];
      res.result.data.forEach(item => {
        if (item.collection && item.collection.includes(openid)) {
          item.isCollection = true;
        } else {
          item.isCollection = false;
        }
        if (item.dianzan && item.dianzan.includes(openid)) {
          item.isDianzan = true;
        } else {
          item.isDianzan = false;
        }
        setList.push({
          ...item,
          timer: setTimer(item.timer || Date.now())
        })
      })
      // console.log(setList.reverse(), 111)
      that.setData({
        info_list: setList.reverse(),
        loading: setList.length === 0 && true,
        hasMore: res.result.hasMore,
      }, () => {
        wx.stopPullDownRefresh()
      })
      
    })
  },
  addCollection: function (e) {
    wx.showLoading({
      title: '正在添加...',
      mask: true
    })
    console.log(1212)
    const that = this;
    const clickid = e.currentTarget.dataset.id;
    const key = e.currentTarget.dataset.key;
    const openid = wx.getStorageSync("openid")
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'collection',
      // 传递给云函数的参数
      data: {
        _id: clickid,
        collection: openid,
        key: key,
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
        // wx.hideLoading({
        //   mask: false
        // })
      }
    })
  },
  deleteCollection: function (e) {
    const that = this;
    const key = e.currentTarget.dataset.key;
    wx.showLoading({
      title: '正在取消...',
      mask: true
    })
    console.log(e)
    const clickid = e.currentTarget.dataset.id;
    const openid = wx.getStorageSync("openid")
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'delete-collection',
      // 传递给云函数的参数
      data: {
        _id: clickid,
        collection: openid,
        key: key,
      },
      success: res => {
        console.log(res, 11);
        that.loadDate();
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        // wx.hideLoading({
        //   mask: false
        // })
      }
    })
  },
  // 
  addComment: function (e) {
    const clickid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../list-detail/list-detail?id=${clickid}`,
    })
  },
  uploadData: function () {
    wx.navigateTo({
      url: '../upload/question-ask',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
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
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    this.loadDate();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  addloadList:function() {
  },
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})