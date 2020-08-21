let math = require("mathjs");
/**
 * sgu导出列表字段说明
 */
function getSaleTime(data) {
  if (data.isCycleOnSale === 1) {
    data.onSaleTime = data.cycleStartDate + " " + data.cycleStartTime;
    data.takenOffTime = data.cycleEndDate + " " + data.cycleEndTime;
  } else {
    data.onSaleTime = data.onSaleTime;
    data.takenOffTime = data.takenOffTime;
  }
}
export default {
  name: "sguExport",
  methods: {
    getSaleTime,
    getTitle: () => {
      return "上架商品详情导出";
    }
  },
  attrs: {
    addressCity: {
      label: "城市"
    },
    sguName: {
      label: "销售名称"
    },
    sguNumber: {
      label: "SGU编码"
    },
    createAt: {
      label: "创建时间"
    },
    creatorName: {
      label: "创建人姓名"
    },
    creatorMobile: {
      label: "创建人手机"
    },
    processStatus: {
      label: "审核状态",
      dic: "prod_audit_status"
    },
    onSale: {
      label: "状态",
      dic: "sgu_on_sale"
    },
    sort: {
      label: "排序码"
    },
    distributionType: {
      label: "业务类型",
      dic: "distribution_type"
    },
    deliveryType: {
      label: "配送方式",
      dic: "delivery_type"
    },
    postage: {
      label: "快递运费"
    },
    isCycleOnSale: {
      label: "上架模式",
      show: data => {
        if (data === 1) {
          return true;
        } else {
          return false;
        }
      },
      dic: "is_cycle_onsale"
    },
    supplyName: {
      label: "供应商名称"
    },
    categoryName: {
      label: "一级类目"
    },
    twoCategoryName: {
      label: "二级类目"
    },
    prodNumber: {
      label: "sku编码"
    },
    prodName: {
      label: "商品名称"
    },
    salePrice: {
      label: "销售价"
    },
    // commissionRate: {
    //   label: "佣金比例",
    //   get: data => {
    //     return data.commissionRateShow + "%";
    //   }
    // },
    commissionAmount: {
      label: "团长佣金"
    },
    prodPrice: {
      label: "成本价"
    },
    marketPrice: {
      label: "划线价"
    },
    grossProfitRate: {
      label: "毛利率",
      get: data => {
        return data.grossProfitRate + "%";
      }
    },
    sellableStock: {
      label: "可售数量"
    },
    arrivalDate: {
      label: "预计到货时间",
      get: data => {
        if (data.delivery_type === 1) {
          return "";
        } else {
          return data.arrivalDate;
        }
      }
    },
    sendDate: {
      label: "预计发货时间",
      get: data => {
        if (data.delivery_type === 1) {
          return data.sendDate;
        } else {
          return "";
        }
      }
    },
    onSaleTime: {
      label: "上架时间"
    },
    takenOffTime: {
      label: "下架时间"
    }
  }
};