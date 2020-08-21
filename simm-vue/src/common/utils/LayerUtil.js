/**
 * Layer插件的全局使用
 */
export default {
  /**
   * 关闭窗口
   */
  closeWin: function (vueInstance) {
    if (vueInstance) {
      if (vueInstance.$options.propsData.layerid) {
        vueInstance.$layer.close(vueInstance.$options.propsData.layerid);
      } else {
        vueInstance.$layer.closeAll('iframe');
        // layer.closeAll(); //疯狂模式，关闭所有层

        // layer.closeAll('dialog'); //关闭信息框

        // layer.closeAll('page'); //关闭所有页面层

        // layer.closeAll('iframe'); //关闭所有的iframe层

        // layer.closeAll('loading'); //关闭加载层

        // layer.closeAll('tips'); //关闭所有的tips层
      }
    }
  },
  /**
   * 打开窗口
   * @param {*} vue
   * @param {*} param
   */
  openWin: function (vue, param) {
    if (param == null) return;
    vue.$layer.iframe({
      content: {
        content: param.component, //传递的组件对象
        parent: vue, //当前的vue对象
        data: param.data
      },
      area: param.area,
      shadeClose: false,
      title: param.title,
      // class: "ceshi"
      //type: 1, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
    });
  }
};
