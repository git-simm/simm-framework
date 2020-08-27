<template>
<div class="wrapper">
    <header class="main-header" v-if="isYqmLogin">
        <nav class="navbar navbar-static-top" role="navigation">
            <a href="/" class="logo" style="width:auto;">
                <div class="pull-left info container" style="width:auto !important;font-size: 16px">
                    <h3>我的测试项目</h3>
                </div>
            </a>
            <div class="navbar-custom-menu">
                <div class="pull-right">
                    <ul class="nav navbar-nav">
                        <li>
                            <el-popover placement="top-start" title width="200" trigger="hover" :content="`账号类型`">
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                                <a slot="reference" href="javascript:;" class="dropdown-toggle messages-trigger">admin</a>
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
    <!--<aside class="main-sidebar" style="z-index:499!important" v-if="isYqmLogin">
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
    </aside>-->
    <div :class="`content-wrapper btn-small content-wrapper-portal`" style="padding-top: 40px !important;">
        <section class="content-header clearfix">
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
    <!--<footer class="main-footer" v-if="isYqmLogin">
      <strong>
        Copyright &copy; {{ year }}
        <a href="javascript:;">食享会</a>.
      </strong>
      All rights reserved.
    </footer>-->
</div>
</template>

<script>
import {
    keepAliveRoutes
} from '../routes.js'
export default {
    name: 'Dash',
    data: function () {
        return {
            keepAliveRoutes: keepAliveRoutes,
            menu: {},
            menuId: '',
            menuOpenArr: [],
            routeName: '',
            user: {},
            company: {
                companyId: 1,
                companyName: '七种美味'
            }
        }
    },
    computed: {
        isYqmLogin: function () {
            //非iframe嵌套
            return window.self === window.top
        },
        store: function () {
            return this.$parent.$store
        },
        state: function () {
            return this.store.state
        },
        doTimeOut: function () {
            return this.$parent.doTimeOut
        },
        doc: function () {
            return {
                displayName: this.$store.state.user
            }
        },
        year: function () {
            var y = new Date()
            return y.getFullYear()
        }
    },
    mounted: function () {
        this.$router.push('/index')
    },
    methods: {
        /**
         * 切换公司
         */
        switchCompany(companyId, companyName) {
            this.company.companyId = companyId
            this.company.companyName = companyName
        },
        tabClick(item, item2) {
            this.routeName = item2.name
            window.sessionStorage.setItem('menuId', item2.id)
            window.sessionStorage.setItem('menuName', item2.name)
            window.sessionStorage.setItem('menuOpenArr', '["' + item.id + '"]')
            //切换菜单时清空所有的缓存
            this.keepAliveRoutes = []
            var self = this
            this.$nextTick(() => {
                self.keepAliveRoutes = keepAliveRoutes
                //跳转到下一个菜单
                self.$router.push({
                    path: item2.path
                })
            })
        },
        changeloading: function () {
            this.store.dispatch('TOGGLE_SEARCHING')
        },
        logout: function () {
            sessionStorage.clear()
            return this.$parent.logout()
        }
    }
}
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

.skin-blue .main-header .navbar .nav>li>span>a {
    color: #fff;
    padding-top: 17px;
    padding-bottom: 15px;
}

.skin-blue .main-header .navbar .nav>li:hover {
    background: #f09090;
}

.nav>li>span>a {
    position: relative;
    display: block;
    padding: 10px 15px;
}
</style>
