<template>
  <div class="container login-container container-table">
    <div class="row vertical-10p loginRow">
      <!-- <div class="loginLeft"></div> -->
      <div class="loginRight">
        <div class="loginRight-bg"></div>
        <!-- login form -->
        <div class="login-contain">
          <div class="form-text">
            <h2>食享会</h2>
            <h4 class="form-t">
              <span class="form-l">FRESH SHARE</span>&nbsp;&nbsp;&nbsp;
              <span>只支持谷歌浏览器</span>
            </h4>
          </div>
          <form class="ui form loginForm" @submit.prevent="checkCreds">
            <div class="input-group">
              <span class="input-group-addon">
                <i class="iconfont icon-user1"></i>
              </span>
              <input
                class="form-control"
                name="username"
                placeholder="请输入用户名"
                type="text"
                v-model="username"
              />
            </div>

            <div class="input-group">
              <span class="input-group-addon">
                <i class="iconfont icon-lock"></i>
              </span>
              <input
                class="form-control"
                name="password"
                placeholder="请输入密码"
                type="password"
                v-model="password"
              />
            </div>
            <div class="input-group">
              <input
                class="form-control"
                name="check_code"
                placeholder="请输入验证码"
                type="text"
                v-model="check_code"
              />
              <a
                class="input-group-addon"
                href="javascript:void(0)"
                style="padding-top:0;padding-bottom:0;"
                @click="authCodeGet"
              >
                <img class :src="authCode" alt />
              </a>
            </div>
            <div class="input-group">
              <label class="remember-name">
                <div class="icheck icheckbox_flat-blue">
                  <input
                    type="checkbox"
                    name="rememberName"
                    :checked="rememberStatus"
                    v-model="rememberStatus"
                    style="position: absolute; opacity: 0;"
                  />
                  <span class="icon"></span>
                </div>
                <span>记住用户名</span>
              </label>
              <!--  <a class="forget-pwd pull-right" href="">忘记密码？</a> -->
            </div>
            <button style="width:100%" type="submit" v-bind:class="'loginBtn btn-lg ' + loading">登录</button>
          </form>
        </div>
      </div>
    </div>

    <el-dialog title="密码过于简单，请重新设置密码" :visible.sync="editFlg">
      <el-form
        :model="psdRequest"
        label-width="25%"
        :rules="rules"
        ref="psdRequest"
        @submit.prevent="psdSave('psdRequest')"
      >
        <el-form-item label="账号" prop="admin_user_name">
          <el-input :disabled="true" type="text" v-model="psdRequest.admin_user_name"></el-input>
        </el-form-item>
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input type="password" v-model="psdRequest.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="psdRequest.newPassword"
            placeholder="密码由数字,字母,特殊符号混合组成,且长度要大于8位!"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPassword">
          <el-input type="password" v-model="psdRequest.checkPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="psdSave('psdRequest')">确 定</el-button>
        <el-button @click="cancelFun">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jquery from "jquery";
export default {
  name: "Login",
  data: function(router) {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.psdRequest.checkPassword !== "") {
          this.$refs.psdRequest.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.psdRequest.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      editFlg: false,
      authCode: "",
      psdRequest: {
        oldPassword: "",
        newPassword: "",
        checkPassword: "",
        admin_user_name: ""
      },
      key: "",
      section: "Login",
      loading: "",
      username: "",
      password: "",
      check_code: "",
      response: "",
      rememberStatus: false,
      rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入原始密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        checkPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur"
          }
        ]
        /*,
        admin_user_name: [
          { required: true, message: '请输入账号名', trigger: 'blur'}
        ]*/
      }
    };
  },
  computed: {
    store: function() {
      return this.$parent.$store;
    },
    state: function() {
      return this.store.state;
    },
    callAPI: function() {
      return this.$parent.callAPI;
    },
    doc: function() {
      return {
        displayName: this.$store.state.user
      };
    },
    year: function() {
      var y = new Date();
      return y.getFullYear();
    }
  },
  created: function() {
    //设置vue存储
    this.$cacheUtil.setVueStore(this);
    this.$httpUtil.setCacheData(this);
    var status = window.localStorage.getItem("rememberStatus");
    if (status == "true") {
      this.rememberStatus = true;
    } else {
      this.rememberStatus = false;
    }
    this.rememberStatus
      ? (this.username = window.localStorage.getItem("username") || "")
      : (this.username = "");
    this.authCodeGet();
  },
  methods: {
    authCodeGet: function() {
      let timestamp = new Date().getTime();
      let radomNum = "";
      for (var i = 0; i < 4; i++) {
        radomNum += Math.floor(Math.random() * 10);
      }
      this.key = timestamp + "" + radomNum;
      this.authCode =
        this.$store.state.serverURI + "/checkcode.json?key=" + this.key;
    },
    psdSave: function(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.$parent.callAPI(
            "POST",
            "/adminUser/changePassword.json",
            self.psdRequest,
            function(response) {
              self.$message({
                message: "修改成功！",
                type: "success"
              });
              setTimeout(function() {
                self.editFlg = false;
                self.authCodeGet();
              }, 1500);
            }
          );
        } else {
          return false;
        }
      });
    },
    cancelFun: function() {
      this.editFlg = false;
      this.authCodeGet();
    },
    checkCreds: function() {
      //  Change submit button
      var self = this;
      var store = this.$store;
      //  Login
      window.localStorage.setItem("rememberStatus", this.rememberStatus);
      window.localStorage.setItem("username", this.username);
      this.$httpUtil.post({
        url: "/adminUser/login.json",
        data: {
          admin_user_name: this.username,
          admin_user_password: this.password,
          check_code: this.check_code,
          key: this.key
        },
        contentType: "form", //json,form,multipart
        succ: function(result) {
          var data = result.data;
          if (data.loginUser) {
            self.$cacheUtil.setUser(data);
            // 登录前端缓存用户信息成功后开启websocket连接
            self.$router.push({
              path: "/index"
            });
            // self.$socketUtil.initWebSocket();
          }
          self.$httpUtil.post({
            url: "/adminUser/getBaseData.json",
            succ: function(result) {
              self.$cacheUtil.setBaseData(result.data);
            }
          });
        },
        fail: function(result) {
          if (result.resultCode === 1001) {
            self.$message({
              message: result.error,
              type: "warning"
            });
            self.authCodeGet();
            // self.$socketUtil.webSocketClose("logout");
          } else if (result.resultCode === 1006) {
            self.editFlg = true;
            self.psdRequest.admin_user_name = self.username;
          }
        }
      });
    },
    toggleLoading: function() {
      this.loading = this.loading === "" ? "loading" : "";
    },
    resetResponse: function() {
      this.response = "";
    }
  }
};
</script>

<style>
.loginRow {
  display: table;
  width: 80%;
  margin: auto;
  max-width: 1000px;
}

.loginLeft,
.loginRight {
  width: 60%;
  /*
    float: left;*/
  display: table-cell;
}

.loginLeft {
  background: url(/static/img/logo1.png) center center no-repeat;
  /* height: 327px;*/
  background-size: 100% 100%;
}

.loginRight {
  /* background: #f7497e; */
  padding: 30px 30px 60px 30px;
  border-radius: 10px;
  position: relative;
  height: 450px;
}
.loginRight-bg {
  background: rgba(250, 76, 120, 0.7);
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-radius: 10px;
}

.loginRight .loginForm {
  width: 80%;
  margin: auto;
}

.loginRight .loginBtn {
  background-color: transparent;
  border: 2px solid #fff;
}

/* .loginBtn:hover {
  border: 2px solid yellowgreen;
} */

.loginRight .form-text {
  font-family: cursive;
  margin: auto;
}

.loginRight .form-text .form-l {
  letter-spacing: 2px;
}

.loginRight .form-text .form-t {
  letter-spacing: 1px;
}

.login-container {
  height: 100%;
  width: 100%;
  color: #fff;
  background: url(/static/img/login-bg.png) center center / 100% 100%;
  /* background: #fff; */
}
.login-contain {
  z-index: 100;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  left: 20px;
}

.vertical-center-row {
  display: table-cell;
  vertical-align: middle;
}

.vertical-20p {
  padding-top: 20%;
}

.vertical-10p {
  padding-top: 10%;
}

.logo {
  width: 15em;
  padding: 3em;
}

.loginForm .input-group {
  width: 100%;
  margin-bottom: 18px;
}

.input-group input {
  width: 100%;
  height: 42px;
  padding: 12px 20px;
  line-height: 14px;
  /*   border: 1px solid #FFF;*/
  border-radius: 2px;
}

.icheckbox_flat-blue {
  position: relative;
  display: inline-block;
}

.icheckbox_flat-blue input {
  position: absolute;
  opacity: 0;
}

.icheckbox_flat-blue input + .icon {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  background: url(/static/img/login-check.png) no-repeat;
  border: none;
  cursor: pointer;
  transition: 0s;
  background-position: 0 0;
  vertical-align: middle;
}

.icheckbox_flat-blue input:checked + .icon {
  background-position: 0 -36px;
}
</style>
