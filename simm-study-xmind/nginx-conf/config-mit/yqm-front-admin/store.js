import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  // serverURI: 'http://127.0.0.1:8888/yqm_ec_admin',
  // 李
  // serverURI: 'http://192.168.50.217:8081',
  // 贺
  // serverURI: 'http://10.50.3.86:8080/yqm_ec_admin',
  // 熊
  // serverURI: 'http://192.168.50.185:8080/yqm_ec_admin',
  // 罗
  // serverURI: 'http://192.168.50.2:8080/yqm_ec_admin',
  // 夏
  // serverURI: 'http://10.50.3.55:8080',
  // serverURI: 'http://192.168.50.94:8080',
  // 测
  // serverURI: 'http://testyqmadminapi.shixiangyiwei.com',
  serverURI:'http://dhxtapi.shixhmit.com',
  user: null,
  token: null,
  tokenid: null,
  userInfo: null
}

const mutations = {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_TOKENID (state, tokenid) {
    state.tokenid = tokenid
  },
  SET_USERINFO (state, userInfo) {
    state.userInfo = userInfo
  },
  SET_BASEDATA (state, baseData) {
    state.baseData = baseData
  }
}
const actions = {
  TOGGLE_LOADING ({ commit }) {
    commit('TOGGLE_LOADING')
  },
  TOGGLE_SEARCHING ({ commit }) {
    commit('TOGGLE_SEARCHING')
  },
  SET_USER ({ commit }, user) {
    commit('SET_USER', user)
  },
  SET_TOKEN ({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  SET_TOKENID ({ commit }, tokenid) {
    commit('SET_TOKENID', tokenid)
  },
  SET_USERINFO ({ commit }, userInfo) {
    commit('SET_USERINFO', userInfo)
  },
  SET_BASEDATA ({ commit }, baseData) {
    commit('SET_BASEDATA', baseData)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
