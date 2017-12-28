const util = require("../../utils/util");
const db = require("../../utils/db");
const app = getApp();

Page({
  data: {
    postList: [],
    threadList: {},
    page: 1,
    tid: 0,
    isLoading: false,
    hasMore: false,
    isReady: false,
    isReply: false,
    replyFocus: false,
    bindScrollShow: true,
    height: 0,
    cacheTop: 0,
    commentnum: 1000,
    collectionnum: 9,
    forwardnum: 4,
    collectionSrc: {
      show: false,
      true: '/images/icon_comment_collection_sel.png',
      false: '/images/icon_comment_collection.png'
    },
    message: ''
  },
  onLoad: function (options) {
    this.data.tid = options.tid;
    this.getContentByTid(options);
  },
  onShow: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    })
  },
  getContentByTid: function (options) {
    var that = this,
      thread,
      details,
      pager,
      params = {
        page: that.data.page,
        tid: options.tid,
      };

    util.showLoading();

    db.getContent((res, error) => {
        console.log("hhhhhhhhhhhhhh")
        console.log(res)
      thread = res.data.thread;
      details = res.data.postList;
      pager = res.data.pager;

      if (res.statusCode !== 200) return;

      util.hideLoading();

      wx.setNavigationBarTitle({ title: thread.subject });
      for (let item in details) {
        details[item].message = (details[item].message.replace("<br/>", '')).replace("<br />", '')
      }
      console.log(details)
      that.setData({
        isReady: !that.data.isReady,
        threadList: thread,
        postList: details,
        page: pager.nextPage,
        isLoading: pager.nextPage == pager.pageCnt ? false : true,
        hasMore: pager.nextPage == pager.pageCnt ? false : true,
      });
    }, params)
  },
  ReachBottom: function () {
    var that = this,
      tid = that.data.tid,
      page = that.data.page,
      params = {
        page: page,
        tid: tid,
      };

    if (that.data.isLoading) {
      util.showLoading();
      db.getContent((res, error) => {
        if (res.statusCode !== 200) return;

        util.hideLoading();
        that.setData({
          postList: Object.assign(that.data.postList, res.data.postList),
          page: res.data.pager.nextPage,
          isLoading: page == res.data.pager.nextPage ? false : true,
        });
      }, params);
    } else {
      that.setData({
        hasMore: false,
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.threadList.subject,
      path: '/pages/detail/detail?tid=' + this.data.tid,
    }
  },
  bindForumPost: function (e) {
    const that = this,
      value = e.detail.value,
      params = {
        tid: this.data.tid,
        message: value.message
      },
      jwt = wx.getStorageSync('jwt');
    if (jwt) {
      db.forumPost((res, err) => {
        const errorInfo = (res.data.errorinfo).replace(/<.+?>/g, '');
        if (errorInfo) {
          wx.showModal({
            title: '提示',
            content: errorInfo,
            showCancel: false,
          })
        }
      }, params);
    } else {
      wx.showModal({
        title: '提示',
        content: '请登录后回复',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/setting/setting'
            });
          }
        }
      })
    }
  },
  switchInput: function (e) {
    this.setData({
      isReply: !this.data.isReply,
      replyFocus: !this.data.replyFocus
    });
  },
  onShareAppMessage: function () {
    return {
      title: this.data.threadList.subject,
      path: '/pages/detail/detail?tid=' + this.data.tid,
    }
  },
  //收藏
  addCollection: function (e) {
    var that = this
    wx.request({
      url: app.appUrl + 'myFavorite_put', //仅为示例，并非真实的接口地址
      data: {
        tid: that.data.tid,
        unionid: that.data.unionid,
        subject: that.data.threadList.subject
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res) {
          wx.showToast({
            title: '已收藏！',
            duration: 2000
          });
          that.data.collectionSrc.show = true
          that.setData({
            collectionSrc: that.data.collectionSrc
          })
        }
      }
    })
  },
  scroll: function (e) {
    if (this.data.cacheTop > e.detail.scrollTop) {
      this.setData({
        bindScrollShow: false
      })
    } else {
      this.setData({
        bindScrollShow: true
      })
    }
    this.setData({
      cacheTop: e.detail.scrollTop
    })
  },
  addMessage: function (e) {
    this.setData({
      message: e.detail.value
    })
  }
});