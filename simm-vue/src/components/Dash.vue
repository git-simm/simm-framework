<template>
  <div class="wrapper">
    <header class="main-header" v-if="isYqmLogin">
      <nav class="navbar navbar-static-top" role="navigation">
        <!--<a href="/" class="logo">
          <div class="container logo-lg">
            <div class="pull-left info">一起卖</div>
          </div>
        </a>-->
        <a href="/" class="logo" style="width:auto;">
          <div class="pull-left info container" style="width:auto !important;font-size: 16px">
            <img src="/static/img/logo2.png" />
          </div>
        </a>
        <div class="navbar-custom-menu">
          <div class="pull-right">
            <ul class="nav navbar-nav">
              <li class="company" v-if="false">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="iconfont icon-supply" style="margin-right:5px;"></i>
                    {{ company.companyName }}
                    <i
                      class="el-icon-arrow-down el-icon--right"
                    ></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="switchCompany(1, '七种美味')">七种美味</el-dropdown-item>
                    <el-dropdown-item @click.native="switchCompany(2, '至味享会')">至味享会</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
              <li>
                <a href="http://sxhimg.shixiangyiwei.com/upload/download/help.doc">帮助文档</a>
              </li>
              <li>
                <el-popover
                  placement="top-start"
                  title
                  width="200"
                  trigger="hover"
                  :content="`账号类型: ${account}`"
                >
                  <!-- <el-button slot="reference">hover 激活</el-button> -->
                  <a
                    slot="reference"
                    href="javascript:;"
                    class="dropdown-toggle messages-trigger"
                  >{{ doc.displayName }}</a>
                </el-popover>
              </li>
              <li>
                <a href="javascript:;" @click="logout">退出</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <aside class="main-sidebar" style="z-index:499!important" v-if="isYqmLogin">
      <section class="sidebar">
        <el-menu
          class="el-menu-vertical-demo yqm-menu"
          :default-active="menuId"
          :default-openeds="menuOpenArr"
        >
          <el-submenu :index="String(item.id)" v-for="(item, index) in menu">
            <template slot="title">
              <i class="iconfont" :class="item.cls"></i>
              {{ item.name }}
            </template>
            <template v-for="(item2, index2) in item.children">
              <el-menu-item v-if="item2.menu_type === 2" :index="String(item2.id)">
                <router-link
                  :to="{
                    path: '/suplier/Iframepage',
                    query: { url: item2.path }
                  }"
                  @click.native="tabClick(item, item2)"
                >
                  <span class="page">{{ item2.name }}</span>
                </router-link>
              </el-menu-item>
              <el-menu-item v-else :index="String(item2.id)">
                <a class="page" @click="tabClick(item, item2)">{{ item2.name }}</a>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </section>
    </aside>
    <div
      :class="isYqmLogin?`content-wrapper btn-small`:`content-wrapper btn-small content-wrapper-portal`"
    >
      <section class="content-header clearfix" v-if="isYqmLogin">
        <ol class="breadcrumb">
          <li>
            <a href="javascript:;">
              <i class="iconfont icon-home"></i>首页
            </a>
          </li>
          <li class="active">{{ routeName }}</li>
        </ol>
      </section>
      <!-- 更新日志 -->
      <!-- <section class="content-section">
      </section>-->
      <keep-alive :include="keepAliveRoutes">
        <router-view></router-view>
      </keep-alive>
      <!-- 回到顶部 -->
      <el-backtop style="z-index:9999;" title="置顶"></el-backtop>
    </div>
    <footer class="main-footer" v-if="isYqmLogin">
      <strong>
        Copyright &copy; {{ year }}
        <a href="javascript:;">食享会</a>.
      </strong>
      All rights reserved.
    </footer>
  </div>
</template>

<script>
import { keepAliveRoutes } from "../routes.js";
export default {
  name: "Dash",
  data: function() {
    return {
      keepAliveRoutes: keepAliveRoutes,
      menu: {},
      menuId: "",
      menuOpenArr: [],
      routeName: "",
      user: {},
      company: {
        companyId: 1,
        companyName: "七种美味"
      }
    };
  },
  computed: {
    isYqmLogin: function() {
      //非iframe嵌套
      return window.self === window.top;
    },
    store: function() {
      return this.$parent.$store;
    },
    state: function() {
      return this.store.state;
    },
    callAPI: function() {
      return this.$parent.callAPI;
    },
    callAPI2: function() {
      return this.$parent.callAPI2;
    },
    doTimeOut: function() {
      return this.$parent.doTimeOut;
    },
    doc: function() {
      return {
        displayName: this.$store.state.user
      };
    },
    year: function() {
      var y = new Date();
      return y.getFullYear();
    },
    account: function() {
      var user = this.user;
      var type = this.$cacheUtil.getVal("user_role_type", user.roleType, "");
      if (user.cityName > "") {
        return `${type} (${user.provinceName}-${user.cityName})`;
      } else if (this.user.provinceName > "") {
        return `${type} (${user.provinceName})`;
      }
      return type;
    }
  },
  created: function() {
    //console.log("支持缓存的组件:", this.keepAliveRoutes);
    var self = this;
    this.user = this.$store.state.userInfo;
    this.routeName = (this.$route.name || "").toUpperCase();
    //设置vue存储
    this.$cacheUtil.setVueStore(this);
    this.$httpUtil.setCacheData(this);
    this.getMenu(menuBtns => {
      self.$permission.setMenuBtns(menuBtns);
    });
    this.menuId = window.sessionStorage.getItem("menuId");
    this.menuOpenArr = JSON.parse(window.sessionStorage.getItem("menuOpenArr"));
    this.routeName = window.sessionStorage.getItem("menuName");
  },
  methods: {
    /**
     * 切换公司
     */
    switchCompany(companyId, companyName) {
      this.company.companyId = companyId;
      this.company.companyName = companyName;
    },
    tabClick(item, item2) {
      this.routeName = item2.name;
      window.sessionStorage.setItem("menuId", item2.id);
      window.sessionStorage.setItem("menuName", item2.name);
      window.sessionStorage.setItem("menuOpenArr", '["' + item.id + '"]');
      //切换菜单时清空所有的缓存
      this.keepAliveRoutes = [];
      var self = this;
      this.$nextTick(() => {
        self.keepAliveRoutes = keepAliveRoutes;
        //跳转到下一个菜单
        self.$router.push({ path: item2.path });
      });
    },
    changeloading: function() {
      this.store.dispatch("TOGGLE_SEARCHING");
    },
    logout: function() {
      sessionStorage.clear();
      return this.$parent.logout();
    },
    getMenu: function(callback) {
      var self = this;
      var store = this.store;
      //rbac系统发布，不需要查询菜单
      if (
        store.state.token == null ||
        store.state.token == undefined ||
        store.state.token == "null" ||
        store.state.token == "undefined"
      )
        return;
      this.callAPI(
        "GET",
        "/adminMenu/getMenu.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.menu = data.data;
          window.sessionStorage.setItem(
            "menuBtnId",
            JSON.stringify(data.dataReserve1)
          );
          //推送按钮权限信息
          if (callback) {
            callback(data.dataReserve1);
          }
          self.menu.forEach(function(item, index) {
            switch (item.path) {
              case "/marketing/prodpromotion":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-sale"
                  })
                );
                break;
              case "/client/clientmanage":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-user"
                  })
                );
                break;
              case "/prod/prodmanage":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-product"
                  })
                );
                break;
              case "/so":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-order"
                  })
                );
                break;
              case "/aftersaleservice":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-aftersales"
                  })
                );
                break;
              case "/settings":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-set"
                  })
                );
                break;
              case "/suplier":
              case "/platform":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-supply"
                  })
                );
                break;
              case "/account":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-zijin"
                  })
                );
                break;
              case "/report":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-report"
                  })
                );
                break;
              case "/globalprod":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-sort-up"
                  })
                );
                break;
              case "/assemble":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-edit1"
                  })
                );
                break;
              case "/erp":
                self.$set(
                  self.menu,
                  index,
                  Object.assign(item, {
                    cls: "icon-erp"
                  })
                );
                break;
            }
          });
        }
      );
    }
  }
};
</script>

<style>
.content-wrapper-portal {
  margin-left: 0 !important;
  margin-right: 0 !important;
  min-width: 850px;
  height: 100%;
  max-width: none !important;
  background: none;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.company .el-dropdown-link {
  cursor: pointer;
  color: white;
  padding: 13px 15px 15px 15px;
  height: 20px;
  display: block;
  font-size: 16px;
}

.company .el-icon-arrow-down {
  font-size: 12px;
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}

.skin-blue .main-header .navbar .nav > li > span > a {
  color: #fff;
  padding-top: 17px;
  padding-bottom: 15px;
}

.skin-blue .main-header .navbar .nav > li:hover {
  background: #f09090;
}

.nav > li > span > a {
  position: relative;
  display: block;
  padding: 10px 15px;
}
</style>
