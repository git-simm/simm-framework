<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form el-drawer__body">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @keyup.native.enter="searchFun"
      >
        <el-col :span="6">
          <el-form-item label="角色名称：">
            <el-input v-model.trim="request.admin_role_name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色类型：">
            <el-select v-model="request.admin_role_type" clearable placeholder="请选择">
              <el-option label="平台级可授角色" value="1"></el-option>
              <el-option label="供应商可授角色" value="2"></el-option>
              <el-option label="分站可授角色" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色编码：">
            <el-input v-model.trim="request.admin_role_no" placeholder="角色编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色状态：">
            <el-select v-model="request.status" clearable placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="pull-right">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              @click="searchFun()"
            >搜索</el-button>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <router-link to="/settings/roles/add">
        <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
      </router-link>
      <table class="table table-striped table-bordered">
        <thead>
          <tr role="row">
            <th>角色编码</th>
            <th>角色名称</th>
            <th>角色说明</th>
            <th>角色类型</th>
            <th>角色状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{item.admin_role_no}}</td>
            <td>{{item.admin_role_name}}</td>
            <td>{{item.admin_role_desc}}</td>
            <td>
              <p v-if="item.admin_role_type === 1">平台级可授角色</p>
              <p v-if="item.admin_role_type === 2">供应商可授角色</p>
              <p v-if="item.admin_role_type === 3">供应商分站可授角色</p>
            </td>
            <td>
              <p v-if="item.status === 0">不可用</p>
              <p v-if="item.status === 1">可用</p>
            </td>
            <td>
              <router-link :to="'/settings/roles/edit/'+item.id">
                <el-button plain size="minier">编辑</el-button>
              </router-link>
              <router-link :to="'/settings/roles/view/'+item.id">
                <el-button plain size="minier">查看</el-button>
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
  name: "SupplySettingsRolesList",
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
        admin_role_name: "",
        admin_role_no: "",
        admin_role_type: null,
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
      this.$parent.callAPI("GET", "/adminRole/list.json", jsondata, function(
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
