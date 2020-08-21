// Import System requirements
import Vue from "vue";
import $ from "jquery";
import Resource from "vue-resource";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import {
  routes
} from "./routes";
import store from "./store";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
// Import Helpers for filters
// import { domain, count, prettyDate, pluralize } from './filters'
import Icon from "vue-awesome/components/Icon";
Vue.component("icon", Icon);
// Import Views - Top level
// import echarts 图表(按需加载)
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

import AppView from "./components/App.vue";
// 【第三方】数学计算
import mathjs from "mathjs";
Vue.prototype.$math = mathjs;

import VJsoneditor from 'v-jsoneditor';
Vue.use(VJsoneditor);

// 【第三方】弹出式菜单
import contentmenu from "v-contextmenu";
import "v-contextmenu/dist/index.css";
Vue.use(contentmenu);
// 【第三方】剪切板
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);
// 切分面板
import VueSplit from 'vue-split-panel'
Vue.use(VueSplit)
// 【第三方】layer弹层公用库
import layer from "vue-layer";
import "vue-layer/lib/vue-layer.css";
var layerInstance = layer(Vue, {
  msgtime: 2, //目前只有一项，即msg方法的默认消失时间，单位：秒
  shadeClose: false, //点击遮盖层不关闭界面
});
Vue.prototype.$layer = layerInstance;

// 校验框架
import validatorJs from "validator";
Vue.prototype.$validator = validatorJs;
// 【食享会-框架】http请求封装
import shixh from "@/components/shixh/index";
Vue.use(shixh);
import httpUtil from "@/common/utils/HttpUtil";
import cacheUtil from "@/common/utils/CacheUtil";
import layerUtil from "@/common/utils/LayerUtil";
import permission from "@/common/utils/Permission";
import commonUtil from "@/common/utils/CommonUtils";
import metadata from "@/common/entity/metadata";
import flows from "@/common/process/metadata";
import portalAuthHandler from "./portal-auth-handler";
import socketUtil from "@/common/utils/SocketUtil";
//打开portal的新tab
Vue.prototype.$openTab = portalAuthHandler.openTab;
Vue.prototype.$closeTab = portalAuthHandler.closeTab;
Vue.prototype.$refreshTab = portalAuthHandler.refreshTab;
Vue.prototype.$httpUtil = httpUtil;
Vue.prototype.$cacheUtil = cacheUtil;
Vue.prototype.$layerUtil = layerUtil;
Vue.prototype.$commonUtil = commonUtil;
Vue.prototype.$permission = permission;
Vue.prototype.$metadata = metadata;
Vue.prototype.$flows = flows;
// 全局注册
Vue.prototype.$socketUtil = socketUtil;
// Import Install and register helper items
import onlyNumber from "@/common/directive/numberJs";
Vue.use(onlyNumber); //添加此行=>使用该全局指令
// Resource logic
Vue.use(Resource);

Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.use(Viewer, {
  defaultOptions: {
    // toolbar: false
  },
});
Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push((request, next) => {
  next();
});
// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: "history",
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || {
      x: 0,
      y: 0
    };
  },
});

let initLoginData = function (store) {
  if (window.sessionStorage) {
    if (store.state.user !== window.sessionStorage.getItem("user")) {
      store.dispatch("SET_USER", window.sessionStorage.getItem("user"));
      store.dispatch("SET_TOKEN", window.sessionStorage.getItem("token"));
      store.dispatch("SET_TOKENID", window.sessionStorage.getItem("tokenid"));
      let userinfo = JSON.parse(window.sessionStorage.getItem("userinfo"));
      let dic = new Map(userinfo.arr);
      userinfo.dic = dic;
      store.dispatch(
        "SET_USERINFO",
        userinfo
      );
    }
  }
};
/**
 * 登录验证
 */
router.beforeEach((to, from, next) => {
  //记录上个路由的地址
  store.dispatch("SET_FROM", from);
  if (to.path == "/blank") {
    //先加载空白页，解决嵌入portal，异步请求数据时页面黑屏的问题
    next();
    return;
  }
  if (to.path == "/") {
    //主动跳转到首页
    next({
      path: "/index",
    });
    return;
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    var login = () => {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      });
    };
    // true用户已登录， false用户未登录
    var isLogin = false;
    var user = window.sessionStorage.getItem("user");
    var ssoLogin = window.sessionStorage.getItem("ssoLogin");
    if (ssoLogin == 1) {
      //sso已经登录
      isLogin = true;
      if (from.path == "/") {
        //首次加载
        isLogin = false;
      }
    } else if (user !== "null" && user !== "undefined") {
      isLogin = Boolean(user);
    }
    //window.self !== window.top 说明嵌套在iframe中
    if (!isLogin && window.self !== window.top) {
      //先加载一个空白页
      next({
        path: "/blank"
      });
      portalAuthHandler.setParam({
        httpUtil: httpUtil,
        initLogin: (user) => {
          cacheUtil.setUser(user);
          //权限信息处理
          permission.setMenuBtns(user.menuButtons);
          window.sessionStorage.setItem(
            "menuBtnId",
            JSON.stringify(user.menuButtons)
          );
          window.sessionStorage.setItem("portalOrigin", user.portalOrigin);
          window.sessionStorage.setItem(
            "menuBtnId",
            JSON.stringify(user.menuButtons)
          );
          window.sessionStorage.setItem("ssoLogin", 1);
          initLoginData(store);
          next(to);
        },
      });
      //获取权限信息
      portalAuthHandler.getTopAuthData();
    } else if (isLogin) {
      initLoginData(store);
      next();
    } else {
      login();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
var vue = new Vue({
  router: router,
  store: store,
  render: (h) => h(AppView),
});
//设置httpUtil的基础信息
httpUtil.setCacheData(vue);
// 设置 websocket服务端URL
socketUtil.setSocketCacheData(vue);
//-------------------------------------------
//统一的回退操作
Vue.prototype.$back = (e, page) => {
  if (page) {
    //多次回退的场景，需要自行指定回退页
    vue.$router.push(page);
    return;
  }
  //iframe嵌套的回退方式
  if (window.self !== window.top && store.state.from) {
    if (store.state.from.path == "/blank") {
      //以新tab打开，取消或回退则关闭当前页签
      vue.$closeTab(vue.$route.path);
    } else {
      vue.$router.push(store.state.from);
    }
  } else {
    vue.$router.go(-1);
  }
};
//vue实例挂载
vue.$mount("#root");