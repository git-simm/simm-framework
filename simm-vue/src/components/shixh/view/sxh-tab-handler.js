/**
 * 动态tab的处理
 */
export default {
  methods: {
    /**
     * 显示明细
     */
    show(comp, viewParam) {
      //按需加载
      import('./detail-comp-map.js')
        .then(({ compMap }) => {
          var currentComp = compMap.get(comp);
          if (!currentComp) {
            this.$commonUtil.valid.throwEx("未注册明细组件");
          }
          viewParam = viewParam || {};
          if (window.self !== window.top && currentComp.getUrl && !viewParam.isDrawer) {
            //iframe嵌套模式，则打开新页面
            this.$openTab({
              name: `${currentComp.name}[${viewParam.number || viewParam.id}]`,
              url: currentComp.getUrl(viewParam),
            });
          } else if (currentComp.comp) {
            //有抽屉组件则显示抽屉
            this.$refs.viewDramer.showDrawer();
          } else if (currentComp.getUrl) {
            //只提供了url，则切换新界面
            this.$router.push({
              path: currentComp.getUrl(viewParam),
            });
          } else {
            this.$commonUtil.valid.throwEx("未注册明细组件");
          }
        });
    }
  }
};
