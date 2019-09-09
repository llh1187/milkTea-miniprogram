// pages/mine/mine.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:"",
    avatarUrl:"",
    phoneNumber:"unkonwn",
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        that.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        })
      }
    });
    this.setData({
      phoneNumber: app.globalData.phone
    })
  },
  bitphone:function(){
    wx.makePhoneCall({
      phoneNumber: '1234567890' 
    })
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    this.setData({
      phoneNumber: event.detail
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updatePhone',
      // 传给云函数的参数
      data: {
        phone: event.detail
      },
      success: function (res) {
        console.log(res.result)
      },
      fail: console.error
    })
  },
  

 
})