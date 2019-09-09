// pages/index1/index1.js
const db = wx.cloud.database()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardlist:[],
    show: false,
    checked: false,
    radio1:"多冰",
    radio2:"多糖",
    global_milkteaID:1,
    totalMoney:0,
    tempMoney:0,//转化的一个中间量，因为submitBar单位是分，即100 分 = 1 元
    milktMoney1:0,  //这样命名是有原因，为了不与下文中的milkMoney重名
  },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('milktea').get({

      success: res => {
        this.setData({//箭头函数里面的this大有来头。
          cardlist: res.data
        });
        app.globalData.globalCardlist = res.data;
      }
     
    });
    wx.cloud.callFunction({//要放到一个小程序定义的function里面
      // 云函数名称
      name: 'getOpenid',
      // 传给云函数的参数
      complete: res => {
        app.globalData._openid = res.result.openid;
      }
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
  add:function(event){
    // console.log(event.target.id);
    this.setData({
      show:true,
      global_milkteaID: event.target.id,
      
    });
    
    var cl = [].concat(this.data.cardlist);
    // console.log(cl[0]._id);//测试是否赋值成功
    // console.log(event.target.id);//测试想要的id
    //todo 找出此时点击的奶茶的价格
    //一个循环
    var length1 = this.data.cardlist.length;
    var temp_id = event.target.id;
    var i = 0;
    for(;i<length1;i++){
      if(temp_id == cl[i]._id){//找到id 然后给全局变量赋值
        this.setData({
          milktMoney1:cl[i].price,
        });
        //console.log(cl[0].price);
        i = -1;
        break;
      }
     
    }
    //console.log(i);
    if(i!=-1){
      console.log("没有找到奶茶id");
    }
  },
  onChange:function(event) {
    this.setData({
      checked: event.detail
    });
  },
  onChange1:function(event) {
    this.setData({
      radio1: event.detail
    });
  },
  onChange2:function(event) {
    this.setData({
      radio2: event.detail
    });
  },
  AddSure:function(event){
    // todo
    //向数据库添加订单 需要获取到 奶茶的id+数量（已经定下为1了）
    //TotalMoney() 触发计算钱的函数
    //这里先用一系列的变量获取到奶茶id 数量自动为1 所以不用获取 配料radio1 radio2的值就是配料
    //console.log(this.data.radio1);
    this.setData({
      //关闭popup层
      show: false
    });
    db.collection('temp_order').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        milkteaID: this.data.global_milkteaID,
        desc: this.data.radio1 + '、' + this.data.radio2,
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 
        // res返回的只是自己创建的id。
        // console.log(res);
        //todo 根据全局变量milkMoney1 统计到totalmoney里面
      },
      
    });
    this.data.tempMoney += parseInt(this.data.milktMoney1);
    console.log(this.data.tempMoney);
    // var ele = document.getElementById("vant-submitbar");
    // ele.price=this.data.totalMoney;
    //console.log(this.data.milktMoney1);
    this.setData({
      //更改submitBar的价格
      totalMoney: this.data.tempMoney*100,
    });
  },
  onSubmit:function(event){
    //todo 打开购物车页面 此时查temp_order表，列出所有的订单（不用合并同类的）。
    // console.log(listData);
    db.collection('temp_order').where({
      _openid: app.globalData._openid
    })
    .get().then(res => {
      app.globalData.globalTempOrder = res.data;
      })
    // navigateTo先执行了.
    wx.navigateTo({
      // 避免过多的查询数据库，直接将数据传入下一个页面，or本地缓存？
      url: '../confirm/confirm'
    })
  },
  // TotalMoney:function(){
  //   //todo 负责从cardlist中找到符合要求的成员，然后对milkMoney赋值，
  //   this.data.totalMoney += this.data.milktMoney1; //其实不就是找到data对象里面的数据吗？页面刷新后 所有数据会被初始化~
  //   //也就是说每次刷新之后，这个钱都会被初始为0！！！！！！！！！！！！！！！！！！(还有退出小程序后，余额都会归零。)
  //   console.log(this.data.totalMoney);
  // },
})