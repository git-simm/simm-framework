<template>
  <el-row ref="container">
    <slot :config="{labelWidth:labelWidth,itemSpan:itemSpan}"></slot>
  </el-row>
</template>

<script>
export default {
  name: "sxhViewContainer",
  props: {
    labelWidth: {
      type: Number,
      default: 100
    },
    itemSpan: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
