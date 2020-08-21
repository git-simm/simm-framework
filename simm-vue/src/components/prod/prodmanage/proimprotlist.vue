<template>
  <section class="content-section prod-content">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @keyup.native.enter="searchFun"
      >
        <el-col :span="8">
          <el-form-item label="SKU编码:">
            <el-input type="text" v-model.trim="request.bar_code" clearable placeholder="请输入SKU编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称：">
            <el-input type="text" v-model.trim="request.prod_name" clearable placeholder="请输入产品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="10px">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              @click="searchFun"
            >搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <table class="table table-hover">
        <thead>
          <tr role="row">
            <th>产品缩略图</th>
            <th>SKU编码</th>
            <th>产品名称</th>
            <th>规格</th>
            <th>单位</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data">
            <td>
              <img :src="item.prod_thumbnail_pic" alt />
            </td>
            <td>{{item.bar_code}}</td>
            <td>{{item.prod_name}}</td>
            <td>{{item.specification}}</td>
            <td>{{item.unit_name}}</td>
            <td>
              <!-- <router-link to="/prod/prodmanage/view">详情</router-link> -->
              <router-link :to="'/prod/prodmanage/proimportlistadd/'+item.id">创建商品</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <el-pagination
        style="float:right"
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
  name: "ProImprotlist",
  data: function() {
    return {
      options: [
        {
          value: 1,
          label: "可用"
        },
        {
          value: 0,
          label: "不可用"
        }
      ],
      response: "",
      records: null,
      request: {
        page: 1,
        pagesize: 10,
        bar_code: "",
        prod_name: "",
        status: 1
      },
      data: null
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

      this.$parent.callAPI("GET", "/templateprod/list.json", jsondata, function(
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
<style>
.prod-content img {
  height: 60px;
  max-width: 60px;
}
</style>
