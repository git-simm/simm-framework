import Vue from "vue";

/**权限指令**/
const has = Vue.directive("permission", {
  inserted: function(el, binding, vnode) {
    // 获取按钮权限
    var btn = binding.arg || binding.value;
    if (!btn || !Vue.prototype.$_has(btn)) {
      el.hidden = true;
      el.remove();
    }
  }
});

// 权限检查方法
let hasPermission = function(permission) {
  if (permission == null || MENU_BTNS == null) return true;
  //兼容界面刷新，vuex信息丢失的问题
  if (MENU_BTNS.length == 0) {
    MENU_BTNS = JSON.parse(window.sessionStorage.getItem("menuBtnId"));
  }
  //按逗号分隔
  var btns = permission.split(",") || [];
  return MENU_BTNS.some(a => btns.includes(a.url));
};

let getCode = (valid, param) => {
  for (var key in param) {
    if (valid && valid(key)) {
      return param[key];
    }
  }
};

Vue.prototype.$_has = hasPermission;

//----- 设置缓存读取 begin ----------
let MENU_BTNS = [];
//----- 设置缓存读取 end ----------
export default {
  hasPermission,
  getCode,
  /**
   * 设置vue缓存
   * @param {*} menuBtns
   */
  setMenuBtns: function(menuBtns) {
    MENU_BTNS = menuBtns;
  }
};
