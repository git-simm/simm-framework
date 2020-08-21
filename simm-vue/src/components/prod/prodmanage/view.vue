<template>
  <section class="content-section product-view">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="商品信息" name="first">
        <view-base-info ref="detailBase" :base-data="baseData"></view-base-info>
        <view-img ref="imgList" :base-data="baseData"></view-img>
      </el-tab-pane>
      <el-tab-pane label="价格修改及审批记录" name="auditList">
        <price-audit-list ref="auditList" :prod-id="id"></price-audit-list>
      </el-tab-pane>
      <el-tab-pane label="SGU上架信息" name="sguList">
        <sgu-list ref="sguList" :prod-id="id" :pageMode="3"></sgu-list>
      </el-tab-pane>
      <el-tab-pane label="商品数据分析" name="prodAnalysis">
        <prod-analysis v-if="activeName==`prodAnalysis`" ref="prodAnalysis" :prod-id="id"></prod-analysis>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import viewHandler from "@/components/prod/prodmanage/view-handler";
export default {
  name: "ProdView",
  mixins: [viewHandler]
};
</script>

<style>
.product-view {
  padding-bottom: 20px !important;
}
</style>
