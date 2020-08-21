import exportUtil from "../../common/utils/ExportUtil";
import sguDataCharts from '@/components/sgumanager/sgu-data-charts';
export default {
  name: "sgu-list-handler",
  methods: {
    /**
     * 根据spu获取sku列表
     */
    getProdList(row, event, column) {
      if (row.processStatus === 0) {
        //判断是展开还是收起
        if (event.length > 0) {
          this.$message({
            message: "SGU未提交，无法查询上架明细",
            type: "warning"
          });
          return;
        }
      }
      if (event) {
        this.$httpUtil.post({
          url: "/sguBaseInfo/getProdScopeList.json",
          data: {
            id: row.id
          },
          contentType: "form", //json,form,multipart
          succ: function (data) {
            row.list = (data.data || []).filter(row => row.valid === 1);
          }
        });
      }
    },
    /**
     * 获取SGU列表
     */
    getListData: function () {
      this.getPagerListData(this.config.page, this.config.pagesize);
      //异步获取总数量
      this.getCountData();
    },
    /**
     * 获取过滤条件
     */
    getFilter() {
      var filter = this.adviceRequest || this.request;
      filter.prodId = this.prodId;
      filter.pageMode = this.pageMode;
      if (!(filter.onSaleList || []).length > 0) {
        filter.onSaleList = [];
      }
      if (
        filter.onSaleList.length === 0 &&
        (this.onsaleStatus || []).length > 0
      ) {
        //如果没有自行设置状态过滤,则使用外部传递进来的条件
        filter.onSaleList = [...filter.onSaleList, ...this.onsaleStatus];
        filter.onSaleList = [...new Set(filter.onSaleList)];
      }
      return {
        ...filter,
        ...(this.filter || {})
      };
    },
    /*
     * 获取分页数据
     * */
    getPagerListData: function (page, size, callback, count) {
      var self = this;
      var jsondata = {
        ...{},
        ...this.getFilter()
      };
      for (var p in jsondata) {
        if (this.$commonUtil.valid.isEmpty(jsondata[p])) {
          jsondata[p] = null;
        }
      }
      this.config.page = page;
      this.config.pagesize = size;
      //取分页总数
      var url = "/sguBaseInfo/list.json";
      if (count) {
        jsondata.pager = {
          pageNo: 1,
          pageSize: 1
        };
        this.$httpUtil.post({
          url: url,
          data: jsondata,
          loading: false, //不显示遮罩
          succ: function (data) {
            (data.data || []).forEach(row => row.list = []);
            if (callback) {
              callback(data);
            }
          }
        });
      } else {
        jsondata.pager = {
          pageNo: page,
          pageSize: size,
          simple: this.config.simplePager ? 1 : 0
        };
        this.$httpUtil.post({
          url: url,
          data: jsondata,
          succ: function (data) {
            (data.data || []).forEach(row => row.list = []);
            self.data = data;
            self.data.records = self.records;
            if (callback) {
              callback(data);
            }
          }
        });
      }
    },
    /*
     * 获取总数
     * */

    getCountData: function () {
      var self = this;
      this.getPagerListData(
        this.config.page,
        this.config.pagesize,
        data => {
          self.records = data.total;
          self.data.records = data.total;
        },
        true
      );
    },
    /**
     * 获取供应商信息
     * @param {*} key_word
     */
    getSupplyData: function (key_word) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/addlist.json",
        data: {
          key_word: key_word
        },
        loading: false, //不显示遮罩
        succ: function (data) {
          self.supplyData = data.data;
        }
      });
    },
    /**
     * excel导出
     */
    excelExport() {
      var self = this;
      //TODO:需要改造
      if (
        this.adviceRequest &&
        (this.adviceRequest.beginDate == null ||
          this.adviceRequest.endDate == null)
      ) {
        this.$commonUtil.valid.throwEx("请选择高级搜索的上架时间段");
      } else {
        if (
          this.request &&
          (this.request.beginDate == null || this.request.endDate == null)
        ) {
          this.$commonUtil.valid.throwEx("请选择搜索的上架时间段");
        }
      }
      if (this.searchModel != null && this.searchModel == 2) {
        this.$httpUtil.post({
          url: "/sguBaseInfo/sguProdExport.json",
          data: self.getFilter(),
          contentType: "json", //json,form,multipart
          succ: function (data) {
            //计算毛利率
            var config = self.$metadata.sguProdExport;
            (data.data || []).forEach(a => a.delivery_type = a.deliveryType);
            var exportData = self.wrapSguProdExportData(data.data, config);
            exportUtil.exportByConfig(self, exportData, config);
          }
        });
      } else {
        this.$httpUtil.post({
          url: "/sguBaseInfo/export.json",
          data: self.getFilter(),
          contentType: "json", //json,form,multipart
          succ: function (data) {
            //计算毛利率
            var config = self.$metadata.sguExport;
            (data.data || []).forEach(a => a.delivery_type = a.deliveryType);
            var exportData = self.wrapExportData(data.data, config);
            exportUtil.exportByConfig(self, exportData, config);
          }
        });
      }
    },
    /**
     * 组装导出数据
     */
    wrapExportData(data, config) {
      var prodList = [];
      var copyAttrs = [
        "sguName",
        "sguNumber",
        "createAt",
        "creatorName",
        "creatorMobile",
        "processStatus",
        "onSale",
        "sort",
        "distributionType",
        "deliveryType",
        "delivery_type",
        "postage",
        "saleType",
        "supplyName",
        "supplyNumber",
        "onSaleTime",
        "takenOffTime",
        "isCycleOnSale",
        "cycleStartDate",
        "cycleEndDate",
        "cycleStartTime",
        "cycleEndTime"
      ];
      (data || []).forEach(sgu => {
        var self = this;
        for (var p in sgu.cityGroups) {
          var city = sgu.cityGroups[p];
          (city || []).forEach(prod => {
            copyAttrs.forEach(attr => {
              prod[attr] = sgu[attr];
            });
            //计算毛利等信息
            self.calcGrossRate2(prod, sgu.isSubAccount, sgu.distributionType);
            config.methods.getSaleTime(prod);
            prodList.push(prod);
          });
        }
      });
      return prodList;
    },
    /**
     * 组装SGU商品模式导出数据
     */
    wrapSguProdExportData(data, config) {
      (data || []).forEach(prod => {
        //计算毛利等信息
        config.methods.getSaleTime(prod);
      });
      return data;
    },
    allAudit: function () {
      var arr = this.selectedRows;
      var ids = [];
      arr.forEach((data) => {
        ids.push(data.id);
      });
      if (ids.length <= 0) {
        alert("未选取行信息");
      } else {
        var self = this;
        var url = "/auditSguBaseInfo/batchAudit.json";
        this.$httpUtil.post({
          url: url,
          data: {
            ids: JSON.stringify(ids)
          },
          contentType: "form",
          succ: function (data) {
            if (data.resultCode == 1000) {
              self.$message({
                message: "操作成功!",
                type: "success"
              });
            }
            self.getListData();
          }
        });
      }
    },
    allSort() {
      this.$router.push({
        path: "/sgumanager/sort"
      });
    },
    /**
     * 显示统计信息
     */
    showSummary: function () {
      this.$layerUtil.openWin(this, {
        title: "城市上架情况统计",
        area: ["1000px", "600px"],
        data: {},
        component: sguDataCharts,
      });
    }
  }
};