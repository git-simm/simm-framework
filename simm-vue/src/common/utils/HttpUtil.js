import axios from "axios";
import md5 from "js-md5";
import {
  Loading,
  MessageBox
} from "element-ui";
import {
  showLoading,
  hideLoading
} from "./Loading";
const qs = require("qs");
const parseEvironment = (hostname, domain) => {
  return hostname.substring(
    hostname.indexOf(domain) + domain.length,
    hostname.lastIndexOf(".")
  );
};
//让ajax携带cookie
axios.defaults.withCredentials = true;
/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  config => {
    var submit = config.data;
    if (submit.loading) {
      showLoading();
    }
    var requestData = {};
    // var signature = md5(config.data + "{shixh@2019}");
    // config.headers["signature"] = signature;
    if (submit.contentType == "json") {
      config.headers["Content-Type"] = "application/json";
      config.data = JSON.stringify({
        ...submit.data,
        ...requestData
      });
    } else if (submit.contentType == "form") {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      var param = {
        ...submit.data,
        ...requestData
      };
      config.data = qs.stringify(param, {
        arrayFormat: "repeat"
      });
      // var data = new FormData();
      // for (let key in param) {
      //   data.append(key, param[key]);
      // }
      // config.data = data;
    } else if (submit.contentType == "multipart") {
      config.headers["Content-Type"] = "multipart/form-data";
      var data = new FormData();
      if (submit.data.files != null) {
        submit.data.files.forEach(file => {
          data.append("file", file.blob, file.fileName);
        });
        delete submit.data.files;
      }
      var jsonStr = JSON.stringify({
        ...submit.data,
        ...requestData
      });
      data.append("data", jsonStr);
      config.data = data;
    }
    return config;
  },
  err => {
    hideLoading();
    return Promise.reject(err);
  }
);
/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  function (response) {
    hideLoading();
    // 对响应数据做点什么
    return response;
  },
  function (err) {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "请求错误(400)";
          break;
        case 401:
          err.message = "未授权，请重新登录(401)";
          break;
        case 403:
          err.message = "拒绝访问(403)";
          break;
        case 404:
          err.message = "请求出错(404)";
          break;
        case 405:
          err.message = "参数错误(405)";
          break;
        case 408:
          err.message = "请求超时(408)";
          break;
        case 500:
          err.message = "服务器错误(500)";
          break;
        case 501:
          err.message = "服务未实现(501)";
          break;
        case 502:
          err.message = "网络错误(502)";
          break;
        case 503:
          err.message = "服务不可用(503)";
          break;
        case 504:
          err.message = "网络超时(504)";
          break;
        case 505:
          err.message = "HTTP版本不受支持(505)";
          break;
        default:
          err.message = `连接出错(${err.response.status})!`;
      }
    } else {
      err.message = "连接服务器失败!";
    }
    hideLoading();
    alert(err.message);
    return Promise.reject(err);
  }
);

function alert(msg) {
  MessageBox.alert(msg, "提示", {
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true,
    type: "error"
  });
}
//-----------------------------------------------------
//-------- 基础缓存数据设置 begin ----------------------
let cacheData = {};
let vueStore = {};
let vue = {};
//-------- 基础缓存数据设置 end ----------------------

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function NewGuid() {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export default {
  /**
   * 设置缓存
   * @param {*} vueInstance
   */
  setCacheData: function (vueInstance) {
    vue = vueInstance;
    vueStore = vueInstance.$store;
    cacheData = vueStore.state;
    axios.defaults.baseURL = cacheData.serverURI;
  },
  /**
   * 提交数据到服务端
   * @param {*} url
   * @param {*} data
   * @param {*} succ
   */
  post: function (param) {
    var defaultParam = {
      url: null,
      data: null,
      succ: null,
      fail: null,
      contentType: "json", //json,form,multipart
      loading: true
    };
    param = {
      ...defaultParam,
      ...param
    };
    if (param.loading == null) {
      param.loading = true;
    }
    var submit = {
      loading: param.loading,
      data: param.data,
      contentType: param.contentType
    };
    if (axios.defaults.baseURL == null) {
      throw new Error("api请求地址为空");
    }
    var msg = "运营平台登录用户已经改变";
    return axios.post(param.url, submit).then(res => {
      var result = res.data;
      if (result.resultCode != 1000) {
        if (
          result.error &&
          (result.error.includes("登录超时") || result.error.includes("未登录") || result.error.includes(msg))
        ) {
          if (vue.$cacheUtil) {
            vue.$cacheUtil.clearCache();
          }
          if (result.error.includes(msg)) {
            //通知portal系统清理缓存
            window.top.postMessage({
              type: "setAuth",
              key: "purchase_auth",
              value: null
            }, "*");
            alert(result.error);
          } else {
            if (param.fail) {
              param.fail(result);
            } else {
              //重新加载界面
              window.location.reload();
            }
          }
          return res;
        }
        if (param.fail) {
          param.fail(result);
        } else {
          alert(result.error);
        }
        return res;
      }
      if (param.succ) {
        param.succ(result);
      }
      return res;
    });
  },
  doExport: function (param) {
    // 当前窗口打开
    window.open(
      axios.defaults.baseURL + param.url,
      '_self',
    )
  },
  /**
   * 下载文件
   * @param {*} param
   */
  export: function (param) {
    if (axios.defaults.baseURL == null) {
      throw new Error("api请求地址为空");
    }
    var defaultParam = {
      title: NewGuid(),
      url: null,
      data: null,
      succ: null,
      fail: null,
      contentType: "json", //json,form,multipart
      loading: true
    };
    param = {
      ...defaultParam,
      ...param
    };
    if (param.loading == null) {
      param.loading = true;
    }
    var submit = {
      loading: param.loading,
      data: param.data,
      contentType: param.contentType
    };
    //清理分页信息
    if (submit.data) {
      delete submit.data.pager;
    }
    return axios.post(param.url, submit, {
      responseType: "blob"
    }).then(res => {
      if (res.status != 200) {
        alert("文件导出出现错误！");
        return;
      }
      if (res.data != null) {
        const blob = new Blob([res.data]);
        const filename = `${param.title}.xlsx`;
        if ("download" in document.createElement("a")) {
          //非IE下载
          const elink = document.createElement("a");
          elink.download = filename;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          elink.click();
          URL.revokeObjectURL(elink.href);
        } else {
          navigator.msSaveBlob(blob, filename);
        }
      }
    });
  }
};