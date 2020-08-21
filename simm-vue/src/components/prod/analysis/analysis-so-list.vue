<template>
  <section class="content-section">
    <h4>采购流水</h4>
    <div class="search-table">
      <sxh-table :dataSource="data" ref="multipleTable" :config="config">
        <el-table-column label="订单编码" width="150" prop="soNumber"></el-table-column>
        <el-table-column label="采购时间" width="200" prop="createAt"></el-table-column>
        <el-table-column label="收货时间" width="200" prop="finishAt"></el-table-column>
        <el-table-column label="采购信息" width="120" prop="prodPrice">
          <template slot-scope="scope">
            <div>
              采购单价：
              <b>{{scope.row.prodPrice}}</b>
              <br />采购数量：
              <b>{{scope.row.erpQuantity}}</b>
            </div>
          </template>
        </el-table-column>
      </sxh-table>
    </div>
    <el-divider></el-divider>
    <prod-analysis-chart ref="analysis" business-code="prod" :prod-id="id" :height="240"></prod-analysis-chart>
  </section>
</template>
<script>
import moment from "moment";
export default {
  name: "analysisSoList",
  props: {
    prodId: {
      type: Number,
      required: true,
      default: null,
    },
  },
  data: function (router) {
    return {
      listData: [],
      request: {},
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10,
      },
      data: {},
      id: this.prodId,
    };
  },
  created() {
    this.getListData();
  },
  activated() {
    this.getListData();
  },
  methods: {
    /**
     * 获取分页数据
     */
    getPagerListData: function (page, size) {
      var self = this;
      var jsondata = {};
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.prodId = this.prodId;
      jsondata.page = page;
      jsondata.pagesize = size;
      this.$httpUtil.post({
        url: "/analysisProd/forSo.json",
        data: jsondata,
        contentType: "form",
        succ: function (data) {
          self.data = {
            data: data.data,
            records: data.total,
          };
          self.$refs.analysis.init(data.data);
        },
      });
    },
    getListData: function () {
      this.getPagerListData(this.config.page, this.config.pagesize);
    },
  },
};
</script>
