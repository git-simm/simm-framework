<template>
  <el-popover
    placement="top-start"
    v-if="tooltip>''"
    :title="title"
    :width="tooltipWidth"
    trigger="hover"
  >
    <div v-html="tooltip"></div>
    <span slot="reference">
      <slot>
        <i class="element-icons el-icon-warning"></i>
      </slot>
    </span>
  </el-popover>
</template>

<script>
export default {
  name: "sxhPopover",
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    tooltip: {
      type: String,
      required: false,
      default: null
    },
    tooltipWidth: {
      type: Number,
      required: false,
      default: 200
    }
  }
};
</script>
