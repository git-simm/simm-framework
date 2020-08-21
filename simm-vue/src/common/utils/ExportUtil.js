let exportUtil = function(page, dataList, config) {
  this.pageObj = page;
  //需导出的数据源
  this.dataList = dataList;
  this.config = {
    ...{
      title: "数据导出",
      cols: [] //列
    },
    ...config
  };
  /**
   * 导出
   */
  this.export = function(callback) {
    this.pageObj
      .$confirm("将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.export2Excel(this.pageObj, this.dataList, this.config, callback);
      })
      .catch(() => {});
  };
  /**
   * 导出到excel
   */
  this.export2Excel = function(that, dataList, entityConfig, callback) {
    var $this = this;
    var config = JSON.parse(JSON.stringify(entityConfig));
    require.ensure([], () => {
      const { export_json_to_excel } = require("../excel/Export2Excel"); //这里必须使用绝对路径
      //类型赋予默认值
      (config.cols || []).forEach(c => {
        if (!c.type) {
          c.type = "s";
        }
      });
      const tHeader = config.cols.map(a => a.label); // 导出的表头名
      const fields = config.cols.map(a => a.prop); // 导出的表头字段名
      // config.types.push("n");  number
      // config.types.push("s");  string
      const types = config.cols.map(a => a.type); // 字段类型
      if (callback) {
        callback(dataList, fields);
      }
      const data = $this.formatJson(fields, dataList);
      export_json_to_excel(tHeader, data, config.title, types);
    });
  };

  /**
   * 导出到excel
   */
  this.exportSheets = function(sheets, title) {
    require.ensure([], () => {
      const { export_sheets_to_excel } = require("../excel/Export2Excel"); //这里必须使用绝对路径
      // const tHeader = config.header; // 导出的表头名
      // const filterVal = config.cols.map(a=>a.prop); // 导出的表头字段名
      // if(callback){
      //     callback(dataList,filterVal);
      // }
      // const data = $this.formatJson(filterVal, dataList);
      export_sheets_to_excel(sheets, title);
    });
  };

  this.formatJson = function(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]));
  };
};
/**
 * 依据配置进行导出
 * @param {*} vue
 * @param {*} exportData
 * @param {*} config
 * @param {*} callback
 */
function exportByConfig(vue, exportData, config, callback) {
  var exportConfig = {};
  exportConfig.cols = [];
  for (var p in config.attrs) {
    if (config.attrs[p].show == null || config.attrs[p].show(vue.$store.state.userInfo.isAgent)) {
      exportConfig.cols.push({
        label: config.attrs[p].label,
        prop: p
      });
    }
  }
  if (config.methods.getTitle) {
    var date = vue.$commonUtil.format.formatDate(new Date(), "yyyyMMddhhmmss");
    exportConfig.title = config.methods.getTitle() + "-" + date;
  }

  //1.获取带有字典项转换的字段
  var fields = vue.$metadata.attrToArray(config.attrs);
  var dicFields = fields.filter(f => f.dic);
  var getFields = fields.filter(f => f.get);
  //数据转换
  exportData.forEach(d => {
    (dicFields || []).forEach(f => {
      d[f.prop] = vue.$cacheUtil.getVal(f.dic, d[f.prop], "");
    });
    (getFields || []).forEach(f => {
      d[f.prop] = f.get(d);
    });
  });
  return new exportUtil(vue, exportData, exportConfig).export(callback);
}
export default {
  exportByConfig,
  /**
   * 导出excel
   */
  export: function(vue, dataList, config, callback) {
    return new exportUtil(vue, dataList, config).export(callback);
  }
};
