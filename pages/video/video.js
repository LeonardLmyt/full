var app = getApp()
Page({
    data: {
        id: null,
        img: null,
        name: null,
        url: null,
        view: null,
        video_List: [],
        nickk: "",
        next_page_url:'',

    },



    onLoad: function (options) {
        var that = this;
        wx.request({
            //url:"http://localhost/ds/index.php/home/video/test",
            url: app.appUrl+"videoList",
            data: {
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log("yyyyyyyyyyyy")
                console.log(res)
                that.setData({
                    video_List: res.data.videoList.data,
                    next_page_url:res.data.videoList.next_page_url
                })
            }
        })
    },



    onReady: function () {
    },



    //向下分页
    loadMore: function () {
        var that = this
        wx.request({
            url: that.data.next_page_url,
            data: {},
            header: { 'Accept': 'application/json' },
            method: "GET",
            success: function (res) {
                console.log("tttttttttt")
                console.log(res)
                if (that.data.next_page_url != res.data.videoList.next_page_url) {
                    that.setData({
                        video_List: that.data.video_List.concat(res.data.videoList.data),
                        next_page_url: res.data.videoList.next_page_url
                    })
                }
            }
        })
    },



})