let app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
    this._loadData()
  },
  _loadData: function () {
    var that = this;
    var uid = wx.getStorageSync('unionid');
    wx.request({
      url: app.appUrl + "myPost?unionid=" + uid,
      method: "GET",
      header: { 'Accept': 'application/json' },
      success: function (res) {
        that.setData({
          record: res.data.myList.data,
        })
      }
    })
  }
})