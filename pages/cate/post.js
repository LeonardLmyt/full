
let mixin = require('../../utils/mixin'),
    mx = null,
    app = getApp(),
    adds = {};

Page({



    data: {
        title: '',
        message: '',
        imgList: {},
        imgListkeys: {},
        layer: {
            show: true,
            state: '',
            content: ''
        },
        classifyAll: [],
        postShow: false,
        animationData: {},
        fname: '',
        showAddimg: false
    },



    onLoad: function () {
        let that = this;
        that.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })
        wx.request({
            url: app.appUrl + "classifyAll",
            data: {
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data.classifyAll)
                that.setData({
                    classifyAll: res.data.classifyAll
                })
            }
        })
    },




    onShow: function () {
        let that = this;
        mx = new mixin(that)
    },




    chooseImage: function () {
        let that = this,
            imgListLen = Object.keys(that.data.imgList).length;
        if (!(imgListLen > 8)) {
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    mx.layer({ content: '上传中...' });
                    let heLen = imgListLen + res.tempFilePaths.length,
                        allnum = heLen > 9 ? heLen - imgListLen - (heLen - 9) : res.tempFilePaths.length;
                    for (let item of res.tempFilePaths.slice(0, allnum).keys()) {
                        that.uploadFile(res.tempFilePaths.slice(0, allnum)[item], allnum, item);
                    }
                }
            })
        }
    },





    addTitle: function (res) {
        console.log(res.detail.value)
        this.setData({
            title: res.detail.value
        })
    },





    addMessage: function (res) {
        this.setData({
            message: res.detail.value
        })
    },




    delImg: function (e) {
        let src = e.currentTarget.dataset.src,
            index = e.currentTarget.dataset.index;
        this.data.imgListkeys.splice(index, 1)
        delete this.data.imgList[src]
        this.setData({
            imgList: this.data.imgList,
            imgListkeys: this.data.imgListkeys,
            showAddimg: false
        })
    },




    formSubmit: function (e) {
        var that = this
        if (this.data.imgList.length != 0) {
            // wx.getStorage({
            //     key: 'unionid',
            //     success: function (res) {
            //         that.setData({
            //             unionid: res.data
            //         })
            //     }
            // })
            if (this.data.title == "") {
                mx.layer({
                    content: '请先加个标题哟',
                    state: 'layer-errer',
                    time: 3
                })
                return false
            }
            if (this.data.message == "") {
                mx.layer({
                    content: '请先输入要发表的内容',
                    state: 'layer-errer',
                    time: 3
                })
                return false
            }
            wx.request({
                url: app.appUrl + "userPublish",
                //url:"http://localhost/ds/index.php/home/video/test",
                data: {
                    title: this.data.title,
                    contents: this.data.message,
                    unionid: wx.getStorageSync('unionid'),
                    fid: 0,
                    callbackImglist: Object.values(this.data.imgList),
                },

                header: {
                    'content-type': 'application/json' // 默认值
                },
                method: "POST",
                success: function (res) {
                    if (res) {
                        wx.showToast({
                            title: '已提交发布！',
                            duration: 3000
                        });
                    }

                }
            })
            this.setData({
                formdata: ''
            })
        }

    },






    uploadFile: function (img, allnum, index) {
        let that = this;
        if (!that.data.imgList[img]) {
            wx.uploadFile({
                url: app.appUrl + "yunImg",
                filePath: img,
                header: {
                    'content-type': 'multipart/form-data' // 默认值
                },
                method: "POST",
                name: 'file',
                formData: {
                },
                success: function (res) {
                    that.data.imgList[img] = res.data
                    that.setData({
                        imgList: that.data.imgList,
                        imgListkeys: Object.keys(that.data.imgList),
                        showAddimg: Object.keys(that.data.imgList).length === 9 ? true : false
                    })
                    if (allnum === (index + 1)) {
                        mx.close()
                    }
                }
            })
        } else {
            mx.layer({
                content: '图片已经存在',
                time: 3,
                state: 'layer-errer'
            })
        }
    },





    previewImage: function (e) {
        let that = this,
            src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: that.data.imgListkeys
        })
    }





})
