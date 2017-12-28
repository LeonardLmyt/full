var app = getApp()
Page({
  data: {
    list: '',
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      authorid: options.authorid,
      author: options.author,
      avatar: options.avatar
    })
    wx.request({
      url: app.appUrl + 'userPost', //仅为示例，并非真实的接口地址
      data: {
        authorid: that.data.authorid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("yyyyyyyyyyyyyyyy")
        console.log(res)
        that.setData({
          list: res.data.userList.data
        })
        console.log(that.data.list)
      }
    })
  },
  //关注作者请求
  addMyfollow_put: function (e) {
    var that = this
    wx.request({
      url: app.appUrl + 'myfollow_put', //仅为示例，并非真实的接口地址
      data: {
        authorid: that.data.authorid,
        unionid: getApp().globalData.unionid,
        author: that.data.author
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: '关注该作者成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})