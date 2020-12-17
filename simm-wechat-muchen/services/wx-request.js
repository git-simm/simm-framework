const config = require('../config.js');
import http from 'wx-http-axios';
import tips from '../utils/tips.js';
// 创建实例
const service = http.create({
  baseURL: config.service.baseUrl,
  headers: {
    'content-type': 'application/json'
  },
  method: 'POST',
  data: {
    app_key: 'muchen'
  }
})

// 设置全局请求拦截器
service.interceptors.request.use(config => {
  // config.headers['Authorization'] = `Bearer ${getToken()}`;
  return config;
}, () => {
  tips.loading();
})

// 设置全局响应拦截器
service.interceptors.response.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
}, response => {
  tips.loaded();
  if (response.data.resultCode != 1000) {
    tips.toast(response.data.message);
    throw new Error("请求出错："+response.data.message);
  }else{
    return response.data.data;
  }
})
export default service;