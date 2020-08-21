<template>
  <section class="content-section layer-container">
    <div>
        <span style="text-align:center;font-size: 20px; color: #0d6aad" v-html="'有'+sum+'条SGU可以同步销售价，点击确认进行同步'"></span>
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
        <el-button type="primary" style="width:30%;" @click="submit" class="btn-default">确认</el-button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "excelPreviewList",
  data: function() {
    return {
      //文本：txt,列表：list
      type: "txt",
      data: null,
      excelConfig: {},
      tableHead: [],
      sum:0,
      id:null,
      preSubmit: null
    };
  },
  /**
   * 显示
   */
  created() {
    this.type = this.$options.propsData.param.type;
    this.data = this.$options.propsData.param.data;
    this.sum = this.$options.propsData.param.sum;
    this.id = this.$options.propsData.param.id;
    this.excelConfig = this.$options.propsData.param.excelConfig;
    this.preSubmit = this.$options.propsData.param.preSubmit;
    if (this.type === "list") {
      this.parseTableHead();
    }
  },
  methods: {
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },

    submit: function() {
      this.preSubmit(this.id,this.sum);
      this.closeWin();
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
