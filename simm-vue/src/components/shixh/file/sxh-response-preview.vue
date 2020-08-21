<template>
  <section class="content-section layer-container">
    <div v-if="type===`list`">
        <span v-if="desc"  style="text-align:center;font-size: 20px; color: red" v-html="desc"> </span>
        <span v-else>
          <span style="text-align:center;font-size: 20px; color: #0d6aad" v-html="'成功更新'+successSum+'条,'"></span>
        <span style="text-align:center;font-size: 20px; color: red" v-html="'更新失败'+failSum+'条'"></span>
        </span>
      <el-table style="width: 100%" size="mini" height="470" border :data="data">
        <template>
          <el-table-column
            v-for="(item,index) in tableHead"
            :prop="item.field"
            :label="item.label"
            :key="index"
          ></el-table-column>
        </template>
      </el-table>
      <div class="pull-right">
        <el-button type="primary" style="width:30%;" @click="downFile" class="btn-default">下载</el-button>
      </div>
    </div>
    <div v-else>
      <p style="text-align:center;font-size: 30px;" v-html="data"></p>
    </div>
  </section>
</template>
<script>
import exportUtil from "@/common/utils/ExportUtil";
export default {
  name: "excelPreviewList",
  data: function() {
    return {
      //文本：txt,列表：list
      type: "txt",
      data: null,
      desc:null,
      excelConfig: {},
      tableHead: [],
      successSum:0,
      failSum:0
    };
  },
  /**
   * 显示
   */
  created() {
    this.type = this.$options.propsData.param.type;
    this.data = this.$options.propsData.param.data;
    this.successSum = this.$options.propsData.param.successSum;
    this.desc = this.$options.propsData.param.desc;
    this.failSum = this.$options.propsData.param.failSum;
    this.excelConfig = this.$options.propsData.param.excelConfig;
    if (this.type === "list") {
      this.parseTableHead();
    }
  },
  methods: {
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
    downFile() {
      let self = this;
      exportUtil.exportByConfig(self, self.data, self.excelConfig);
    },
    parseTableHead() {
      //1.获取带有字典项转换的字段
      var fields = this.$metadata.attrToArray(this.excelConfig.attrs);
      var dicFields = fields.filter(f => f.dic);
      var getFields = fields.filter(f => f.get);
      //数据转换
      this.data.forEach(d => {
        (dicFields || []).forEach(f => {
          d[f.prop] = vue.$cacheUtil.getVal(f.dic, d[f.prop], "");
        });
        (getFields || []).forEach(f => {
          d[f.prop] = f.get(d);
        });
      });
      //表头
      for (var p in this.excelConfig.attrs) {
        this.tableHead.push({
          label: this.excelConfig.attrs[p].label,
          field: p
        });
      }
    }
  }
};
</script>
