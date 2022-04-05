const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
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
    var that = this;
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           //从数据库获取用户信息
    //           that.queryUsreInfo();
    //           //用户已经授权过
    //           wx.switchTab({
    //             url: '/pages/index/index'
    //           })
    //         }
    //       });
    //     }
    //   }
    // })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      that.queryUsreInfo();
      //授权成功后，跳转进入小程序首页
      wx.navigateTo({
        url: '/pages/transition/transition',
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.login({
      success:(res) => {
        wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx5e199bd7483a4da2
&secret=d5fb9251e6c5f0ce866f4606066ce198&js_code=${res.code}&grant_type=authorization_code`,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            getApp().globalData.userInfo = {
              ...getApp().globalData.userInfo,
              ...res.data,
            };
            
          }
        })
      }
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'openid',
      // 传递给云函数的参数
      data: {
      },
      success: res => {
        console.log(res, 11);
        wx.setStorageSync("openid", String(res.result.openid))
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

})