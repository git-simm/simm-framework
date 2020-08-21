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
            <el-form-item label="状态：">
              <el-select v-model="request.status" clearable placeholder="请选择">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属菜单：">
              <el-select filterable v-model="request.admin_menu_id" clearable placeholder="请选择">
                <el-option
                  v-for="item in data.menuList"
                  :label="item.admin_menu_name"
                  :value="item.id"
                  :key="item.id"
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
      <router-link to="/settings/button/add">
        <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
      </router-link>
      <table class="table table-striped table-bordered">
        <thead>
          <tr role="row">
            <th>按钮ID</th>
            <th>按钮名称</th>
            <th>按钮url</th>
            <th>所属菜单</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data.buttonList" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.admin_menu_button_name}}</td>
            <td>{{item.admin_menu_button_url}}</td>
            <td>{{item.admin_menu_name}}</td>
            <td>
              <p v-if="item.status === 0">禁用</p>
              <p v-if="item.status === 1">启用</p>
            </td>
            <td>
              <router-link :to="'/settings/button/edit/'+item.id">
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
  name: "SettingsButtonList",
  data: function(router) {
    return {
      records: null,
      request: {
        page: 1,
        pagesize: 10,
        admin_menu_id: null,
        status: null
      },
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
      this.$parent.callAPI(
        "GET",
        "/adminMenuButton/list.json",
        jsondata,
        function(data) {
          self.data = data.data;
          self.records = data.records;
        }
      );
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
