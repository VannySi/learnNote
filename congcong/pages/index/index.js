//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    date: '',
    time: new Date().getHours() + ':' + new Date().getSeconds(),
    source: [],
    activityId: 'testzongpeng'
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
    // 获取活动Id
    wx.request({
      url: "https://cn2service.ictr.cn/api/WeChatAPI/SearchPhotoGetAdvertisement",
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
    // wx.getSavedFileInfo({
    //   filePath: '../../34-L.jpg', //仅做示例用，非真正的文件路径
    //   success: function (res) {
    //     console.log(res)
    //     var time = res.createTime;
    //     console.log(new Date(parseInt(time) * 1000).toLocaleString());
    //   }
    // })
    var date = new Date().toLocaleDateString().split('/');
    date[1] = date[1] < 10 ? '0' + date[1] : date[1];
    date[2] = date[2] < 10 ? '0' + date[2] : date[2];
    this.setData({
      date: date.join('-')
    })
    
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    var that = this;
    var path = this.data.source;
    var val = e.detail.value;
    var flag = true; //是否通过验证
    if(path.length){
      // for (var i in val) {
      //   if ('Mobile' === i && !(/^1[34578]\d{9}$/.test(val[i]))) {
      //     flag = false;
      //     // 请输入正确的手机号
      //     wx.showModal({
      //       title: "错误",
      //       content: '请确认正确的手机号',
      //       showCancel: false,
      //       confirmText: "确认",
      //       success: function (res) {
      //       }
      //     });
      //   } else if (!val[i] && i.indexOf('des') < 0) {
      //     flag = false;
      //     wx.showModal({
      //       title: "错误",
      //       content: '存在未填写项，请补充完整再提交',
      //       showCancel: false,
      //       confirmText: "确认",
      //       success: function (res) {
      //       }
      //     });
      //   }
      //   if (!flag) {
      //     break;
      //   }
      // }
      if (!(/^1[34578]\d{9}$/.test(val['Mobile']))){
        flag = false;
        // 请输入正确的手机号
        wx.showModal({
          title: "错误",
          content: '请确认正确的手机号',
          showCancel: false,
          confirmText: "确认",
          success: function (res) {
          }
        });
      }
      // 上传图片
      if (flag) {
        var groupId = new Date().getTime();
        var bug = true; //是否上传成功
        for (var i = 0; i < path.length; i++) {
          console.log(val['des[' + i + ']']);
          wx.uploadFile({
            url: 'https://cn2service.ictr.cn/api/WeChatAPI/SearchPhotoUploadAdvertisement',
            filePath: path[i],
            name: 'file',
            formData: {
              activityId: that.data.activityId,
              openId: getApp().globalData.openId,
              groupId: groupId,
              des: val['des[' + i + ']']
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              console.log(data, data.Success);
              if (!data.Success) {
                bug = false;
                wx.showModal({
                  title: '提示',
                  content: '图片上传失败，请重新上传',
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
          if (!bug) {
            break;
          }
        }
        if (bug) {
          wx.request({
            url: 'https://cn2service.ictr.cn/api/WeChatAPI/SaveImageGroupInfoAdvertisement',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: {
              GroupID: groupId,   // 组名
              Description: '', // 描述
              ProgramName: val['ProgramName'], //节目名称
              Channel: val['Channel'], //频道
              PlayTime: val['date'] + ' ' +  val['time'], //播出时间
              Mobile: val['Mobile'], //用户手机号 
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
    } else {
      wx.showModal({
        title: "错误",
        content: '请至少上传一张照片',
        showCancel: false,
        confirmText: "确认",
        success: function (res) {
        }
      });
    }
    
  }
})
