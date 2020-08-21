<template>
  <span>
    <a
      v-if="viewParam.isLink"
      href="javascript:void(0);"
      @click="show()"
    >{{`${viewParam.label||'查看'}`}}</a>
    <!-- icon="el-icon-document" -->
    <el-button v-else plain size="minier" @click="show()">{{`${viewParam.label||'查看'}`}}</el-button>
    <detail-view-drawer ref="viewDramer" :comp="currentComp" :view-param="viewParam"></detail-view-drawer>
  </span>
</template>
<script>
import detailViewDrawer from "./detail-view-drawer";
import { compMap } from "./detail-comp-map";
export default {
  name: "sxhDetailView",
  props: {
    comp: {
      type: String,
      required: false,
      default: ""
    },
    //{id:scope.row.id,number:scope.row.sguNumber,isDrawer:true,label:'显示的按钮名',isLink:false}
    //isLink：显示成链接样式
    //isDrawer：是否以抽屉形式展示
    viewParam: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      //打开类型(1:iframe;2:抽屉;3:页面切换)
      openType: 0
    };
  },
  components: { detailViewDrawer },
  computed: {
    currentComp() {
      return compMap.get(this.comp);
    },
    iframe() {
      return window.self !== window.top;
    }
  },
  methods: {
    /**
     * 显示明细
     */
    show() {
      if (!this.currentComp) {
        this.$commonUtil.valid.throwEx("未注册查看明细组件");
      }
      var viewParam = this.viewParam || {};
      if (this.iframe && this.currentComp.getUrl && !viewParam.isDrawer) {
        this.openType = 1;
        //iframe嵌套模式，则打开新页面
        this.$openTab({
          name: `${this.currentComp.name}[${viewParam.number || viewParam.id}]`,
          url: this.getUrl()
        });
      } else if (this.currentComp.comp) {
        //有抽屉组件则显示抽屉
        this.openType = 2;
        this.$refs.viewDramer.showDrawer();
      } else if (this.currentComp.getUrl) {
        //只提供了url，则切换新界面
        this.openType = 3;
        this.$router.push({ path: this.getUrl() });
      } else {
        this.$commonUtil.valid.throwEx("未注册查看明细组件");
      }
    },
    /**
     * 关闭iframe-tab页
     */
    closeTab() {
      if (this.openType === 1) {
        this.$closeTab(this.getUrl());
      }
    },
    /**
     * 刷新iframe-tab页
     */
    refreshTab() {
      if (this.openType === 1) {
        this.$refreshTab(this.getUrl());
      }
    },
    /**
     * 获取地址
     */
    getUrl() {
      return this.currentComp.getUrl(this.viewParam);
    }
  }
};
</script>
