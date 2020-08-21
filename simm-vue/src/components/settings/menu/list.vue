<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form el-drawer__body">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @keyup.native.enter="searchFun"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="菜单名称：">
              <el-input v-model.trim="request.admin_menu_name" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：">
              <el-select v-model="request.status" clearable placeholder="请选择">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="父级菜单：">
              <el-select filterable v-model="request.parent_menu_id" clearable placeholder="请选择">
                <el-option
                  v-for="item in data.parentList"
                  :key="item.id"
                  :label="item.admin_menu_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <router-link to="/settings/menu/add">
        <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
      </router-link>
      <table class="table table-striped table-bordered">
        <thead>
          <tr role="row">
            <th>菜单ID</th>
            <th>菜单名称</th>
            <th>菜单url</th>
            <th>父级菜单</th>
            <th>排序</th>
            <th>跳转方式</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data.list" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.admin_menu_name}}</td>
            <td>{{item.admin_menu_url}}</td>
            <td>{{item.parent_menu_name}}</td>
            <td>{{item.sort}}</td>
            <td>
              <p v-if="item.menu_type === 1">内部菜单</p>
              <p v-if="item.menu_type === 2">外链菜单</p>
            </td>
            <td>
              <p v-if="item.status === 0">禁用</p>
              <p v-if="item.status === 1">启用</p>
            </td>
            <td>
              <router-link :to="'/settings/menu/edit/'+item.id">
                <el-button plain size="minier">编辑</el-button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="request.page"
        :page-size="request.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="records"
      ></el-pagination>
    </div>
  </section>
</template>
<script>
export default {
  name: "SettingsMenuList",
  data: function(router) {
    return {
      response: "",
      roleData: [],
      supplyData: [],
      siteData: [],
      this_user_type: "",
      records: null,
      request: {
        page: 1,
        pagesize: 10,
        admin_menu_name: "",
        parent_menu_id: null,
        status: null
      },
      levelData: null,
      data: []
    };
  },
  created: function() {
    var self = this;
    self.getListData();
  },
  activated() {
    this.searchFun();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.request.page = val;
      this.getListData();
    },
    getListData: function() {
      var self = this;
      var store = this.$store;
      var jsondata = Object.assign(self.request, {
        token: store.state.token,
        tokenid: store.state.tokenid
      });
      this.$parent.callAPI("GET", "/adminMenu/list.json", jsondata, function(
        data
      ) {
        self.data = data.data;
        self.records = data.records;
      });
    },
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
      }
    }
  }
};
</script>
