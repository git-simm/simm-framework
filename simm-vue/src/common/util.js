import store from '../store.js'
import {Loading} from 'element-ui'
let HOST = store.state.serverURI

export function doExcelExport (jsonData, url) {
  let urlEncode = function (param, key, encode) {
    if (param == null) return ''
    let paramStr = ''
    let t = typeof (param)
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
    } else {
      for (let i in param) {
        let k = key == null ? i : key + '[' + i + ']'
        paramStr += urlEncode(param[i], k, encode)
      }
    }
    return paramStr
  }
  // 当前窗口打开
  window.open(
    HOST + url + urlEncode(jsonData).slice(1),
    '_self',
  )
}

// 加载
export const loadingOpen = (msg) => {
  return Loading.service({
    fullscreen: true,
    lock: true,
    text: msg,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.6)'
  })
}

// 关闭加载
export const loadingClose = () => {
  let loadingInstance = loadingOpen()
  loadingInstance.close()
}

