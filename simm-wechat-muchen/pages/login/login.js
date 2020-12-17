// pages/login/login.js
import UserApi from '../../services/userApi';
Page({
  data: {
    disabled: true,
    btnstate: 'default',
    account: '',
    password: ''
  },
  login: function(event){
    var that = this;
    if(that.data.account=="muchen" && that.data.password=="muchen"){
      //跳转
      //navigateTo 不能跳转 tab页签
      var user = new UserApi().getUser();
      wx.switchTab({
        url: '../daily/schedule',
      })
    }else{
      wx.showToast({
        title: '登录账号或密码错误，请重试',
        icon: 'none',
        duration: 2000
      })
    }
  },
  accountInput: function (event) {
    var content = event.detail.value.trim();
    if (content !== '') {
      this.setData({
        disabled: false, 
        btnstate: 'primary', 
        account: content
      });
    } else {
      this.setData({
        disabled: true,
        btnstate: 'default'
      });
    }
  },

  pwdBlur: function(e) {
    var password = e.detail.value;
    if (password != '') {
      this.setData({
        password: password
      });
    }
  }
})