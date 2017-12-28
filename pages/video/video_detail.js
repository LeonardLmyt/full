var app = getApp()
Page({



  data: {
    id: "",
    intro: '',
    name: '',
    url: "",
    view: '',
    unionid: '',
    fid: '',
    comment: "",
    risk: '户外有风险，仅供参考',
    all_comments: '全部评论',
    message: '',
    postNum: '',
    commentnum: 1000,
    collectionnum: 9,
    forwardnum: 5,
    collectionSrc: {
      show: false,
      true: '/images/icon_comment_collection_sel.png',
      false: '/images/icon_comment_collection.png'
    },
    message: ''
  },



  onReady: function () {
  },



  addMessage: function (e) {
    this.setData({
      message: e.detail.value
    })
  },



  onLoad: function (options) {
    var that = this
    this.setData({
      id: options.id,
      name: options.name,
      url: options.url,
      view: options.view,
      intro: options.intro,
      createtime: options.createtime
    })
    that.setData({
      unionid: getApp().globalData.unionid
    })
    //获得视频的评论
    wx.request({
      url: app.appUrl + 'videoComments_get',
      data: {
        video_id: this.data.id,
        unionid: getApp().globalData.unionid
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("oooooo")
        console.log(res)
        if (res.data.error == "暂时没人评论！") { } else {
          that.setData({
            comment: res.data.videoComments_get.data,
            postNum: res.data.videoComments_get.data.length
          })
        }

      }
    })
    console.log(that.data.postNum)
  },



  onUnload: function () {
  },



  //评论
  addPost: function (e) {
    var that = this
    wx.request({
      //url: 'http://localhost/ds/index.php/home/video/test', //仅为示例，并非真实的接口地址
      url: app.appUrl + "videoComments_put", //仅为示例，并非真实的接口地址
      data: {
        video_id: that.data.id,
        contents: e.detail.value,
        unionid: getApp().globalData.unionid,
      },
      // method: 'POST',
      // header: {
      //     'content-type': 'application/x-www-form-urlencoded' // 默认值
      // },
      success: function (res) {
        console.log(res.data)
        if (res) {
          wx.showToast({
            title: '已发布评论！',
            duration: 2000
          });
        }
      }
    })
  },




  //收藏
  addCollection: function (e) {
    var that = this
    wx.request({
      url: app.appUrl + 'myFavorite_put', //仅为示例，并非真实的接口地址
      data: {
        tid: that.data.id,
        unionid: getApp().globalData.unionid,
        name: that.data.name,
        is_mark: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
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





  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.name,
      path: '/pages/video/video_detail?id=' + this.data.id + '&name=' + this.data.name + '&url=' + this.data.url + '&view=' + this.data.view + '&intro=' + this.data.intro + '&createtime=' + this.data.createtime,

      success: function (res) {
        // 转发成功
        if (res) {
          wx.showToast({
            title: '分享成功！',
            duration: 2000
          });
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  switchInput: function (e) {
    this.setData({
      isReply: !this.data.isReply,
      replyFocus: !this.data.replyFocus
    });
  },
  addMessage: function (e) {
    this.setData({
      message: e.detail.value
    })
  }

})