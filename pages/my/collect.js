// pages/my/collect.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myfavorite: [],
    id: '',
    next_page_url: '',
    unionid: wx.getStorageSync('unionid')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this._loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  _loadData: function () {
    var that = this;
    var uid = wx.getStorageSync('unionid');
    wx.request({
      url: app.appUrl + "myFavorite?unionid=" + uid,
      method: "GET",
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log("kkkkkkkkkkkkkkkk")
        console.log(res)
        that.setData({
          myfavorite: res.data.myFavorite.data,
          next_page_url: res.data.myFavorite.next_page_url
        })
      }
    })
  },

  /**
* 小程序自带函数 分页滚动
*/
  onReachBottom: function () {
    var that = this

    wx.request({
      url: that.data.next_page_url,
      data: { unionid: wx.getStorageSync('unionid') },
      header: { 'Accept': 'application/json' },
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.data.myFavorite.next_page_url != that.data.next_page_url) {
          that.setData({
            myfavorite: that.data.myfavorite.concat(res.data.myFavorite.data),
            next_page_url: res.data.myFavorite.next_page_url
          })
        }
      }
    })
  }
})