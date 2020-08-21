/**
 * spu导出列表字段说明
 */
export default {
  name: "spuExport",
  methods: {
    getTitle: () => {
      return "SPU产品信息导出";
    }
  },
  attrs: {
    jointName: {
      label: "SPU名称"
    },
    spuNumber: {
      label: "SPU编码"
    },
    categoryName: {
      label: "一级类目"
    },
    twoCategoryName: {
      label: "二级类目"
    },
    threeCategoryName: {
      label: "三级类目"
    },
    brandName: {
      label: "品牌"
    },
    placeName: {
      label: "产地"
    },
    isSelfBrand: {
      label: "是否为自由品牌",
      dic:'isSelfBrand',
    },
    storageModeCode: {
        label: "商品属性",
        dic:'storage_method',
    },
    quaranteePeriodCode: {
        label: "保质期",
        get: data => {
          return data.quaranteePeriodCode+"天";
        }
    },
    processStatus: {
      label: "审核状态",
      dic:'prod_audit_status_new',
    },
    createAt: {
      label: "创建时间"
    },
    creatorName: {
        label: "创建人"
    }
  }
};
