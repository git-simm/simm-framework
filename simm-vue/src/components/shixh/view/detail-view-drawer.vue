<template>
  <el-drawer
    :title="`${comp.name}详情`"
    ref="drawer"
    :visible.sync="drawer"
    :direction="direction"
    append-to-body
    :modal-append-to-body="false"
    :destroy-on-close="true"
    :size="iframe?`100%`:`90%`"
  >
    <template slot="title">
      <span role="heading">
        <el-button
          icon="el-icon-back"
          size="mini"
          @click="goBack"
          style="margin-right: 10px;width:80px;"
        >返回</el-button>
        {{comp.name}}信息
      </span>
    </template>
    <component :is="comp.comp" :viewParam="{...{goBack:goBack},...viewParam}"></component>
  </el-drawer>
</template>

<script>
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "detailViewDrawer",
  mixins: [baseMixin],
  props: {
    comp: {
      type: Object,
      required: true,
      default: {}
    },
    direction: {
      type: String,
      default: "rtl"
    },
    viewParam: {
      type: Object,
      default: {}
    }
  },
  data: function(router) {
    return {};
  },
  computed: {
    iframe() {
      return window.self !== window.top;
    }
  },
  methods: {
    goBack() {
      this.$refs.drawer.closeDrawer();
    }
  }
};
</script>
