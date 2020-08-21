<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @keyup.native.enter="searchFun"
      >
        <el-col :span="8">
          <el-form-item label="供应商编码：">
            <el-input v-model.trim="request.supply_number" placeholder="请输入供应商编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商名称：">
            <el-input v-model.trim="request.supply_name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商分站：">
            <el-input v-model.trim="request.site_name" placeholder="请输入供应商分站"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label-width="10px">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              @click="searchFun()"
            >搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <table class="table table-striped table-bordered">
        <thead>
          <tr role="row">
            <th>供应商编码</th>
            <th>供应商名称</th>
            <th>分站</th>
            <th>是否建立大品采购关系</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data.data" :key="item.id">
            <td>{{item.supply_number}}</td>
            <td>{{item.supply_name}}</td>
            <td>{{item.site_name}}</td>
            <td>{{item.is_related==1?'是':'否'}}</td>
            <td>
              <el-button
                plain
                size="minier"
                v-if="item.is_related!=1 && item.site_id"
                @click="estContactFun(item)"
              >建立关系</el-button>
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
        :total="data.records"
      ></el-pagination>
    </div>
  </section>
</template>
<script>
export default {
  name: "SupplyBulkyInfoList",
  data: function(router) {
    return {
      request: {
        page: 1,
        pagesize: 10,
        site_name: "",
        supply_name: "",
        supply_number: ""
      },
      data: {}
    };
  },
  created: function() {
    this.getListData();
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
        "/supplyBulkyInfo/list.json",
        jsondata,
        function(data) {
          self.data = data;
        }
      );
    },
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
      }
    },
    estContactFun: function(item) {
      var self = this;
      var store = this.$store;
      self
        .$confirm("确定建立大品采购关系？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(() => {
          self.$parent.callAPI(
            "GET",
            "/supplyBulkyInfo/relate.json",
            {
              token: store.state.token,
              tokenid: store.state.tokenid,
              site_id: item.site_id
            },
            function(data) {
              self.$message({
                message: "建立大品采购关系成功",
                type: "success"
              });
              self.getListData();
            }
          );
        })
        .catch(() => {});
    }
  }
};
</script>
