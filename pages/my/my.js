var app = getApp()
Page({
    data: {
    },
    onLoad: function (options) {
        var that = this
        wx.getStorage({
            key: 'nickname',
            success: function (res) {
                that.setData({
                    nickname: res.data
                })
            }
        })
        wx.getStorage({
            key: 'avatarurl',
            success: function (res) {
                that.setData({
                    avatarurl: res.data
                })
            }
        })
        wx.getStorage({
            key: 'unionid',
            success: function (res) {
                that.setData({
                    unionid: res.data
                })
            }
        })
    }
})