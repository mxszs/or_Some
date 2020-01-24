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
    info_list: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const that = this;
    this.setData({
      key: option.key,
    })
    switch(option.key) {
      case 'upload': wx.setNavigationBarTitle({
        title: '我的上传'
      }); break;
      case 'collection': wx.setNavigationBarTitle({
        title: '我的收藏'
      }); break;
      default: break;
    }
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    setTimeout(() => {
      if (option.id && option.nickName) {
        that.loadDate(option.id, option.nickName);
      } else {
        that.loadDate(app.globalData.userInfo.openid, app.globalData.userInfo.nickName);
      }
    }, 1000)
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
  loadDate: function (id, name) {
    var that = this;
    const db = wx.cloud.database();
    const uploadFilter = {
      _openid: id,
      nickName: name,
    }
    const openid = wx.getStorageSync("openid")
    const collectionFilter = {
      collection: openid
    }
    const fliterList = this.data.key === 'upload' ? uploadFilter : collectionFilter;
    db.collection('info_list').where({ ...fliterList}).get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      console.log(res.data)
      wx.hideLoading({
        mask: false
      })
      const setList = [];
      res.data.forEach(item => {
        setList.push({
          ...item,
          timer: setTimer(item.timer || Date.now())
        })
      })
      that.setData({
        info_list: setList.reverse(),
        loading: setList.length === 0 && true,
      }, () => {
        wx.stopPullDownRefresh()
      })
    })
  },
  deleteList: function (e) {
    const that = this;
    // console.log(e.target.dataset.id)
    wx.showLoading({
      title: '正在删除...',
      mask: true,
    })
    const db = wx.cloud.database();
    db.collection('info_list').doc(e.target.dataset.id).remove({
      success: function (res) {
        wx.hideLoading({
          title: '删除成功',
          mask: false,
        })
        that.loadDate(app.globalData.userInfo.openid, app.globalData.userInfo.nickName);
      }
    })
  },
  deleteCollection: function (e) {
    const that = this;
    const clickid = e.target.dataset.id;
    const key = e.target.dataset.key;
    const openid = wx.getStorageSync("openid")
    wx.showLoading({
      title: '正在取消...',
      mask: true,
    })
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
        wx.hideLoading({
          title: '取消成功',
          mask: false,
        })
        that.loadDate(app.globalData.userInfo.openid, app.globalData.userInfo.nickName);
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
    // this.loadDate(app.globalData.userInfo.openid, app.globalData.userInfo.nickName);
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
    this.loadDate(app.globalData.userInfo.openid, app.globalData.userInfo.nickName);
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