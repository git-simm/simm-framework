// pages/company/company.js
Page({
  data: {
    disabled: true,
    btnstate: 'default',
  },

  accountblur:function (e) {
    var content = e.detail.value.trim();
    if (content != '') {
      this.setData({
        disabled: false,
        btnstate: 'primary'
      });
    } else {
      this.setData({
        disabled: true,
        btnstate: 'default'
      });
    }
  },
/* 
code
:
"6"
company
:
"3"
loginName
:
"1"
mobile
:
"5"
password
:
"2"
switch
:
false
userName
: */
  formSubmit: function(e) {
    var user = new Object();
    var value = e.detail.value;
    user.account = value.loginName;
    user.password = value.password;
    user.company = value.company;
    user.userName = value.userName;
    user.code = value.code;
    user.switch = value.switch;
    user.mobile = value.mobile;

    wx.setStorageSync('user', user);
    wx.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 1000,
      success: function() {
        wx.navigateTo({
          url: '../login/login'
        })
      }
    });
  }
})