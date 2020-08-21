<template>
  <span class="sxh-img-store">
    <el-button
            :size="size"
            v-if="canChoose"
            @click="chooseImg"
            icon="el-icon-search"
            :title="title"
    >图库</el-button>
    <img-store-drawer
            ref="chooseImg"
            :limit="limit"
            :can-choose="canChoose"
            :search-param="{spuList:spuList,skuList:skuList,supplyList:supplyList,sguImageFlag:sguImageFlag}"
            @change="changeHandler"
    ></img-store-drawer>
  </span>
</template>
<script>
    import imgStoreDrawer from "./img-store-drawer";

    export default {
  name: "sxhImgStore",
  props: {
    size: {
      type: String,
      default: "mini"
    },
    canChoose: {
      type: Boolean,
      required: false,
      default: true
    },
    spuList: {
      type: Array,
      default() {
        return [];
      }
    },
      title: {
          type: String,
          required: false,
          default: "可以从图库中选择商品图"
      },
      limit: {
          type: Number,
          required: false,
          default: -1
      },
    skuList: {
      type: Array,
      default() {
        return [];
      }
    },
    supplyList:{
      type:Array,
      default(){
        return [];
      }
    },
    sguImageFlag:{
      type:Boolean,
      required: false,
      default: false
    }
  },
  components: { imgStoreDrawer },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      currentValue: this.value
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    value(value) {
      this.currentValue = value;
      this.handleCheckedChange(value);
    }
  },
  methods: {
    /**
     * 显示图库
     */
    show() {
      this.chooseImg();
    },
    /**
     * 选择图片
     */
    chooseImg() {
      //1.先判断是否有spu信息
      var spuList = (this.spuList || []).filter(a => a > "");
      var skuList = (this.skuList || []).filter(a => a > "");
      var supplyList = (this.supplyList || []).filter(a => a > "");
      var sguImageFlag=this.sguImageFlag;
      if (spuList.length == 0 && skuList.length == 0) {
        //取有效的值
        this.$message({
          message: "请先选择sku,再查询图库",
          type: "warning"
        });
        return;
      }
      //如果有spu信息，则按spu进行查询
      if (spuList.length > 0) {
        skuList = [];
      }
      this.$refs.chooseImg.showDrawer();
      this.$refs.chooseImg.getStoreImgs(spuList, skuList,supplyList,sguImageFlag);
    },
    changeHandler(list) {
      this.$emit("change", list);
    }
  }
};
</script>
<style lang="less">
.sxh-img-store .el-drawer__wrapper {
  z-index: 2001 !important;
}
.sxh-img-store .v-modal {
  z-index: 2000 !important;
}
</style>
