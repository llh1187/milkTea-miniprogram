// pages/confirm/confirm.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirmOrder: [],
    tempOrder:[],
    _openid:0,
    show:false,
    confirmMoney:0,
    tMoney: 0,  //弹出付款窗口引用的订单总额。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
  this.AddDetail(); 
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  AddDetail: function (){//在别的函数调用这个函数，函数内部用this.data.xxx获取不到想要的数据。
    // 将数组tempCardlist里面的需要的信息和全局变量所需要的信息，整合到一块去，然后逐个存到confirmOrder数组里面去。
    // 考虑到一般一个用户一次点的奶茶都是一两杯，所以以用户订单为原点，进行循环获取所需要的信息。
    // 可以考虑数组 confirmOrder
    // var n = 0;
    var tdtc = app.globalData.globalTempOrder;
    var agg = app.globalData.globalCardlist;
    var money = 0;
    
    // 不知道为什么，这个 []的json对象不能这么赋值，但是我自己用node来测试就可以，真是奇怪。  事实证明，可以赋值
    for (var i in tdtc){
      for (var j in agg) {
        // 找到对应的奶茶，然后获取对应的价格以及标题
        // 不考虑找不到的情况
        if (tdtc[i].milkteaID == agg[j]._id){
          // 存进新的数组里面？恐怕有点复杂，不如直接放进tempCardlist里面
          //做到后面再考虑放哪里合适吧
          tdtc[i].price = agg[j].price;
          tdtc[i].title = agg[j].title;
          money = money + agg[j].price;
        }
        
      }
      
    }
    this.setData({
      tempOrder: tdtc,
      confirmMoney:money*100,
      tMoney: money
    })
  },
  delete:function(event){
    // todo
    // 点击按钮,卡片会消失. 怎么做到呢?
    // 我能想到的就是将tempOrder改一下,然后重新渲染?
    // console.log(event.target.id)
    var tempMoney = this.data.confirmMoney/100;
    for(var i in this.data.tempOrder){
      if (this.data.tempOrder[i]._id == event.target.id){
        tempMoney -= this.data.tempOrder[i].price;
        this.data.tempOrder.splice(i,1)
      }
    }
    this.setData({
      tempOrder: this.data.tempOrder,
      confirmMoney:tempMoney*100,
      tMoney: tempMoney
    })
    // 还要同时删除temp_order上的订单。
    //需要该订单的_id
    db.collection('temp_order').doc(event.target.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })

  },
  payMoney:function(){
    if (this.data.confirmMoney > 0) {
      this.setData({
        show: true,
      })
    }
    else {
      wx.showToast({
        icon: 'none',
        title: '您还没有下单，请先下单吧~',
      })
    }
    
  },
  // 点击确认付款
  ok:function(){
    //todo
    //要将 tempOrder里面desc milkteaID都一样的，合并在一起，并且删除不需要的属性，比如price title
    // 先合并再删除，然后赋值给confirmOrder
    
    this.merge();
    var confirmOrder = this.data.confirmOrder;
    // 将confirmOrder写进表order里面
    for (var i in confirmOrder){
      db.collection('order').add({
        // data 字段表示需新增的 JSON 数据
        // _openid 以及 id自动生成的
        data: {
          count: confirmOrder[i].count,
          milkteaID: confirmOrder[i].milkteaID,
          mixture: confirmOrder[i].desc
        }
      })
        .then(res => {
          console.log(res)
        })
        .catch(console.error)
    }
    app.globalData.totalMoney = this.data.confirmMoney;//分为单位的。
    //删除该用户的订单 所以要获取到该用户的_openid
    //app.globalData.globalOrder[0]._openid就是想要的
    // 云端直接可以鉴别_openid 可以不用上传
    wx.cloud.callFunction({
      // 云函数名称
      name: 'batchDelete',
      // 传给云函数的参数
      data: {
        // _openid: app.globalData.globalOrder[0]._openid
      },
    })
      .then(res => {
        console.log(res.result) 
      })
      .catch(console.error)
    if(this.data.confirmMoney>0){
      wx.navigateTo({
        // 避免过多的查询数据库，直接将数据传入下一个页面，or本地缓存？
        url: '../getNumber/getNumber'
      })
    }
    else{
      wx.showToast({
        title: '您没有还没有下单，快去下单吧~',
      })
    }
  },
  // 合并同类项 增加个数量
  merge:function(){
    var t1 = this.data.tempOrder;
    
    t1[0].count = 1;
    for (var i = 0; i < t1.length; i++) {
       // 增加属性：数量
      t1[i].count = 1;
      for (var j = i + 1; j < t1.length; j++) {
        if (t1[i].milkteaID == t1[j].milkteaID ) {
          if (t1[i].desc == t1[j].desc){
            //  属性自增1
            t1[i].count++;
            
            // 删除重复的数据
            t1.splice(j, 1);
            // 相应地 t1的长度会减少1，所以j也要减少1。
            j--;
          }
        
        }
      }
    }
    app.globalData.globalOrder = t1;
    // console.log(t1);
    // console.log(app.globalData.globalOrder);
    // this.deleteOther(t1);
    // 将t1写进去confirmOrder里面。
    //顺便写进全局变量里面
    
    
    this.setData({
      confirmOrder: t1
    })
  },
  
})