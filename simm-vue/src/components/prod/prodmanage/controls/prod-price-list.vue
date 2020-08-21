<template>
  <section class="content-section">
    <sxh-table :dataSource="data" ref="multipleTable" :config="config">
      <el-table-column prop="createName" label="操作人"></el-table-column>
      <el-table-column prop="createAt" label="操作时间"></el-table-column>
      <el-table-column label="城市" prop="adminShopName"></el-table-column>
      <el-table-column prop="subAccountProdPrice" label="销售单价"></el-table-column>
      <el-table-column prop="subAccountProportion" label="平台比例(%)"></el-table-column>
      <el-table-column prop="processStatus" label="审核状态">
        <template
          slot-scope="scope"
        >{{ $cacheUtil.getVal('prod_audit_status',scope.row.processStatus ) }}</template>
      </el-table-column>
      <el-table-column prop="remake" label="驳回原因"></el-table-column>
    </sxh-table>
  </section>
</template>

<script>
import moment from "moment";
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "prodPriceList",
  mixins: [baseMixin],
  data: function() {
    return {
      data: {},
      request: {
        prodId: this.$route.params.id
      },
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      }
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = self.request;
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.pager = {
        pageNo: page,
        pageSize: size
      };
      this.$httpUtil.post({
        url: "/supplyProd/list.json",
        data: jsondata,
        succ: function(data) {
          self.data = data;
        }
      });
    },
    getListData: function() {
      this.getPagerListData(this.config.page, this.config.pagesize);
    }
  }
};
</script>
