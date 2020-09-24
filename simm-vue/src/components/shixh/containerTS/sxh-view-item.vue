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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SxhViewItem extends Vue {
  @Prop({
    type: String,
    required: true,
    default: null
  })
  readonly title!: string;
  @Prop({
    type: Number,
    default: null
  })
  readonly labelWidth!: number;
  @Prop({
    type: Number,
    default: null
  })
  readonly span!: number;

  get parent() {
    return (this.$parent || {}).$parent || {};
  }

  get realLabelWidth() {
    if (this.labelWidth == null && this.parent.labelWidth) {
      return this.parent.labelWidth;
    } else {
      return this.labelWidth;
    }
  }

  get realSpan() {
    if (this.span == null && this.parent.itemSpan) {
      return this.parent.itemSpan;
    } else {
      return this.span;
    }
  }
}
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