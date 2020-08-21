<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm el-drawer__body"
        @keyup.native.enter="searchFun"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="城市">
              <el-select clearable placeholder="请选择" v-model="request.admin_shop_id" filterable>
                <el-option
                  v-for="item in levelData"
                  :key="item.id"
                  :label="item.level_name"
                  :value="item.admin_shop_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录账号">
              <el-input placeholder="请输入登录账号" v-model.trim="request.user_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人电话">
              <el-input placeholder="请输入负责人电话" v-model.trim="request.contact_phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="request.status" clearable placeholder="请选择">
                <el-option
                  v-for="(item, key) in statusData"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <div class="pull-right">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
                :disabled="isSubmit"
              >搜索</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <span v-permission:clientmanage_add>
        <router-link to="/client/clientmanage/add" class="row-button">
          <el-button type="primary" class="btn-default" icon="el-icon-plus">新增账号</el-button>
        </router-link>
      </span>
      <el-table border :data="data.data" style="width: 100%">
        <!-- <el-table-column
        prop="company_name"
        label="城市名称">
        </el-table-column>-->
        <el-table-column prop="level_name" label="城市"></el-table-column>
        <el-table-column prop="user_name" label="登录账号"></el-table-column>
        <el-table-column prop="contact_person" label="负责人"></el-table-column>
        <el-table-column prop="contact_phone" label="负责人电话"></el-table-column>
        <!-- <el-table-column
        prop="address_detail"
        label="地址">
        </el-table-column>-->
        <el-table-column label="账号状态" width="100">
          <template slot-scope="scope">
            <span>
              {{
              scope.row.status == 0
              ? "未启用"
              : scope.row.status == 1
              ? "启用"
              : scope.row.status == 2
              ? "过期"
              : scope.row.status == 3
              ? "禁用"
              : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-permission:clientmanage_update>
              <router-link :to="'/client/clientmanage/edit/' + scope.row.id">
                <el-button plain size="minier">修改</el-button>
              </router-link>
            </span>
            <!-- 修改权限 带上修改收货地址的功能 -->
            <span v-permission:clientmanage_update>
              <router-link :to="'/client/delivery/list/' + scope.row.id">
                <el-button plain size="minier">收货地址</el-button>
              </router-link>
            </span>
            <router-link :to="'/client/clientmanage/detail/' + scope.row.id">
              <el-button plain size="minier">查看</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="request.page"
        layout="total, prev, pager, next, jumper"
        :page-size="request.pagesize"
        :total="data.records"
      ></el-pagination>
    </div>
    <el-dialog title="开通授信" :visible.sync="creditFlg">
      <el-form :model="creditData" :rules="rules" ref="creditData" label-width="25%">
        <el-form-item label>
          <el-checkbox
            v-model.number="creditData.credit_status"
            :true-label="1"
            :false-label="0"
          >启用授信（不勾选，即不使用客户的授信）</el-checkbox>
        </el-form-item>
        <el-form-item label="授信额度" prop="credit_line">
          <el-input v-model.number="creditData.credit_line" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="creditSave(creditData, 'creditData')">保 存</el-button>
        <el-button @click="creditFlg = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: "SupplyClientManageList",
  data: function(router) {
    var checkCredit = (rule, value, callback) => {
      if (this.creditData.credit_status === 1 && Number(value) <= 0) {
        callback(new Error("请输入授信额度"));
      } else {
        callback();
      }
    };
    return {
      response: "",
      isSubmit: false,
      loading: true,
      creditFlg: false,
      creditData: {},
      statusData: [
        {
          label: "未启用",
          value: 0
        },
        {
          label: "启用",
          value: 1
        },
        {
          label: "过期",
          value: 2
        },
        {
          label: "禁用",
          value: 3
        }
      ],
      request: {
        page: 1,
        pagesize: 10,
        company_name: "",
        contact_phone: "",
        status: "",
        admin_shop_id: "",
        user_name: ""
      },
      levelData: [],
      data: {},
      rules: {
        credit_line: [
          { validator: checkCredit, message: "请输入授信额度", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {
    this.getLevelData();
    this.getListData();
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
    creditOpen: function(item) {
      var self = this;
      var store = this.$store;
      self.creditFlg = true;
      this.$parent.callAPI(
        "GET",
        "/userinfo/getCreditLine.json",
        { token: store.state.token, tokenid: store.state.tokenid, id: item.id },
        function(data) {
          self.creditData = data.data;
        }
      );
    },
    creditSave: function(item, formName) {
      var self = this;
      var store = this.$store;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.$parent.callAPI(
            "GET",
            "/userinfo/updateCreditLine.json",
            {
              token: store.state.token,
              tokenid: store.state.tokenid,
              id: item.id,
              credit_line: item.credit_line,
              credit_status: item.credit_status
            },
            function(data) {
              self.$message({ message: "操作成功！", type: "success" });
              self.creditFlg = false;
            }
          );
        } else {
          return false;
        }
      });
    },
    getLevelData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/supplyUserLevel/list.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          status: 1,
          pagesize: 9999
        },
        function(data) {
          self.levelData = data.data;
        }
      );
    },
    getListData: function() {
      var self = this;
      self.isSubmit = true;
      var store = this.$store;
      var jsondata = Object.assign(self.request, {
        token: store.state.token,
        tokenid: store.state.tokenid
      });
      this.$parent.callAPI2("GET", "/userinfo/list.json", jsondata, function(
        data
      ) {
        if (data.resultCode === 1000) {
          self.data = data;
        }
        self.isSubmit = false;
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
