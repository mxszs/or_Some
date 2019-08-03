import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'

const wxUploadFile = promisify(wx.uploadFile)
const app = getApp()
wx.cloud.init() 
Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: [],
    userInfo: '',
  },

  onLoad(options) {
    $init(this)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  handleTitleInput(e) {
    const value = e.detail.value
    // this.data.title = value
    // this.data.titleCount = value.length
    // $digest(this)
    this.setData({
      title: value,
      titleCount: value.length
    })
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 9 ? images : images.slice(0, 9)
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(e) {
    const title = this.data.title
    const content = this.data.content
    const image = this.data.images
    const { userInfo } = this.data;
    if (title && content) {
      const imageList = []
      const arr = this.data.images.map(path => {
        return wx.cloud.uploadFile({
          cloudPath: `${Date.now()}.png`,
          filePath: path,
        })
      })
      wx.showLoading({
        title: '正在创建...',
        mask: true
      })
      Promise.all(arr).then(res => {
        console.log(res, 'res')
        return res.map(item => item.fileID)
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      }).then(urls => {
        const db = wx.cloud.database();
        db.collection('info_list').add({
          data: {
            title,
            images: urls,
            textDec: content,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
          },
          success: function (res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            wx.hideLoading();
          }
        })
        this.setData({
          titleCount: 0,
          contentCount: 0,
          title: '',
          content: '',
          images: []
        }, () => {
          wx.switchTab({
            url: '/pages/list/list'
          })
        })
      })

    }
  },

})