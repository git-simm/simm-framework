<template>
  <section class="content-section product-view">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本信息" name="first">
        <prod-base-info ref="detailBase"></prod-base-info>
      </el-tab-pane>
      <el-tab-pane label="价格修改及审批记录" name="auditList">
        <price-audit-list ref="auditList" :prod-id="Number($route.params.id)"></price-audit-list>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-row class="col-sm-9">
      <input type="button" class="btn btn-default" value="返回" @click="goBack" />
    </el-row>-->
  </section>
</template>

<script>
import moment from "moment";
import prodBaseInfo from "./controls/prod-baseinfo";
import prodPriceList from "./controls/prod-price-list";
import baseMixin from "@/common/mixins/baseMixin";
import requestMixin from "@/common/mixins/requestMixin";
import priceAuditList from "./controls/price-audit-list";
export default {
  name: "ProdEditArea",
  mixins: [baseMixin, requestMixin],
  components: {
    "prod-base-info": prodBaseInfo,
    priceAuditList
  },
  data: function() {
    return {
      activeName: "first",
      formData: {}
    };
  }
};
</script>
