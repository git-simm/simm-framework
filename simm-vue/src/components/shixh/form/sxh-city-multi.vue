<template>
  <div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" v-if="filter"></el-input>
    <div :style="`height:${height}px;overflow:auto;`">
      <el-tree
        :data="cityList"
        show-checkbox
        node-key="treeId"
        ref="tree"
        highlight-current
        auto-expand-parent
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        @check-change="handleCheckChange"
        :filter-node-method="filterNode"
      ></el-tree>
    </div>
    <div class="city_tag_list">
      <el-tag
        size="mini"
        effect="plain"
        v-for="(item,index) in checkedCities.filter(a=>a.label>'')"
        :key="index"
      >{{item.label}}</el-tag>
    </div>
  </div>
</template>
<script>
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "SxhCityMulti",
  mixins: [baseMixin],
  props: {
    defaultExpandedKeys: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    defaultCheckedKeys: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    defaultProps: {
      children: "children",
      label: "label"
    },
    height: {
      type: Number,
      required: false,
      default: 300
    },
    filter: {
      type: Boolean,
      required: false,
      default: true
    },
    //是否显示tag标签
    showTags: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    expandedKeys() {
      if (this.checkedNodes.length > 0) {
        return this.checkedNodes;
      }
      return this.defaultExpandedKeys.length === 0
        ? ["g_99999"]
        : this.defaultExpandedKeys;
    },
    checkedKeys() {
      //处理选中的城市
      this.checkedCities = this.cities
        .filter(c => (this.defaultCheckedKeys || []).includes(c.admin_shop_id))
        .map(c => {
          return {
            label: c.level_name,
            value: c.admin_shop_id
          };
        });
      return (this.defaultCheckedKeys || []).map(a => `c_${a}`);
    }
  },
  data() {
    return {
      filterText: "",
      cityList: [],
      cities: [],
      provinces: [],
      checkedNodes: [],
      checkedCities: []
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getCityTree(this.wrapAddress);
  },
  methods: {
    /**
     * 过滤节点
     */
    filterNode(value, data) {
      if (!value) return true;
      return (data.label || "").includes(value);
    },
    handleCheckChange(data, checked, indeterminate) {
      var nodes = this.getTree().getCheckedNodes();
      this.checkedCities = (nodes || []).filter(n => n.type == 2);
    },
    /**
     * 获取树控件
     */
    getTree() {
      return this.$refs.tree;
    },
    /**
     * 获取选中的城市列表
     */
    getCheckedCityList() {
      var nodes = this.getTree().getCheckedNodes();
      var cityIds = (nodes || []).filter(n => n.type == 2).map(n => n.value);
      var choosed = this.cities.filter(c => cityIds.includes(c.admin_shop_id));
      return choosed;
    },
    /**
     * 地址组装
     */
    wrapAddress(tree, provinces, cities) {
      var self = this;
      self.cityList = tree;
      self.provinces = provinces;
      self.cities = cities;
    },
    /**
     * 设置选中项
     */
    setCheckedKeys(keys) {
      var checked = (keys || []).map(a => `c_${a}`);
      this.checkedNodes = checked;
      this.$refs.tree.setCheckedKeys(checked);
    }
  }
};
</script>
<style lang="less">
.city_tag_list {
  max-height: 60px;
  overflow: auto;
  margin-top: 5px;
  line-height: 20px !important;
}
</style>