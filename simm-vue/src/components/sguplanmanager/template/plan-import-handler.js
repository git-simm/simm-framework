import moment from "moment";
export default {
    data(){
        return {
            baseValid:this.$commonUtil.formValid.baseValid,
            planFields:
                [{
                    fieldName: "sguType",
                    colName: "SGU类型",
                    isProdInfo: false,
                    valFields: [{key:"自提SGU",val:2},{key:"包邮SGU",val:1}]
                },{
                    fieldName: "supplyNumber",
                    colName: "供应商编码",
                    isProdInfo: false
                }, {
                    fieldName: "deliveryType",
                    colName: "配送方式",
                    isProdInfo: false
                }, {
                    fieldName: "sort",
                    colName: "排序码",
                    isProdInfo: false,
                    beInteger:true
                }, {
                    fieldName: "onlyPartner",
                    colName: "仅团长购买",
                    isProdInfo: false,
                    valFields: [{key:"是",val:1},{key:"否",val:0}]
                }, {
                    fieldName: "isNextDay",
                    colName: "是否次日达",
                    isProdInfo: false,
                    valFields: [{key:"是",val:1},{key:"否",val:0}]
                }, {
                    fieldName: "exchange",
                    colName: "是否换购商品",
                    isProdInfo: false,
                    valFields: [{key:"是",val:1},{key:"否",val:0}]
                }, {
                    fieldName: "onSaleTime",
                    colName: "上架时间",
                    isProdInfo: false,
                    isDate:true
                }
                    , {
                    fieldName: "takenOffTime",
                    colName: "下架时间",
                    isProdInfo: false,
                    isDate:true
                }
                    , {
                    fieldName: "distributionTemplateId",
                    colName: "配送范围",
                    isProdInfo: false,
                    beInteger:true
                }
                    , {
                    fieldName: "prefixName",
                    colName: "销售前缀",
                    isProdInfo: false
                }
                    , {
                    fieldName: "tag",
                    colName: "标签",
                    isProdInfo: false
                }
                    , {
                    fieldName: "skuNumber",
                    colName: "SKU码",
                    isProdInfo: true
                }
                    , {
                    fieldName: "platformServiceFee",
                    colName: "平台服务费",
                    isProdInfo: true,
                    isAmount:true
                }, {
                    fieldName: "salePrice",
                    colName: "销售价",
                    isProdInfo: true,
                    isAmount:true
                }, {
                    fieldName: "prodPrice",
                    colName: "成本价",
                    isProdInfo: true,
                    isAmount:true
                }
                    , {
                    fieldName: "marketPrice",
                    colName: "划线价",
                    isProdInfo: true,
                    isAmount:true
                }
                    , {
                    fieldName: "commissionAmount",
                    colName: "团长佣金",
                    isProdInfo: true,
                    isAmount:true
                }, {
                    fieldName: "sharedCommissionAmount",
                    colName: "分享佣金",
                    isProdInfo: true,
                    isAmount:true
                }, {
                    fieldName: "sellableStock",
                    colName: "可售数量",
                    isProdInfo: true,
                    beInteger:true
                }
                    , {
                    fieldName: "sendHours",
                    colName: "预计发货时间（小时）",
                    isProdInfo: true,
                    beInteger: true
                }
                    , {
                    fieldName: "isLimit",
                    colName: "是否限购",
                    isProdInfo: true,
                    valFields: [{key:"是",val:1},{key:"否",val:0}]
                }, {
                    fieldName: "limitAmount",
                    colName: "限购数量",
                    isProdInfo: true,
                    beInteger:true
                }
                    , {
                    fieldName: "initSales",
                    colName: "虚拟销量",
                    isProdInfo: true,
                    beInteger:true
                }
                    , {
                    fieldName: "boughtPeople",
                    colName: "虚拟人数",
                    isProdInfo: true,
                    beInteger:true
                }, {
                    fieldName: "afterSaleCycle",
                    colName: "售后周期",
                    isProdInfo: true
                }, {
                    fieldName: "productionDate",
                    colName: "生产日期",
                    isProdInfo: true
                }, {
                    fieldName: "guaranteePeriod",
                    colName: "保质期",
                    isProdInfo: true
                }, {
                    fieldName: "arrivalDate",
                    colName: "预计到货时间",
                    isProdInfo: true,
                    isDate:true
                },
                    {
                     fieldName: "rowId",
                     colName: "_row",
                     isProdInfo: true
                    },
                ],
        }
    },
    methods:{
        getContent(){
            var self = this;
            if(self.deliveryType == 2){
                return `<h4>提示：</h4>`
                    +`<h5>1.请下载模板，按模板填写需导入的信息</h5>`
                    +`<h5>2.勿修改表头名字、格式和字段内容，请按规定格式填写数据导入表格，否则会上传失败</h5>`
                    +`<h5>3.【团购自提】只接受预售模式，实物库存模式需按原操作上架</h5>`
                    +`<h5>4.上传成功后，SGU状态为【编辑中】，还需补全图片信息;</h5>`
                    +`<h5>5.文件格式仅支持扩展名为xlsx的excel文件</h5>`;
            }else{
                return `<h4>提示：</h4>`
                    +`<h5>1.请下载模板，按模板填写需导入的信息</h5>`
                    +`<h5>2.勿修改表头名字、格式和字段内容，请按规定格式填写数据导入表格，否则会上传失败</h5>`
                    +`<h5>3.上传成功后，SGU状态为【编辑中】，还需补全图片信息;</h5>`
                    +`<h5>4.文件格式仅支持扩展名为xlsx的excel文件</h5>`;
            }

        },
        /**
         * 根据值域转换属性值
         */
        getValByKey(valFields, key) {
            if (!valFields) {
                return key;
            }
            var item = valFields.find(a => a.key == key);
            if (item == null) {
                return key;
            }
            return item.val;
        },
        /**
         * 数据校验&格式化
         * @param options
         * @param val
         * @returns {*}
         */
        valFormat(options,val){
            var self =this;
            var formatVal = null;
            if(options.valFields){
                formatVal = self.getValByKey(options.valFields,val);
            }else{
                formatVal = val;
            }
            if(options.isDate){
                formatVal = moment(val).format("YYYY-MM-DD HH:mm:ss");
            }
            if(options.isAmount){
                self.baseValid(()=> !this.$validator.isDecimal(val, { decimal_digits: "1,2" }),`${options.colName} 须为数值且仅支持2位小数,请检查数据!`);
            }
            if(options.beInteger){
                self.baseValid( ()=> !this.$validator.isInt(val),`${options.colName}须为整数,请检查数据!`);
            }
            return formatVal;
        }
    }
}