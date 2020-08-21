<template>
  <section class="content-section business-analysis">
    <!-- SGU图标 -->
    <el-row>
      <el-col :span="12">
        <sxh-purchase-chart ref="spu" business-code="spu" :height="350"></sxh-purchase-chart>
      </el-col>
      <el-col :span="12">
        <sxh-purchase-chart ref="sku" business-code="sku" :height="350"></sxh-purchase-chart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <sxh-purchase-chart ref="supply" business-code="supply" :height="350"></sxh-purchase-chart>
      </el-col>
      <el-col :span="12">
        <sxh-purchase-chart ref="prod" business-code="prod" :height="350"></sxh-purchase-chart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <sxh-purchase-chart ref="sgu" business-code="sgu"></sxh-purchase-chart>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: "business-data-chart",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
</style>