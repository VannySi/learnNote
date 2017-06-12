// readily.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: [],
    describe: '',
    activityId: 'testzongpeng'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取活动Id
    wx.request({
      url: "https://cn2service.ictr.cn/api/WeChatAPI/SearchPhotoGetWeeklyPhotograph",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        // that.setState({
        //   activityId: res.data
        // });
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
  // 调起手机相册
  uploadImage: function () {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.source.length,
      //original原图，compressed压缩图
      sizeType: ['compressed'],
      //album来源相册 camera相机 
      sourceType: ['camera', 'album'],
      //成功时会回调
      success: function (res) {
        //重绘视图
        that.setData({
          source: that.data.source.concat(res.tempFilePaths)
        })
      }
    })
  },
  textChange: function(e){
    this.setData({
      describe: e.detail.value
    })
  },
  formSubmit: function(e){
    var that = this;
    var path = this.data.source;
    // if (path.length && this.data.describe) {
    if (path.length){
      var groupId = new Date().getTime();
      var bug = false; //是否上传成功
      for (var i = 0; i < path.length; i++) {
        wx.uploadFile({
          url: 'https://cn2service.ictr.cn/api/WeChatAPI/SearchPhotoUploadWeeklyPhotograph',
          filePath: path[i],
          name: 'file',
          formData: {
            activityId: that.data.activityId,
            openId: getApp().globalData.openId,
            groupId: groupId
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data);
            if (!data.Success){
              bug = true;
              wx.showModal({
                title: '提示',
                content: '上传失败，请重新上传',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            }
          }
        });
        if(bug){
          break;
        }
      }
      if(!bug){
        wx.request({
          url: 'https://cn2service.ictr.cn/api/WeChatAPI/SaveImageGroupInfoWeeklyPhotograph',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          data: {
            GroupID: groupId,
            Description: that.data.describe,
            tags1: '',
            tags2: ''
          },
          success: function (res) {
            console.log(res.data);
            if (!res.data) {
              wx.showModal({
                title: '提示',
                content: '上传失败，请重新上传',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '上传成功',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    // 关闭当前页面，跳转到注册
                    wx.redirectTo({
                      url: '/pages/select/select'
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            }
          },
          fail: function (res) {
            //fail( res );
          }
        });
      }
    }
  }
})