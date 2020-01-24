// pages/list-detail/list-detail.js
import { setTimer } from '../../utils/timer'
const app = getApp()
wx.cloud.init()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_info: [],
    detailId: '',
    commentList: [],
    isDianzan: false,
    isCollection: false,
    loadingList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailId: options.id
    }, () => {
      this.lodaDetail(options.id);
      this.loadComment(options.id);
    })
  },
  lodaDetail: function (id) {
  const that = this;
  const db = wx.cloud.database();
  db.collection('info_list').where({
    _id: id
  }).get().then(res => {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res.data)
    wx.hideLoading({
      mask: false
    })
    wx.stopPullDownRefresh()
    const openid = wx.getStorageSync("openid")
    const setList = [];
    res.data.forEach(item => {
      setList.push({
        ...item,
        timer: setTimer(item.timer || Date.now())
      })
    })
    that.setData({
      list_info: setList,
      dianzan: setList[0].dianzan,
      collection: setList[0].collection,
      isDianzan: setList[0].dianzan.includes(openid),
      isCollection: setList[0].collection.includes(openid),
      // dianzan: setList[0].dianzan,
    })
  })
},
loadComment: function(id) {
  const that = this;
  const db = wx.cloud.database();
  db.collection('comment').where({
    detailId: id
  }).get().then(res => {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res.data)
    const setList = [];
    res.data.forEach(item => {
      setList.push({
        ...item,
        timer: setTimer(item.timer || Date.now()),
      })
    })
    that.setData({
      commentList: setList,
      loadingList: setList.length === 0 && true,
    })
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = e.target.dataset.list

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },
  addCollection: function (e) {
    wx.showLoading({
      title: '正在添加...',
      mask: true
    })
    console.log(1212)
    const that = this;
    const clickid = this.data.detailId;
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
        that.lodaDetail(clickid);
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
    const clickid = this.data.detailId;
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
        that.lodaDetail(clickid);
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
    const clickid = this.data.detailId;
    wx.redirectTo({
      url: `../comment/comment?id=${clickid}`,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.lodaDetail(this.data.detailId);
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
      mask: true,
    })
    const clickid = this.data.detailId;
    this.lodaDetail(clickid);
    this.loadComment(clickid);
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