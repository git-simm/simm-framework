<template>
  <div>
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <el-checkbox-group v-model="currentValue" @change="handleCheckedChange">
      <el-checkbox
        v-for="(item, index) in list"
        :key="dic + index"
        :label="item.key"
      >{{ item.value }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: "sxhCheckboxGroup",
  props: {
    dic: {
      type: String,
      default: null
      // required: true
    },
    data: {
      type: Array,
      required: false,
      default() {
        return null;
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      currentValue: this.value ||[]
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
  computed: {
    list: function() {
      if ((this.data || []).length > 0) {
        return this.data;
      } else if (this.dic > "") {
        return (this.$cacheUtil.getDic(this.dic) || []);
      }
      return [];
    }
  },
  methods: {
    handleCheckAllChange(checked) {
      this.currentValue = checked ? this.list.map(item => item.key) : [];
      this.isIndeterminate = false;
      this.$emit("change", this.currentValue);
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
      this.$emit("change", value);
    }
  }
};
</script>
