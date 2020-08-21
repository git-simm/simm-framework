<template id="list">
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @submit.native.prevent="searchFun"
      >
        <el-col :span="8">
          <el-form-item label="商品名称">
            <el-input placeholder="请输入商品名称" v-model.trim="request.prodName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商">
            <el-select v-model="request.supply_id" clearable placeholder="请选择">
              <el-option v-for="item in supplyData" :label="item.supply_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单时间">
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="timedate"
              type="daterange"
              @change="datechange"
              placeholder="开始到结束日期"
            ></el-date-picker>
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
            <a
              style="margin-left: 30px"
              class="btn-default"
              icon="el-icon-download"
              :href="serverURI + '/prodInfo/prodCollectExport.json?token='+tokendata.token+'&tokenid='+tokendata.tokenid"
            >报表导出</a>
          </el-form-item>
        </el-col>
        <el-col :span="3"></el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-table border :data="data.data" style="width: 100%">
        <el-table-column prop="prod_number" label="SKU编码"></el-table-column>
        <el-table-column prop="prod_name" label="商品名称"></el-table-column>
        <el-table-column prop="prod_sales" label="供应商名称"></el-table-column>
        <el-table-column prop="prod_sales" label="订购数量"></el-table-column>
        <el-table-column prop="prod_price" label="订购金额"></el-table-column>
        <el-table-column prop="prod_price" label="退货金额"></el-table-column>
        <el-table-column prop="prod_price" label="金额小计"></el-table-column>
        <!-- <el-table-column label="操作">
          <template  slot-scope="scope">
            <router-link :to="'/prod/prodtotal/detail/'+scope.row.id"><span class="page">查看</span></router-link>
          </template>
        </el-table-column>-->
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
  </section>
</template>

<script>
import moment from "moment";

export default {
  name: "prodTotalList",
  data: function() {
    return {
      loading: false,
      serverURI: this.$store.state.serverURI,
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      supplyData: [],
      request: {
        page: 1,
        pagesize: 10,
        prodName: "",
        startTime: "",
        endTime: ""
      },
      data: {}
    };
  },
  methods: {
    searchFun: function() {
      let self = this;
      if (this.timedate.length === 0) {
        this.$alert("下单时间必填，且范围在6个月之内", "警告");
        return;
      }
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
      }
    },
    stringdata() {
      !!this.timedate[0] &&
        (this.request.startTime = moment(this.timedate[0]).format(
          "YYYY-MM-DD 00:00:00"
        ));
      !!this.timedate[1] &&
        (this.request.endTime = moment(this.timedate[1]).format(
          "YYYY-MM-DD 23:59:59"
        ));
    },
    datechange(value) {
      if (value === "" || value === undefined) {
        return;
      }
      this.stringdata();
      var self = this;
      let start = self.timedate[0];
      let end = self.timedate[1];
      let addstart = new Date();
      addstart.setTime(start.getTime() + 3600 * 1000 * 24 * 30 * 6);
      if (addstart < end) {
        self.timedate = [];
        self.$message({ message: "选择日期范围不能超过6个月", type: "error" });
      }
    },
    handleCurrentChange: function(val) {
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
        "POST",
        "/prodInfo/prodCollect.json",
        jsondata,
        data => {
          if (data.resultCode === 1000) {
            self.data = data;
          }
        }
      );
    },
    getSupplyData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/supplyInfo/addlist.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.supplyData = data.data;
        }
      );
    }
  },
  created() {
    const start = new Date();
    const end = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
    this.timedate = [start, end];
    this.stringdata();
    this.getListData();
    this.getSupplyData();
  }
};
</script>
