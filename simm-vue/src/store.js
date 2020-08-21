import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// debugger;
const state = {
  callingAPI: false,
  searching: "",
  serverURI: process.env.VUE_APP_SERVICE_URL,
  user: null,
  token: null,
  tokenid: null,
  userInfo: null,
  from: null
};
const mutations = {
  TOGGLE_LOADING(state) {
    state.callingAPI = !state.callingAPI;
  },
  TOGGLE_SEARCHING(state) {
    state.searching = state.searching === "" ? "loading" : "";
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_TOKENID(state, tokenid) {
    state.tokenid = tokenid;
  },
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  SET_BASEDATA(state, baseData) {
    state.baseData = baseData;
  },
  SET_FROM(state, from) {
    state.from = from;
  }
};
const actions = {
  TOGGLE_LOADING({ commit }) {
    commit("TOGGLE_LOADING");
  },
  TOGGLE_SEARCHING({ commit }) {
    commit("TOGGLE_SEARCHING");
  },
  SET_USER({ commit }, user) {
    commit("SET_USER", user);
  },
  SET_TOKEN({ commit }, token) {
    commit("SET_TOKEN", token);
  },
  SET_TOKENID({ commit }, tokenid) {
    commit("SET_TOKENID", tokenid);
  },
  SET_FROM({ commit }, from) {
    commit("SET_FROM", from);
  },
  SET_USERINFO({ commit }, userInfo) {
    commit("SET_USERINFO", userInfo);
  },
  SET_BASEDATA({ commit }, baseData) {
    commit("SET_BASEDATA", baseData);
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions
});
