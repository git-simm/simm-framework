<template>
  <section class="content-section">
    <div style="margin:0 40px">
      <el-steps :active="3" finish-status="success">
        <el-step title="创建" description="李闻洁 2020-6-23 18:23:04"></el-step>
        <el-step title="商品管理员审批" description="孔硕 2020-6-24 19:21:04"></el-step>
        <el-step title="供应商审批" description="武汉科技有限公司"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <h4>基本信息</h4>
    <el-row>
      <el-col :span="18">
        <sxh-view-container :item-span="12" :label-width="120" style="padding:10px;">
          <sxh-view-item title="供应商">{{formData.prodInfo.supplyName}}</sxh-view-item>
          <sxh-view-item title="供应商编码">{{formData.prodInfo.supplyNumber}}</sxh-view-item>
          <sxh-view-item title="商品名称">{{formData.prodInfo.prod_name}}</sxh-view-item>
          <sxh-view-item
            title="销售模式"
          >{{ $cacheUtil.getVal('settltType',formData.prodInfo.merchant_model,'' ) }}</sxh-view-item>
          <sxh-view-item title="SKU编码">{{formData.prodInfo.prod_number}}</sxh-view-item>
          <sxh-view-item
            title="类目"
          >{{`${formData.category_name} / ${formData.two_category_name} / ${formData.three_category_name}`}}</sxh-view-item>
          <sxh-view-item
            title="商品属性"
          >{{ $cacheUtil.getVal('storage_method',formData.storage_method )}}</sxh-view-item>
          <sxh-view-item title="保质期">{{formData.quaranteePeriodCode}}</sxh-view-item>
          <sxh-view-item title="规格">{{formData.prodInfo.specification}}</sxh-view-item>
          <sxh-view-item title="单位">{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            title="箱规"
          >1{{formData.prodInfo.unit_box_name}}={{formData.prodInfo.unit_box_number}}{{formData.prodInfo.unit_name}}</sxh-view-item>
          <sxh-view-item
            title="供应商归属"
          >{{ $cacheUtil.getVal('is_direct_purchasing',formData.prodInfo.is_direct_purchasing,'' ) }}</sxh-view-item>
          <sxh-view-item
            title="是否分账"
          >{{ $cacheUtil.getVal('is_sub_account',formData.prodInfo.is_sub_account,'' ) }}</sxh-view-item>
          <sxh-view-item
            title="审核状态"
          >{{$cacheUtil.getVal('prod_audit_status',formData.prodInfo.processStatus,'')}}</sxh-view-item>
          <sxh-view-item title="归属">
            {{$cacheUtil.getVal('user_role_type',formData.prodInfo.creator_role,'' ) }}
            <span
              v-if="formData.prodInfo.creator_role==1 || formData.prodInfo.creator_role==2"
            >
              (
              <span>{{formData.prodInfo.provinceName}}</span>
              <span v-if="formData.prodInfo.creator_role==2">- {{formData.prodInfo.cityName}}</span>
              )
            </span>
          </sxh-view-item>
          <sxh-view-item
            title="是否代理供应商"
          >{{$cacheUtil.getVal('is_agent',formData.prodInfo.isAgent,'')}}</sxh-view-item>
          <sxh-view-item title="推荐语">{{formData.prodInfo.recommend_content}}</sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: "ProdEditArea",
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
