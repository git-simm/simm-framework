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
          <el-col :span="6">
            <el-form-item label="配送模板名称">
              <el-input placeholder="请输入配送模板名称" v-model.trim="request.templateName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：">
              <el-select v-model="request.valid" clearable placeholder="请选择">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
      <router-link to="/sgumanager/template/add">
        <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
      </router-link>
      <table class="table table-striped table-bordered">
        <thead>
          <tr role="row">
            <th>ID</th>
            <th>配送模板名称</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in data" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.templateName }}</td>
            <td>
              <p v-if="item.valid === 0">禁用</p>
              <p v-if="item.valid === 1">启用</p>
            </td>
            <td>{{ item.createAt }}</td>
            <td class="el-form-item">
              <el-button plain size="minier" @click="showView(item)">修改</el-button>
              <el-button plain size="minier" @click="isValid(item, 0)" v-if="item.valid == 1">禁用</el-button>
              <el-button plain size="minier" @click="isValid(item, 1)" v-if="item.valid == 0">启用</el-button>
              <router-link :to="'/sgumanager/template/relevance/' + item.id">
                <el-button plain size="minier">关联配送地址</el-button>
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
  name: "SguTemplateList",
  data: function(router) {
    return {
      records: null,
      request: {
        page: 1,
        pagesize: 10,
        templateName: "",
        valid: ""
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
    showView(obj) {
      window.sessionStorage.setItem("skuView", JSON.stringify(obj));
      this.$router.push({
        path: "/sgumanager/template/edit/" + obj.id
      });
    },
    getListData: function() {
      var self = this;
      var store = this.$store;
      var jsondata = Object.assign(self.request, {
        token: store.state.token,
        tokenid: store.state.tokenid
      });
      this.$httpUtil.post({
        url: "/distributionTemplate/list.json",
        contentType: "form",
        data: jsondata,
        succ: function(data) {
          self.data = data.data;
        }
      });
    },
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
      }
    },
    isValid(item, validStatus) {
      var self = this;
      let store = this.$store;
      let id = item.id;
      let jsondata = {
        token: store.state.token,
        tokenid: store.state.tokenid,
        id: id,
        valid: validStatus
      };
      this.$httpUtil.post({
        url: "/distributionTemplate/update.json",
        contentType: "form",
        data: jsondata,
        succ: function(data) {
          if (data !== "error") {
            self.$message({
              message: "修改成功",
              type: "success"
            });
            self.getListData();
          }
        }
      });
    }
  }
};
</script>
