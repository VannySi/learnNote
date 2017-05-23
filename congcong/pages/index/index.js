//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    date: '',
    time: new Date().getHours() + ':' + new Date().getSeconds(),
    source: []
  },
  // 日期选择器
  bindDateChange: function(e) {
    var date = e.detail.value;
    this.setData({
      date: date
    })
  },
  // 时间选择器
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 调起手机相册
  uploadImage: function(){
    var that = this;
    wx.chooseImage({
      count: 6 - that.data.source.length,
      //original原图，compressed压缩图
      sizeType: ['compressed'],
      //album来源相册 camera相机 
      sourceType: ['camera','album'],
      //成功时会回调
      success: function(res) {
          //重绘视图
          console.log(res);
          that.setData({
            source: that.data.source.concat(res.tempFilePaths)
          })
          var path = res.tempFilePaths;
          for(var i = 0; i < path.length; i++){
            wx.getSavedFileInfo({
              filePath: path[i], //仅做示例用，非真正的文件路径
              success: function (res) {
                console.log(res)
                var time = res.createTime;
                console.log(new Date(parseInt(time) * 1000).toLocaleString());
              }
            })
            // wx.getImageInfo({
            //   src: path[i],
            //   success: function (res) {
            //     console.log(res)
            //   }
            // })
          }
        }
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSavedFileInfo({
      filePath: '../../34-L.jpg', //仅做示例用，非真正的文件路径
      success: function (res) {
        console.log(res)
        var time = res.createTime;
        console.log(new Date(parseInt(time) * 1000).toLocaleString());
      }
    })
    var date = new Date().toLocaleDateString().split('/');
    date[1] = date[1] < 10 ? '0' + date[1] : date[1];
    date[2] = date[2] < 10 ? '0' + date[2] : date[2];
    this.setData({
      date: date.join('-')
    })
    
  }
})
