<template>
  <section class="content-section layer-container">
    <el-table
      :data="stockList"
      highlight-current-row
      border
      show-summary
      ref="stockList"
      size="mini"
      height="520"
      class="stock-list"
    >
      <el-table-column prop="cityName" label="城市"></el-table-column>
      <el-table-column prop="inventory" sortable label="库存"></el-table-column>
      <el-table-column prop="usableInventory" sortable label="可用库存"></el-table-column>
      <el-table-column prop="occupyInventory" sortable label="占用库存"></el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: "skuStockList",
  data: function() {
    return {
      skuNumber: "",
      stockList: []
    };
  },
  created() {
    this.skuNumber = this.$options.propsData.skuNumber;
    this.stockList = this.$options.propsData.stockList;
  },
  methods: {}
};
</script>
