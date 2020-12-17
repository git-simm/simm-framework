<template>
  <el-row ref="container">
    <slot :config="{labelWidth:labelWidth,itemSpan:itemSpan}"></slot>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class SxhViewContainer extends Vue {
  @Prop({
    type: Number,
    default: 100
  })
  readonly labelWidth!: number
  @Prop({
    type: Number,
    default: 4
  })
  readonly itemSpan!: number
}
</script>
