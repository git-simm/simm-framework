<template>
  <el-col :span="realSpan" class="sxh_container_item">
    <span class="sxh_container_item_title" :style="`width:${realLabelWidth}px !important;`">
      <slot name="title">{{title}}</slot>
    </span>
    <span class="sxh_container_item_content">
      <slot></slot>
    </span>
  </el-col>
</template>

<script>
export default {
  name: "sxhViewItem",
  props: {
    title: {
      type: String,
      required: true,
      default: null
    },
    labelWidth: {
      type: Number,
      default: null
    },
    span: {
      type: Number,
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {
    parent() {
      return (this.$parent || {}).$parent || {};
    },
    realLabelWidth() {
      if (this.labelWidth == null && this.parent.labelWidth) {
        return this.parent.labelWidth;
      } else {
        return this.labelWidth;
      }
    },
    realSpan() {
      if (this.span == null && this.parent.itemSpan) {
        return this.parent.itemSpan;
      } else {
        return this.span;
      }
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.sxh_container_item {
  display: table;
  min-height: 36px;
  .sxh_container_item_title {
    background: #f1f1f1;
    display: table-cell;
    padding: 10px;
    border: 1px solid #e8e8e8;
  }
  .sxh_container_item_content {
    display: table-cell;
    padding: 0 10px;
    border: 1px solid #e8e8e8;
  }
  .sxh_container_item_content:hover {
    background: #ffffee;
  }
}
</style>