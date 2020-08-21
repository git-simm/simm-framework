<template>
  <section class="content-section prod-detail">
    <prod-steps v-if="baseData.isAudit" :prod-info="formData.prodInfo"></prod-steps>
    <h4>供应商信息</h4>
    <el-row>
      <el-col :span="22">
        <sxh-view-container :item-span="8" :label-width="120" style="padding:10px;">
          <sxh-view-item title="供应商名称">{{formData.prodInfo.supplyName}}</sxh-view-item>
          <sxh-view-item title="供应商简称">{{formData.prodInfo.supplyShortName}}</sxh-view-item>
          <sxh-view-item title="营业执照名称">{{formData.prodInfo.companyName}}</sxh-view-item>
          <sxh-view-item title="供应商编码">{{formData.prodInfo.supplyNumber}}</sxh-view-item>
          <sxh-view-item
            title="配送方式"
          >{{$cacheUtil.getVal('delivery_type',formData.prodInfo.deliveryType)}}</sxh-view-item>
          <sxh-view-item
            title="是否分账"
          >{{ $cacheUtil.getVal('is_sub_account',formData.prodInfo.is_sub_account,'' ) }}</sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h4>商品信息</h4>
    <el-row>
      <el-col :span="22">
        <sxh-view-container :item-span="8" :label-width="120" style="padding:10px;">
          <sxh-view-item title="商品名称">{{formData.prodInfo.prod_name}}</sxh-view-item>
          <sxh-view-item title="SKU编码">{{formData.prodInfo.prod_number}}</sxh-view-item>
          <sxh-view-item
            title="类目"
          >{{`${formData.category_name} / ${formData.two_category_name} / ${formData.three_category_name}`}}</sxh-view-item>
          <sxh-view-item
            title="商品属性"
          >{{ $cacheUtil.getVal('storage_method',formData.storage_method )}}</sxh-view-item>
          <sxh-view-item title="规格">{{formData.prodInfo.specification}}</sxh-view-item>
          <sxh-view-item title="售后时效">{{formData.prodInfo.afterTime}}天</sxh-view-item>
          <sxh-view-item title="单位">{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            title="箱规"
          >1{{formData.prodInfo.unit_box_name}}={{formData.prodInfo.unit_box_number}}{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item title="保质期">{{formData.quaranteePeriodCode}}天</sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
    <el-divider></el-divider>
  </section>
</template>

<script>
import prodSteps from "@/components/prod/prodmanage/controls/prod-steps";
export default {
  name: "ProdViewBase",
  components: { prodSteps },
  props: {
    baseData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: function() {
    return {
      prodTypeData: [],
      formData: {
        prodInfo: {}
      }
    };
  },
  methods: {
    initData(data) {
      var self = this;
      this.formData = {
        ...this.formData,
        ...data
      };
    }
  }
};
</script>
<style lang="less">
.prod-detail {
  .el-divider {
    margin: 10px 0;
  }
}
</style>