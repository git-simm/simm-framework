/**
 * 渲染操作
 */
var iAttrs = {
  attrs: {
    class: "element-icons el-icon-warning",
    style: "margin-left:3px;"
  }
};
let renderFunc = (h, label, title) => {
  return h(
    "sxh-popover",
    {
      attrs: {
        tooltip: title,
        tooltipWidth: 320
      }
    },
    [h("span", label), h("i", iAttrs)]
  );
};
export default {
  methods: {
    totalSalesRender(h, { column, $index }) {
      return renderFunc(
        h,
        column.label,
        `1.本销量只提供参考,不作为具体订货数量,<br/>与订单系统会有3分钟延迟,请以销售订单为准;<br/>2.预售模式销量=当前SGU下商品累计销量;<br/>3.实物库存模式销量=当前商品累计销量。`
      );
    },
    grossProfitRender(h, { column, $index }) {
      return renderFunc(
        h,
        column.label,
        `系统计算公式为：<br/>1.团购分账毛利率=（平台服务费-团长佣金）/销售价;<br/>2.直购分账毛利率=（平台服务费-团长佣金-分享佣金）/销售价;<br/>3.非分账毛利率=（销售价-团长佣金-分享佣金-成本价）/销售价`
      );
    },
    virtualInfoRender(h, { column, $index }) {
      return renderFunc(
        h,
        column.label,
        `1.如虚拟销量为100，虚拟购买人数填写80，则表示80个人总共购买了100份;<br/>2.虚拟销量不能小于虚拟人数;<br/>3.若设值则虚拟人数与销量不能小于3;`
      );
    },
    limitRender(h, { column, $index }) {
      return renderFunc(
        h,
        column.label,
        `限购数量为每个用户最多可购买的商品数量，<br/>审核通过后，限购数量不允许修改`
      );
    }
  }
};
