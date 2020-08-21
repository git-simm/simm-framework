<template>
  <section class="content-section">
    <h4>售卖流水</h4>
    <div class="search-table">
      <sxh-table :dataSource="data" ref="multipleTable" :config="config" :max-height="400">
        <el-table-column label="SGU信息" width="200" prop="sguNumber">
          <template slot-scope="scope">
            <sxh-detail-view
              comp="sguView"
              :view-param="{ id: scope.row.id, number: scope.row.sguNumber,isLink: true, label: scope.row.sguNumber }"
            ></sxh-detail-view>
            <br />
            {{scope.row.sguName}}
            <el-tag
              size="mini"
              effect="plain"
            >{{$cacheUtil.getVal("sgu_on_sale",scope.row.onSale,"")}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上下架时间" width="180">
          <template slot-scope="scope">
            <div>
              <span title="上架时间">
                <i class="el-icon-video-play"></i>
                {{scope.row.onSaleTime}}
              </span>
              <br />
              <span title="下架时间">
                <i class="el-icon-video-pause"></i>
                {{scope.row.realTakenOff}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="售卖信息（元）" width="120" prop="salePrice">
          <template slot-scope="scope">
            <div>
              销售价：
              <b>{{scope.row.salePrice}}</b>
              <br />平台服务费：
              <b>{{scope.row.platformServiceFee}}</b>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="城市" width="80" prop="addressCity"></el-table-column>
      </sxh-table>
    </div>
    <el-divider></el-divider>
    <prod-analysis-chart ref="analysis" business-code="sgu" :prod-id="id" :height="240"></prod-analysis-chart>
  </section>
</template>
<script>
import moment from "moment";
export default {
  name: "analysisSguList",
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
        url: "/analysisProd/forSgu.json",
        data: jsondata,
        contentType: "form",
        succ: function (data) {
          self.data = {
            data: data.data,
            records: data.records,
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
