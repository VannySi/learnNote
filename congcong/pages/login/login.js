//获取应用实例
var app = getApp();
Page({
  data: {
    motto: '登录中...',
    userInfo: {},
    loginChange: -1 //登录失败时为0, 登录成功为1， 未响应为-1
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo: app.globalData.userInfo
    });
    that.loginState();
    app.getLogin(function(data){
      that.setData({
        loginChange: data.Success ? 1 : 0
      });
    });
    setTimeout(function(){
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
          app.getLogin(function (res) {
            that.setData({
              loginChange: res ? 1 : 0
            });
          });
        },
        fail: function () {
          //登录态过期
          app.getUserInfo(function (id) {
            if (id) {
              app.getLogin(function (res) {
                that.setData({
                  loginChange: res ? 1 : 0
                });
              });
            }
          });
        }
      })
    }, 3000);
  },
  onShow: function (){
    if (this.loginChange < 0){
      that.loginState();
    }
  },
  loginState: function(){
    var that = this;
    var flag = that.data.loginChange;
    var motto = '登录中';
    var loading = ['.', '..', '...', ''];
    if (flag < 0) {
      var index = that.data.motto.length - 3;
      motto = motto + loading[index];
      setTimeout(function(){
        that.loginState();
      }, 500)
    } else if (flag) {
      motto = '登陆成功！';
    } else {
      motto = '登录失败，请注册';
    }
    that.setData({
      motto: motto
    });
  }
})