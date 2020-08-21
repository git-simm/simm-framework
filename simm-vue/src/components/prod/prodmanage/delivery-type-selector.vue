<template>
  <!-- 选择SGU上架配送模式 -->
  <section class="content-section layer-container delivery-type">
    <div style="width:100%;height:100%;overflow:auto;">
      <el-button style="width: 220px" class="btn-default row-button" @click="deliveryTypeSelect(1)">
        <div>
          <h3>团购包邮</h3>
        </div>
        <div>
          <span>一件代发，商品包邮，送货到家</span>
        </div>
      </el-button>
      <el-button style="width: 220px" class="btn-default row-button" @click="deliveryTypeSelect(2)">
        <div>
          <h3>团购自提</h3>
        </div>
        <div>
          <span>团长分发货，顾客自提</span>
        </div>
      </el-button>
    </div>
  </section>
</template>

<script>
import sxhTabHandler from "@/components/shixh/view/sxh-tab-handler";
export default {
  name: "deliveryTypeSelector",
  mixins: [sxhTabHandler],
  data: function() {
    return {
      // 商品id
      prodId: null,
      prodNumber: "",
      // 配送方式
      deliveryType: null
    };
  },
  created() {
    this.prodId = this.$options.propsData.prodId;
    this.prodNumber = this.$options.propsData.prodNumber;
    this.deliveryType = this.$options.propsData.deliveryType;
  },
  methods: {
    deliveryTypeSelect(type) {
      this.show("onsale", {
        prodId: this.prodId,
        number: `${this.prodId}-${this.prodNumber}`,
        deliveryType: type
      });
      this.$layerUtil.closeWin(this);
    }
  }
};
</script>