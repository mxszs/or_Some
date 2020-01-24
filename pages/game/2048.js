var app = getApp();

var Grid = require('./grid.js');
var Tile = require('./tile.js');
var GameManager = require('./game_manager.js');

var config = {
  data: {
    hidden: false,

    // 游戏数据可以通过参数控制
    grids: [],
    over: false,
    win: false,
    score: 0,
    highscore: 0,
    start: '重新开始',
    overMsg: '游戏结束'
  },
  onLoad: function () {
    this.GameManager = new GameManager(4);

    this.setData({
      grids: this.GameManager.setup(),
      highscore: wx.getStorageSync('highscore') || 0
    });

  },
  onReady: function () {
    var that = this;

    // 页面渲染完毕隐藏loading
    that.setData({
      hidden: true
    });
  },
  onShow: function () {
    // 页面展示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  // 更新视图数据
  updateView: function (data) {
    // 游戏结束
    if (data.over) {
      data.overMsg = '游戏结束';
    }

    // 获胜
    if (data.win) {
      data.overMsg = '恭喜';
    }
    if (data.win || data.over) {
      wx.showModal({
        title: data.overMsg || '游戏结束',
        content: `得分 ${data.score} 历史最高 ${data.highscore}`,
        confirmText: '重新开始',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.restart()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        fail: () => {
          console.log(1);
        }
      })
    }
    this.setData(data);
  },

  // 重新开始
  restart: function () {
    this.updateView({
      grids: this.GameManager.restart(),
      over: false,
      won: false,
      score: 0
    });
  },

  touchStartClienX: 0,
  touchStartClientY: 0,
  touchEndClientX: 0,
  touchEndClientY: 0,
  isMultiple: false, // 多手指操作

  touchStart: function (events) {

    // 多指操作
    this.isMultiple = events.touches.length > 1;
    if (this.isMultiple) {
      return;
    }

    var touch = events.touches[0];

    this.touchStartClientX = touch.clientX;
    this.touchStartClientY = touch.clientY;

  },

  touchMove: function (events) {
    var touch = events.touches[0];
    this.touchEndClientX = touch.clientX;
    this.touchEndClientY = touch.clientY;
  },

  touchEnd: function (events) {
    if (this.isMultiple) {
      return;
    }

    var dx = this.touchEndClientX - this.touchStartClientX;
    var absDx = Math.abs(dx);
    var dy = this.touchEndClientY - this.touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      var direction = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);

      var data = this.GameManager.move(direction) || {
        grids: this.data.grids,
        over: this.data.over,
        won: this.data.won,
        score: this.data.score
      };

      var highscore = wx.getStorageSync('highscore') || 0;
      
      var max = 0;
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          if (data.grids[i][j]) {
            if (data.grids[i][j].value > max) {
              max = data.grids[i][j].value;
            }
          }
        }
      }
      if (max > highscore) {
        wx.setStorageSync('highscore', max);
      }
      this.updateView({
        grids: data.grids,
        over: data.over,
        won: data.won,
        score: max,
        highscore: Math.max(highscore, max)
      });

    }

  }
};

Page(config);
