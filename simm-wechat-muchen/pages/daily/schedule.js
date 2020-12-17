// index.js
// 日记聚合页

const config = require("../../config");

var app = getApp();

Page({

  data: {
    // 日记列表
    // TODO 从server端拉取
    diaries: null,

    // 是否显示loading
    showLoading: false,
    latitude: 0,
    longitude: 0,
    // loading提示语
    loadingMessage: '',
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      // iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      clickable: true
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取当前的地理位置、速度
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        //赋值经纬度
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers:[{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
    })
  },
  onMyPostion: function (event) {
    var that = this
    //获取当前的地理位置、速度
    wx.getLocation({
      type: 'gcj02', 
      success: function (res) {
        //赋值经纬度
        // that.setData({
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        // });
        wx.openLocation({
          type: 'gcj02',
          latitude: res.latitude,
          longitude: res.longitude,
          name: '我的位置',
          scale: 28
        })
      }
    })
  },
  //导航
  onGuideTap: function (event) {
    var lat = Number(event.currentTarget.dataset.latitude);
    var lon = Number(event.currentTarget.dataset.longitude);
    var bankName = event.currentTarget.dataset.bankname;
    wx.openLocation({
      // type: 'gcj02',
      latitude: lat,
      longitude: lon,
      name: bankName,
      scale: 28
    })
  },
})