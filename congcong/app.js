//app.js
App({
  onLaunch: function () {
    this.getUserInfo();
  },
  getUserInfo: function(callback){
    var that = this;
    // 微信登录
    wx.login({
      success: function (res) {
        // 获取用户信息
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
        if (res.code) {
          // 获取用户的openId
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session',
          //   data: {
          //     appid: 'wx618260b24ca96252',
          //     secret: 'c2018ecabf66f91a78fd05d8f2428395',
          //     js_code: res.code,
          //     grant_type: 'authorization_code'
          //   },
          //   success: function (result) {
          //     // console.log(result.data.openid)
          //     that.globalData.openId = result.data.openid;
          //     // that.getLogin(callback);
          //     typeof callback == "function" && callback(that.globalData.openId);
          //   }
          // })
        } else {
          console.log('获取用户登录状态失败！' + res.errMsg)
        }
      }
    });
  },
  getLogin: function(callback){
    var that = this;
    var Parser = require('/lib/xmldom/dom-parser');
    //发起网络请求，用微信登录网站
    wx.request({
      url: 'https://cn2service.ictr.cn/CN2AppWebForWeChatService.asmx/RegistUserLoginFRWeChat',
      data: {
        WeChatUserId: that.globalData.openId
      },
      method: 'POST',
      dataType: 'xml',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res.data)
        // 解析返回值（XML转JSON）
        var XMLParser = new Parser.DOMParser();
        var doc = XMLParser.parseFromString(res.data);
        var stringElement = doc.getElementsByTagName('string')[0];
        var data = JSON.parse(stringElement.firstChild.nodeValue);
        // 函数回调
        typeof callback == "function" && callback(data.Success);
        // 登陆成功跳转图片上传，不成功弹提示框去注册
        if (data.Success) {
          setTimeout(function () {
            // 关闭当前页面，跳转到图片上传。
            wx.redirectTo({
              url: '/pages/select/select'
            })
          },1000)
        } else {
          wx.showModal({
            title: "错误码：" + data.Msg,
            content: "您还没有注册,请先注册",
            showCancel: false,
            confirmText: "注册",
            success: function (res) {
              if (res.confirm) {
                // 关闭当前页面，跳转到注册
                wx.redirectTo({
                  url: '/pages/register/register'
                })
              }
            }
          });
        }
      }
    })
  },
  // 全局信息
  globalData:{
    userInfo:null,
    openId: ' wx618260b24ca96252'
  }
})