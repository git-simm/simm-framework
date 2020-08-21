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
          <el-col :span="8">
            <el-form-item label="账号">
              <el-input v-model.trim="request.admin_user_no" placeholder="请输入员工账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model.trim="request.admin_user_name" placeholder="请输入员工姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="request.status" clearable placeholder="请选择">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="this_user_type === 2">
            <el-form-item label="所属分站">
              <el-select v-model="request.supply_site_id" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in siteData"
                  :label="item.site_name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色">
              <el-select v-model="request.admin_role_id" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in roleData"
                  :label="item.admin_role_name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="this_user_type===2?8:16">
            <div class="pull-right">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜索</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <router-link to="/settings/employee/add/0/0">
        <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
      </router-link>
      <el-table border :data="data" style="width: 100%">
        <el-table-column width="160" prop="id" label="id"></el-table-column>
        <el-table-column width="160" prop="admin_user_no" label="账号"></el-table-column>
        <el-table-column width="160" prop="admin_user_name" label="姓名"></el-table-column>
        <el-table-column width="160" prop="admin_user_mobile" label="手机号"></el-table-column>
        <el-table-column
          v-if="request.admin_user_type  === 2 || request.admin_user_type  === 3"
          width="160"
          prop="supply_name"
          label="供应商名称"
        ></el-table-column>
        <el-table-column
          v-if="request.admin_user_type  === 3"
          width="160"
          prop="site_name"
          label="所属分站"
        ></el-table-column>
        <el-table-column prop="admin_role_name" label="所属角色"></el-table-column>
        <el-table-column width="160" prop="site_name" label="所属省级"></el-table-column>
        <el-table-column width="100" prop="status" label="状态">
          <template slot-scope="row">{{row.status==0?"禁用":row.status==1?"启用":""}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="row">
            <router-link :to="'/settings/employee/edit/'+row.row.id">
              <el-button plain size="minier">编辑</el-button>
            </router-link>
            <el-button plain size="minier" @click="initPassword(row.row.id)">初始化密码</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  name: "SupplySettingsEmployeeList",
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
        admin_user_no: "",
        admin_user_name: "",
        supply_id: "",
        supply_site_id: "",
        status: "",
        admin_role_id: "",
        admin_user_mobile: "",
        admin_user_type: ""
      },
      levelData: null,
      data: []
    };
  },
  created: function() {
    var self = this;
    self.getTypeData();
    self.getRoleData();
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
      this.$parent.callAPI("POST", "/adminUser/list.json", jsondata, function(
        data
      ) {
        self.data = data.data;
        self.records = data.records;
      });
    },
    getRoleData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/adminRole/getAvailableRole.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          admin_user_type: self.request.admin_user_type
        },
        function(data) {
          self.roleData = data.data;
        }
      );
    },
    getSiteData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/userinfo/get_supply_site_info.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          supply_id: this.request.supply_id
        },
        function(data) {
          self.siteData = data.data;
        }
      );
    },
    initPassword: function(id) {
      var self = this;
      var store = this.$store;
      this.$confirm("确认要初始化密码？dhxt888", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "再看看"
      })
        .then(() => {
          self.$parent.callAPI(
            "GET",
            "/adminUser/initPassword.json",
            {
              token: store.state.token,
              tokenid: store.state.tokenid,
              id: id
            },
            function(data) {
              self.siteData = data.data;
              self.$message({ message: "操作成功！", type: "success" });
            }
          );
        })
        .catch(() => {
          return false;
        });
    },
    getTypeData: function() {
      var self = this;
      var store = this.$store;
      if (store.state.userInfo.admin_user_type === 1) {
        self.request.admin_user_type = 1;
        self.this_user_type = 1;
      }
      if (store.state.userInfo.admin_user_type === 2) {
        self.request.admin_user_type = 3;
        self.this_user_type = 2;
        self.request.supply_id = store.state.userInfo.supply_id;
        self.getSiteData();
      }
      if (store.state.userInfo.admin_user_type === 3) {
        self.request.admin_user_type = 3;
        self.this_user_type = 3;
        self.request.supply_id = store.state.userInfo.supply_id;
        self.request.supply_site_id = store.state.userInfo.supply_site_id;
      }
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
