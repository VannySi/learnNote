//获取应用实例
var app = getApp();
Page({
  data: {
    
  },
  onLoad: function () {
    var that = this
    
  },
  readily: function(){
    wx.navigateTo({
      url: '../readily/readily',
    })
  },
  ads: function(){
    wx.navigateTo({
      url: '../index/index',
    })
  }
})