<template>
  <el-cascader
    :options="categoryOptions"
    :props="{ checkStrictly: checkStrictly }"
    v-model="categoryList"
    placeholder="请选择类目"
    filterable
    clearable
    @change="change"
  ></el-cascader>
</template>
<script>
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "sxhCategory",
  mixins: [baseMixin],
  props: {
    value: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    level: {
      type: Number,
      required: false,
      default: 3 //默认显示3级
    },
    fixLevel: {
      type: Boolean,
      required: false,
      default: false //绝对层级
    },
    effective: {
      type: Boolean,
      required: false,
      default: false //是否只取有效的数据
    },
    checkStrictly: {
      type: Boolean,
      required: false,
      default: true //默认可以取任意层级
    }
  },
  data() {
    return {
      categoryList: this.value
    };
  },
  model: {
    prop: "value",
    event: "valChange"
  },
  watch: {
    value(newVal) {
      this.categoryList = newVal;
    }
  },
  mounted() {
    var self = this;
    this.getCategoryList(
      data => {
        return data.filter(c => c.categoryLevel <= self.level);
      },
      treeNodes => {
        if (!self.fixLevel) {
          return;
        }
        //强制处理回调信息
        if (self.level == 2) {
          treeNodes.forEach(node => {
            node.children = node.children || [];
          });
        } else if (self.level == 3) {
          treeNodes.forEach(node => {
            node.children = node.children || [];
            node.children.forEach(second => {
              second.children = second.children || [];
            });
          });
        }
      }
    );
  },
  methods: {
    change(val) {
      this.$emit("valChange", val);
      var data = {};
      data.categoryList = val;
      data.categoryId = "";
      data.twoCategoryId = "";
      data.threeCategoryId = "";
      if (val == null) {
        return;
      }
      if (val.length >= 3) {
        data.threeCategoryId = val[2];
      }
      if (val.length >= 2) {
        data.twoCategoryId = val[1];
      }
      if (val.length >= 1) {
        data.categoryId = val[0];
      }
      this.$emit("change", data);
    }
  }
};
</script>
