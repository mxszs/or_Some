//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'orso-xobx1',
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // console.log(res, 21323)
        // wx.request({
        //   url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxb7679046d6028f27&secret=d100a1ce0a99a493f48ab7b47f05fe28&js_code=${res.code}&grant_type=authorization_code`,
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: function (res) {
        //     console.log(res, 1212121)
        //     var userinfo = {};
        //     userinfo['id'] = res.data.id;
        //     userinfo['nickName'] = info.detail.userInfo.nickName;
        //     userinfo['avatarUrl'] = info.detail.userInfo.avatarUrl;
        //     wx.setStorageSync('userinfo', userinfo)
        //   }
        // })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})