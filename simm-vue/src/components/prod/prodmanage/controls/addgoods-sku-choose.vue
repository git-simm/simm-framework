<template>
  <el-drawer
    title="选择sku"
    ref="drawer"
    :visible.sync="drawer"
    :direction="direction"
    :destroy-on-close="true"
    size="90%"
    @visibleChange="val => (drawer = val)"
  >
    <select-sku :append-to-body="true" :search-param="getFilter()" @use="use"></select-sku>
  </el-drawer>
</template>

<script>
import baseMixin from "@/common/mixins/baseMixin";
import selectSku from "@/components/base/prod/info/list";
export default {
  name: "chooseSku",
  props: {
    direction: {
      type: String,
      default: "rtl"
    },
    searchParam: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: { selectSku },
  mixins: [baseMixin],
  data: function(router) {
    return {
      searchFilter: {
        fromAddProdPage: true
      }
    };
  },
  created() {
    this.getCategoryList();
    this.getSalesModelData();
  },
  methods: {
    getFilter() {
      return {
        ...this.searchParam,
        ...this.searchFilter
      };
    },
    /**
     * 使用
     */
    use(sku) {
      this.$emit("use", sku);
      this.$refs.drawer.closeDrawer();
    }
  }
};
</script>
