<template>
  <section class="content-section">
    <!-- @tab-click="handleClick" -->
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本信息" name="first">
        <detail-base ref="detailBase"></detail-base>
      </el-tab-pane>
      <el-tab-pane label="证件信息" name="certificate">
        <detail-certificate ref="detailCertificate"></detail-certificate>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="prodlist">
        <prod-list ref="detailProd" :filter="{purchase_supply_id: id}"></prod-list>
      </el-tab-pane>
      <el-tab-pane label="合同续签日志" name="contractLogs">
        <contract-log :supplyInfo="{supplyId: id}"></contract-log>
      </el-tab-pane>
      <el-tab-pane label="费用单信息" name="billList">
        <bill-list :show-mode="false" :page-mode="null" ref="billInfo"></bill-list>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <detail-log ref="detailLog"></detail-log>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import moment from "moment";
import detailBase from "./controls/detail-base.vue";
import detailCertificate from "./controls/detail-certificate.vue";
import detailLog from "./controls/detail-log.vue";
import contractLog from "./controls/contract-extension-log";
import prodList from "../prod/prodmanage/prod-list.vue";
import billList from "@c/suplier/bill/list";

export default {
  components: {
    detailBase,
    detailCertificate,
    detailLog,
    prodList,
    contractLog,
    billList,
  },
  props: {
    //查看参数
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      id: this.viewParam ? this.viewParam.id : Number(this.$route.params.id),
      activeName: "first",
      tableData: [],
      infoData: {}, // 基本信息
      soOptLogList: [], // 操作日志
      images: [], // 证件信息
      categoryList: [], // 基础类目
      supplySiteData: [] // 全部服务区域
    };
  },
  methods: {
    getDetailData(callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/groupSelect.json",
        data: {
          id: this.id
        },
        contentType: "form", //json,form,multipart
        succ: function(data) {
          self.infoData = data.data.supplyInfo;
          self.images = data.data.certifications;
          self.supplySiteData=data.data.serviceScopesList;
          // self.groupInfos = data.data.groupInfos
          self.soOptLogList = data.data.supplyLog;
          self.categoryList = data.data.categoryList;
          self.infoData.registration_time = moment(
            data.data.supplyInfo.registration_time
          ).format("YYYY-MM-DD");
          self.infoData.certificates_validity_begin = self.$commonUtil.valid.isEmpty(
            data.data.supplyInfo.certificates_validity_begin
          )
            ? null
            : moment(data.data.supplyInfo.certificates_validity_begin).format(
                "YYYY-MM-DD"
              );
          self.infoData.certificates_validity_end = self.$commonUtil.valid.isEmpty(
            data.data.supplyInfo.certificates_validity_end
          )
            ? null
            : moment(data.data.supplyInfo.certificates_validity_end).format(
                "YYYY-MM-DD"
              );
          self.infoData.corporate_identity_validity_end = self.$commonUtil.valid.isEmpty(
            data.data.supplyInfo.corporate_identity_validity_end
          )
            ? null
            : moment(
                data.data.supplyInfo.corporate_identity_validity_end
              ).format("YYYY-MM-DD");
          self.infoData.contract_validity_begin = self.$commonUtil.valid.isEmpty(
            data.data.supplyInfo.contract_validity_begin
          )
            ? null
            : moment(data.data.supplyInfo.contract_validity_begin).format(
                "YYYY-MM-DD"
              );
          self.infoData.contract_validity_end = self.$commonUtil.valid.isEmpty(
            data.data.supplyInfo.contract_validity_end
          )
            ? null
            : moment(data.data.supplyInfo.contract_validity_end).format(
                "YYYY-MM-DD"
              );
          self.infoData.identity_card_end = self.$commonUtil.valid.isEmpty(
            data.data.supplyInfo.identity_card_end
          )
            ? null
            : moment(data.data.supplyInfo.identity_card_end).format(
                "YYYY-MM-DD"
              );
          self.tableData = data.data.afterSaleInfoList;
          self.supplySiteData = data.data.serviceScopesList;
          if (callback) {
            callback();
          }
        }
      });
    }
  },
  created() {
    //获取明细信息
    var self = this;
    this.getDetailData(() => {
      self.$refs.detailBase.initData(self);
      self.$refs.detailCertificate.initData(self);
      //self.$refs.detailProd.initData(self);
      self.$refs.detailLog.initData(self);
      self.$refs.billInfo.searchFun(self.id);
    });
  }
};
</script>
