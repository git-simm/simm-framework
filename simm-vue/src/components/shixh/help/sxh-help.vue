<template>
  <span class="text-left">
    <el-popover placement="top-start" :width="tooltipWidth" trigger="hover">
      <div v-html="tooltip"></div>
      <span slot="reference" @click="showDoc">
        <slot>
          <span v-if="!mini" style="font-size:20px;color:gray;padding:5px;">
            <i class="el-icon-question"></i>
          </span>
          <i v-else class="element-icons el-icon-question"></i>
        </slot>
      </span>
    </el-popover>
    <sxh-help-drawer-detail ref="helpDetail" :code="code"></sxh-help-drawer-detail>
  </span>
</template>
<script>
import sxhHelpDrawerDetail from "./sxh-help-drawer-detail";
export default {
  name: "sxhHelp",
  components: { sxhHelpDrawerDetail },
  props: {
    code: {
      type: String,
      required: true,
      default: null
    },
    mini: {
      type: Boolean,
      required: false,
      default: false
    },
    tooltip: {
      type: String,
      required: false,
      default: "点击查看操作手册"
    },
    tooltipWidth: {
      type: Number,
      required: false,
      default: 200
    },
    /**
     * 预览标题
     */
    previewTitle: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 显示数据
     */
    showDoc() {
      this.$refs.helpDetail.showDrawer();
      // this.$layer.iframe({
      //   content: {
      //     content: sxhHelpDetail, //传递的组件对象
      //     parent: this, //当前的vue对象
      //     data: {
      //       code: this.code
      //     }
      //   },
      //   area: ["800px", document.documentElement.clientHeight - 50 + "px"],
      //   shadeClose: false,
      //   // maxmin: true,
      //   title: (this.previewTitle || `帮助中心`) + `【${this.code}】`,
      //   skin: "simm",
      //   contentStyle: "height:92% !important;"
      //   //type: 1, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
      // });
    }
  }
};
</script>