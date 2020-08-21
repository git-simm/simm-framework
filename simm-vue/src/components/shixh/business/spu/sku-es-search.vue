<template>
  <el-card class="box-card sku-es-search">
    <el-row>
      <el-col :span="24">
        <h4>检索SKU列表</h4>
        <sxh-table
          :dataSource="tableData"
          :max-height="300"
          ref="multipleTable"
          highlight-current-row
          @current-change="getCurrentRow"
          :config="config"
        >
          <el-table-column label="SKU编码" prop="prodNumber" width="160"></el-table-column>
          <el-table-column label="SKU名称" prop="productName">
            <template slot-scope="scope">
              <span
                v-if="scope.row.productNameHighlight>''"
                v-html="scope.row.productNameHighlight"
              ></span>
              <span v-else v-html="scope.row.productName"></span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="SPU编码" prop="spuNumber" width="160"></el-table-column> -->
          <el-table-column label="相关度" prop="score" width="100"></el-table-column>
        </sxh-table>
      </el-col>
      <el-col :span="24">
        <el-divider content-position="left">SKU详情</el-divider>
        <el-row style="padding-top:5px;">
          <el-col :span="24">
            <div class="pull-right" style="padding-bottom:10px;">
              <el-button type="primary" class="btn-default">使用</el-button>
              <el-button type="primary">新建SPU</el-button>
              <el-button type="primary">新建SKU</el-button>
            </div>
          </el-col>
        </el-row>
        <sxh-view-container :item-span="12">
          <sxh-view-item title="SPU名称">{{entity.spuName }}</sxh-view-item>
          <sxh-view-item title="SPU编码">{{ entity.spuNumber }}</sxh-view-item>
          <sxh-view-item title="SKU名称">{{ entity.productName }}</sxh-view-item>
          <sxh-view-item title="SKU编码">{{ entity.prodNumber }}</sxh-view-item>
          <sxh-view-item title="品牌">{{ entity.brandName }}</sxh-view-item>
          <sxh-view-item title="产地">{{ entity.placeName }}</sxh-view-item>
          <sxh-view-item title="商品属性">{{ $cacheUtil.getVal('storage_method',entity.storageMethod )}}</sxh-view-item>
          <sxh-view-item title="条码">{{entity.barCode}}</sxh-view-item>
          <!--<sxh-view-item title="税率" :span="24">{{entity.tax}}</sxh-view-item>-->
          <sxh-view-item
            title="类目"
            :span="24"
          >{{entity.categoryName}} / {{entity.twoCategoryName}} / {{entity.threeCategoryName}}</sxh-view-item>
        </sxh-view-container>
        <el-row>
          <el-col :span="24"></el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: "skuEsSearch",
  data() {
    return {
      config: {
        getListData: this.getPagerListData,
        // simplePager: true,
        layout: "total,sizes, prev, pager, next",
        small: true,
        page: 1,
        pagesize: 10
      },
      tableData: {},
      request: {
        spuName: "",
        spuNumber: "",
        skuName: "",
        prodNumber: "",
        unit: ""
      },
      entity: {}
    };
  },
  created() {
    // this.getListData();
  },
  methods: {
    /**
     * 获取分页数据(方法实现，从es中检索SKU)
     */
    getPagerListData: function(page, pagesize) {
      this.config.page = page;
      this.config.pagesize = pagesize;
      var jsondata = {};
      jsondata = this.request;
      jsondata.pageNo = page - 1;
      jsondata.pageNo = jsondata.pageNo < 0 ? 0 : jsondata.pageNo;
      jsondata.pageSize = pagesize;
      var self = this;
      this.$httpUtil.post({
        url: "/skuES/searchEsSkuByPage.json",
        data: jsondata,
        contentType: "form",
        loading: false, //不显示遮罩层
        succ: function(data) {
          self.tableData = {
            data: data.data.results,
            records: data.data.total
          };
          self.$nextTick(() => {
            if (self.$refs.multipleTable && self.tableData.data.length > 0) {
              self.$refs.multipleTable
                .getOriTable()
                .setCurrentRow(self.tableData.data[0]);
            }
          });
        }
      });
    },
    getListData: function() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.setPage(1);
      }
      this.getPagerListData(1, 10);
    },
    search: function(param) {
      this.request = param;
      this.getListData();
    },
    getCurrentRow: function() {
      this.entity = this.$refs.multipleTable.getCurrentRow() || {};
    }
  }
};
</script>
<style lang="less">
.sku-es-search {
  .el-divider--horizontal {
    margin: 24px 0 10px 0 !important;
  }
}
</style>
