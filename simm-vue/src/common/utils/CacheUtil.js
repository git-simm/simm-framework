import { isString } from "util";
import globalConfig from "@/common/utils/GlobalConfig";
//-----常用变量----------------------
var KEY_USER = "user";
var KEY_DIC = "dic";

let vue = {};
let VUE_STORE = {};

//----- 私有函数 ----------------------
/**
 * 获取缓存对象
 * @param {*} key
 */
function getLocalCache(key) {
  var cache = localStorage.getItem(key);
  if (cache == null) return null;
  try {
    return JSON.parse(cache);
  } catch (e) {
    return cache;
  }
}
function getSessionCache(key) {
  var cache = sessionStorage.getItem(key);
  if (cache == null) return null;
  try {
    return JSON.parse(cache);
  } catch (e) {
    return cache;
  }
}
/**
 * 设置缓存
 * @param {*} key
 * @param {*} data
 */
function setSessionCache(key, data) {
  if (data == null || isString(data)) {
    sessionStorage.setItem(key, data);
  } else {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
}
function setLocalCache(key, data) {
  if (data == null || isString(data)) {
    localStorage.setItem(key, data);
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
/**
 * 获取vue存储对象
 */
function getVueStore() {
  return VUE_STORE.store;
}
/**
 * 获取vue存储对象
 */
function setVueStore(vueInstance) {
  vue = vueInstance;
  VUE_STORE = vue.$store;
  globalConfig.setVueStore(vue);
}
export default {
  ...globalConfig,
  setVueStore,
  getVueStore,
  getSessionCache,
  getLocalCache,
  setSessionCache,
  setLocalCache,
  /**
   * 获取用户信息
   */
  getUser: function () {
    return getSessionCache(KEY_USER);
  },
  setUser: function (data) {
    this.clearCache();
    var store = VUE_STORE;
    if (!data.userInfo.categoryList) {
      if (data.userInfo.resourceMap && data.userInfo.resourceMap.categoryList) {
        data.userInfo.categoryList = data.userInfo.resourceMap.categoryList;
      }
    }
    if ((data.userInfo.roleList || []).length === 0) {
      data.userInfo.roleList = data.userInfo.roles || [];
    }
    store.dispatch("SET_USER", data.loginUser);
    store.dispatch("SET_TOKEN", data.token);
    store.dispatch("SET_TOKENID", data.tokenid);
    let dic = new Map();
    let dicMap = data.userInfo.dicMap;
    let dicJson = JSON.parse(JSON.stringify(dicMap))
    for (let code in dicJson) {
      let newArr = []
      let oldArr = dicJson[code];
      for (let i = 0; i < oldArr.length; i++) {
        if (oldArr[i].itemType == 1) {
          oldArr[i].itemCode = Number(oldArr[i].itemCode);
        }
        newArr.push({ key: oldArr[i].itemCode, value: oldArr[i].itemName })
      }
      dic.set(code, newArr);
    }
    data.userInfo.dic = globalConfig.appendDic(dic);
    store.dispatch("SET_USERINFO", data.userInfo);
    setSessionCache(KEY_USER, data.loginUser);
    setSessionCache("token", data.token);
    setSessionCache("tokenid", data.tokenid);
    data.userInfo.arr = Array.from(data.userInfo.dic)
    setSessionCache("userinfo", JSON.stringify(data.userInfo));
  },
  setBaseData: function (data) {
    var store = VUE_STORE;
    store.dispatch("SET_BASEDATA", data);
    setSessionCache("baseData", JSON.stringify(data));
  },
  copyCacheUser: function (data) { },
  clearCache: function (key) {
    if (key == null) {
      sessionStorage.clear();
      //localStorage.clear();
    } else {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    }
  }
};
