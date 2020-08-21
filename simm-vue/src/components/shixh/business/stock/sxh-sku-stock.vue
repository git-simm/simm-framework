<template>
  <span v-if="summary===0">0</span>
  <a href="javascript:void(0);" @click="showStockList()" v-else>{{summary}}</a>
</template>
<script>
import skuStockList from "./sku-stock-list";
export default {
  name: "sxhSkuStock",
  props: {
    //sku编码
    skuNumber: {
      type: String,
      require: true,
      default: ""
    },
    //库存列表
    stockList: {
      type: Array,
      require: true,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      summary: 0
    };
  },
  created() {
    //汇总一个结果
    if ((this.stockList || []).length > 0) {
      this.summary = this.stockList.sum(a => a.inventory);
    }
  },
  methods: {
    /**
     * 显示库存信息
     */
    showStockList() {
      this.$layerUtil.openWin(this, {
        title: `【${this.skuNumber}】库存信息列表`,
        area: ["600px", "600px"],
        data: {
          skuNumber: this.skuNumber,
          stockList: this.stockList
        },
        component: skuStockList
      });
    }
  }
};
</script>
