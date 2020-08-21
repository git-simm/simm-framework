/**
 * 获取顶层页面的权限缓存(portal-ui页面)
 */
let purchaseAuth = "purchase_auth";
let getTopAuthData = function (callback) {
  window.top.postMessage({ type: "getAuth", key: purchaseAuth }, "*");
};
/**
 * 设置顶层权限缓存
 */
let setTopAuthData = function (data, event) {
  window.top.postMessage(
    { type: "setAuth", key: purchaseAuth, value: data },
    event.origin
  );
};
/**
 * 获取地址
 */
let getUrl = function (relativePath) {
  if (relativePath.startsWith("http")) {
    return relativePath;
  }
  if (!relativePath.startsWith("/")) {
    relativePath = "/" + relativePath;
  }
  return window.location.origin + relativePath;
};
let wrapParam = function (p) {
  p.systemId = "product";
  p.url = getUrl(p.url);
  return p;
};
/**
 * 打开新的tab页签
 * @param {*} p
 */
let openTab = function (p) {
  window.top.postMessage(
    { type: "openTab", param: wrapParam(p) },
    window.sessionStorage.getItem("portalOrigin")
  );
};
/**
 * 关闭tab页签
 * @param {*} url
 */
let closeTab = function (url) {
  var p = { url: url };
  window.top.postMessage(
    { type: "closeTab", param: wrapParam(p) },
    window.sessionStorage.getItem("portalOrigin")
  );
};
/**
 * 刷新tab页签
 * @param {*} url
 */
let refreshTab = function (url) {
  var p = { url: url };
  window.top.postMessage(
    { type: "refreshTab", param: wrapParam(p) },
    window.sessionStorage.getItem("portalOrigin")
  );
};
let param = {};
/**
 * 获取rbac权限数据
 */
let getAuth = function (authData, event) {
  let initLogin = param.initLogin;
  if (authData != null) {
    authData.portalOrigin = event.origin;
    initLogin(authData);
  } else {
    param.httpUtil.post({
      url: "/adminUser/getUserPermission.json",
      loading: false,
      succ: function (data) {
        //假如已经在rbac平台登录过，则设置相关用户信息，准备设置vuex信息
        var user = wrapData(data.data);
        user.portalOrigin = event.origin;
        setTopAuthData(user, event);
        initLogin(user);
      }
    });
  }
};
/**
 * 权限数据
 * @param {*}} rbacData
 */
let wrapData = function (rbacData) {
  var user = {};
  user.loginUser = rbacData.admin_user_name;
  user.userInfo = rbacData;
  user.userInfo.userType = rbacData.user_type;
  user.menuButtons = rbacData.menuButtons;
  user.token = null;
  user.tokenid = rbacData.id;
  return user;
};
/**
 * 监听消息
 * @param {*} callback
 */
let listenMessage = function (callback) {
  window.addEventListener(
    "message",
    function (event) {
      if (
        callback &&
        event.data.type === "auth" &&
        event.data.key === purchaseAuth
      ) {
        callback(event.data.value, event);
      }
    },
    false
  );
};
//启动监听事件
listenMessage(getAuth);
export default {
  setParam(p) {
    param = p;
  },
  getTopAuthData,
  //打开portal的tab页签
  openTab,
  closeTab,
  refreshTab
};
