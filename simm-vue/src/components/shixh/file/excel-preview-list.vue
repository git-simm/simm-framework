<template>
  <section class="content-section layer-container">
    <div style="text-align:center;margin-bottom:5px;">
      <el-button
        type="primary"
        style="width:50%;"
        @click="postDataFunc"
        class="btn-default"
        :disabled="hasError"
      >提交数据</el-button>
    </div>
    <div v-if="(dataList||[]).length>0">
      <el-table
        style="width: 100%"
        size="mini"
        height="460"
        border
        :data="hasError?dataList.filter(a=>a.error>``):showList"
      >
        <template>
          <el-table-column
            v-for="(item,index) in tableHead"
            :prop="item.field"
            :label="item.label"
            :key="index"
          ></el-table-column>
          <el-table-column v-if="hasError" prop="error" label="数据错误" :key="9999">
            <template slot-scope="scope">
              <span class="text-theme">{{scope.row.error}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <p v-if="hasError">
        <span style="margin-left:10px;" class="text-theme">
          <b>{{errorCount}}</b> 条数据存在问题，请补充完整后重新提交
        </span>
      </p>
      <p v-else>
        <span>
          预计导入总数量：
          <b>{{(dataList||[]).length}}</b> 条
        </span>
        <span
          style="margin-left:10px;font-size:15px;"
          class="text-theme"
          v-if="overMax"
        >(仅支持预览前{{max}}条记录)</span>
      </p>
    </div>
    <div v-else>
      <p style="text-align:center;">上传文件无数据</p>
    </div>
  </section>
</template>
<script>
export default {
  name: "excelPreviewList",
  data: function() {
    return {
      showFields: [],
      errorCount: 0,
      rowValid: null,
      hasError: false,
      dataList: [],
      tableHead: [],
      overMax: false,
      max: 200,
      showList: [],
      postData: null,
      autoClose: true
    };
  },
  created() {
    this.postData = this.$options.propsData.postData;
    this.dataList = this.$options.propsData.dataList;
    this.showFields = this.$options.propsData.showFields;
    this.rowValid = this.$options.propsData.rowValid;
    this.autoClose = this.$options.propsData.autoClose;
    this.errorCount = 0;
    this.hasError = false;
    this.validData(this.dataList || []);
    if ((this.dataList || []).length > 0) {
      this.parseTableHead();
      this.overMax = this.dataList.length > this.max;
      this.showList = this.overMax
        ? this.dataList.filter((val, i) => i < this.max)
        : this.dataList;
    }
  },
  methods: {
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
    validData(list) {
      if (!this.rowValid) return;
      for (var i = 0; i < list.length; i++) {
        this.$set(list[i], "error", "");
        var error = this.rowValid(list[i], i);
        if (error > "") {
          this.$set(list[i], "error", `第${i + 2}行,${error}`);
          this.errorCount++;
          this.hasError = true;
        }
      }
    },
    postDataFunc() {
      if (this.postData) {
        this.postData(this.dataList);
      }
      //提交数据 关闭窗口
      if (this.autoClose == null) {
        this.autoClose = true;
      }
      if (this.autoClose) {
        this.closeWin();
      }
    },
    parseTableHead() {
      var showFields = this.showFields || [];
      var self = this;
      if (showFields.length > 0) {
        showFields.forEach(f => {
          self.tableHead.push({
            field: f,
            label: f
          });
        });
      } else {
        var row = this.dataList[0];
        for (var p in row) {
          this.tableHead.push({
            field: p,
            label: p
          });
        }
      }
    }
  }
};
</script>
