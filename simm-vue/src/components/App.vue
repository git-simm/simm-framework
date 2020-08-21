<template>
  <div class="root-container">
    <router-view></router-view>
    <div id="app"></div>
  </div>
</template>
<style lang="less" scope>
@import url("app.less");
</style>
<script>
export default {
  name: "App",
  data: function() {
    return {
      section: "Head",
      version: "0.10.0",
      callingAPI: false,
      serverURI: this.$store.state.serverURI,
      caller: this.$http
    };
  },
  created() {
    //设置vue存储
    this.$cacheUtil.setVueStore(this);
    this.$httpUtil.setCacheData(this);
    this.$socketUtil.initWebSocket();
  },
  methods: {
    callAPI: function(method, url, data, callback) {
      this.$httpUtil.post({
        url: url,
        data: data,
        contentType: "form", //json,form,multipart
        succ: function(data) {
          callback(data);
        }
      });
    },
    callAPI2: function(method, url, data, callback) {
      this.callAPI(method, url, data, callback);
    },
    logout: function() {
      var store = this.$store;
      var self = this;
      this.callAPI(
        "GET",
        "/adminUser/exit.json",
        { token: store.state.token, tokenid: store.state.tokenid },
        function(data) {
          if (data.resultCode === 1000) {
            self.$store.dispatch("SET_USER", null);
            self.$store.dispatch("SET_TOKEN", null);
            self.$store.dispatch("SET_TOKENID", null);

            if (window.sessionStorage) {
              window.sessionStorage.setItem("user", null);
              window.sessionStorage.setItem("token", null);
              window.sessionStorage.setItem("tokenid", null);
            }
            self.$socketUtil.webSocketClose("logout");
            self.$router.push({ path: "/login" });
          }
        }
      );
    },
    doTimeOut: function() {
      this.$store.dispatch("SET_USER", null);
      this.$store.dispatch("SET_TOKEN", null);
      this.$store.dispatch("SET_TOKENID", null);

      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }
      this.$message({
        message: "登录超时",
        type: "warning"
      });
      setTimeout(() => {
        this.$socketUtil.webSocketClose("logout");
        this.$router.push({ path: "/login" });
      }, 1500);
    }
  }
};
</script>
