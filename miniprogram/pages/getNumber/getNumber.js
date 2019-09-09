var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    sumMonney: 0,
    time:0,
    orderNumber:0,
    queueNumber:0,
    // cutMonney: 0,
    // cupNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime();
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      cartList: app.globalData.globalOrder,
      sumMonney: app.globalData.totalMoney/100,
      // 生成尽量不重复的取餐码
      queueNumber: app.globalData.globalOrder[0]._id.substring(9, 12) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10),
      // 生成尽量不重复的订单号码
      orderNumber: app.globalData.globalOrder[0]._id+ Math.floor(Math.random() * 10)
      // cutMonney: wx.getStorageSync('sumMonney') > 19 ? 3 : 0,
      // cupNumber: wx.getStorageSync('cupNumber'),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getTime: function () {
    var time = util.formatTime(new Date())
    //为页面中time赋值
    this.setData({
      time: time
    })
    //打印
    console.log(time)
  }

})