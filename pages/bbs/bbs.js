const app = getApp()
const util = require("../../utils/util")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTopItem: 0,
    swiperHeight: 0,
    topTabItems: [],
    isToLowerVersion: false,
    forum_data: [],
    tid: '',
    next_page_url: '',
    unionid: '',
    fid: "",
    scrollTop: [],
    pagecache: [],
    getAddStatus: true,
    topIcon: {
      animationData: '',
      show: true,
      change: false
    },
    windowHeight: 0,
    loading: {
      scrolltop: 0,
      s_y: 0
    }
  },
  onShow: function (options) {
    let that = this
    that.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    if (that.data.fid === "") {
      wx.request({
        url: app.appUrl + "forum_list",
        data: {
          unionid: wx.getStorageSync('unionid'),
        },
        method: "GET",
        header: { 'Accept': 'application/json' },
        success: function (res) {
          let scrollTop = [],
            pagecache = [],
            forum_data = [];
          res.data.top_list.forEach(function () {
            scrollTop.push(0)
            pagecache.push({ load: false, num: 1, loadover: false })
            forum_data.push([])
          })
          that.setData({
            topTabItems: res.data.top_list,
            scrollTop: scrollTop,
            pagecache: pagecache,
            forum_data: forum_data
          })
          that.getList(res.data.top_list[0].fid, 1, false) //初始化加载数据
          that.ani(false)
        }
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: res.windowHeight - (res.windowWidth / 750 * 86),
          windowHeight: res.windowHeight
        });
      }
    })
  },





  scrollTap: function (e) { //点击切换数据
    var that = this,
      num = e.currentTarget.dataset.id;
    that.setData({
      currentTopItem: e.currentTarget.dataset.id
    })
    if (!that.data.forum_data[num].length) {
      this.getList(e.currentTarget.dataset.fid, that.data.pagecache[num].num, that.data.pagecache[num].loadover)
    }
    that.ani(false)
  },




  getList: function (fid, page, loadover) { //加载数据
    var that = this
    if (that.data.getAddStatus) {
      that.setData({
        getAddStatus: false
      })
      wx.request({
        url: app.appUrl + "forum_list2/" + fid + "?page=" + page,
        method: "GET",
        header: { 'Accept': 'application/json' },
        success: function (res) {
          let num = that.data.currentTopItem
          that.data.pagecache[num].num += 1
          that.data.forum_data[num].push(...res.data.forum_list.data)
          that.setData({
            forum_data: that.data.forum_data,
            next_page_url: res.data.next_page_url,
            pagecache: that.data.pagecache,
            getAddStatus: true
          })
          if (res.data.forum_list.data.length === 0) {
            that.data.pagecache[num].loadover = true
            that.setData({
              pagecache: that.data.pagecache
            })
          }
        }
      })
    }
  },




  bindChange: function (e) {
    var that = this;
    that.setData({ currentTopItem: e.detail.current });
    that.ani(false)
  },




  goTop: function () { //回到顶部
    let that = this;
    that.data.scrollTop[that.data.currentTopItem] = 0
    this.setData({
      scrollTop: that.data.scrollTop
    })
  },



  loadMore: function (e) { //滚动加载更多
    var that = this,
      num = that.data.currentTopItem
    that.getList(e.currentTarget.dataset.fid, that.data.pagecache[num].num, that.data.pagecache[num].loadover)
  },
  ani: function (b) {
    let that = this
    if (that.data.topIcon.change !== b) {
      console.log('change' + that.data.topIcon.change, b)
      if (b) {
        that.animation.height('110rpx').step()
        that.data.topIcon.show = false
        that.data.topIcon.animationData = that.animation.export()
      } else {
        that.animation.height(0).step()
        that.data.topIcon.show = true
        that.data.topIcon.animationData = that.animation.export()
      }
      that.data.topIcon.change = b
      that.setData({
        topIcon: that.data.topIcon
      })
    }
  },
  scroll: function (e) {
    this.ani(e.detail.scrollTop > this.data.windowHeight)
    this.data.loading.scrolltop = e.detail.scrollTop
    this.setData({
      loading: this.data.loading
    })
  },
  touchstart: function (e) {
    let that = this
    that.data.loading.s_y = e.changedTouches[0].pageY
    that.setData({
      loading: that.data.loading
    })
  },
  touchend: function (e) {
    let that = this
    if (e.changedTouches[0].pageY - that.data.loading.s_y > 150 && !that.data.loading.scrolltop) {
      util.showLoading();//加载新数据，乱序，无浏览过的数据
      console.log('分类id' + e.currentTarget.dataset.fid)
    }
  }
})