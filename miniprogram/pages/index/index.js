//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //轮播图
    imgUrls: [
      '../../images/1.png',
      '../../images/3.png',
      '../../images/4.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad: function () {
    // 查找
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getPhone',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res.result.data);
        if (res.result.data.length == 0) {
          db.collection('user').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              phone: "unknwon"
            }
          })
            .then(res => {
              console.log(res)
            })
            .catch(console.error)
        }
        else {
          app.globalData.phone = res.result.data[0].phone

        }
      },
      fail: console.error
    })
    
  },
  golist: function () {
    wx.navigateTo({
      url: '../index1/index1'
    })
  },
})
