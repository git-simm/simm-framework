<template>
  <el-popover
    placement="top-start"
    v-if="tooltip>''"
    title="注意"
    :width="tooltipWidth"
    trigger="hover"
  >
    <div v-html="tooltip"></div>
    <el-upload
      class="excel_import"
      slot="reference"
      ref="upload"
      :multiple="false"
      :data="tokendata"
      :with-credentials="true"
      :auto-upload="autoUpload"
      :action="serverURI+'/file/uploadFile.json'"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-change="importFile"
      :show-file-list="false"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    >
      <slot>
        <el-button size="small" type="primary" :round="false">{{label}}</el-button>
      </slot>
    </el-upload>
  </el-popover>
  <el-upload
    v-else
    class="excel_import"
    slot="reference"
    ref="upload"
    :multiple="false"
    :data="tokendata"
    :with-credentials="true"
    :auto-upload="autoUpload"
    :action="serverURI+'/file/uploadFile.json'"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-change="importFile"
    :show-file-list="false"
    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  >
    <el-button size="small" type="primary" :round="false">
      <slot>{{label}}</slot>
    </el-button>
  </el-upload>
</template>
<script>
import excelPreviewList from "./excel-preview-list";
import { showLoading, hideLoading } from "@/common/utils/Loading";
let headerList =
  "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ,AR,AS,AT,AU,AV,AW,AX,AY,AZ";
export default {
  name: "sxhExcelImport",
  props: {
    /**
     * 按钮名称
     */
    label: {
      type: String,
      required: false,
      default: "上传EXCEL"
    },
    tooltip: {
      type: String,
      required: false,
      default: null
    },
    tooltipWidth: {
      type: Number,
      required: false,
      default: 200
    },
    //sheet_to_json的参数
    parseParam: {
      type: Object,
      required: false,
      default: null
    },
    //行偏移量(去掉标题)
    rowOffset: {
      type: Number,
      required: false,
      default: 0
    },
    /**
     * 是否上传文件
     */
    autoUpload: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * 是否预览
     */
    preview: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * 预览标题
     */
    previewTitle: {
      type: String,
      required: false,
      default: null
    },
    /**
     * 预览字段
     */
    showFields: {
      type: Array,
      required: false,
      default: null
    },
    /**
     * 自动关闭预览
     */
    autoClose: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * 预览区域大小
     */
    previewArea: {
      type: Array,
      required: false,
      default: null
    },
    /**
     * 提交数据
     */
    postData: {
      type: Function,
      required: true,
      default: null
    },
    /**
     * 行数据验证
     */
    rowValid: {
      type: Function,
      required: false,
      default: null
    }
  },
  data() {
    return {
      tokendata: {
        token: this.$store.state.token,
        tokenid: this.$store.state.tokenid
      },
      serverURI: this.$store.state.serverURI,
      excelData: []
    };
  },
  methods: {
    /**
     * 关闭预览窗口
     */
    closePreviewWin: function() {
      this.$layerUtil.closeWin(this);
    },
    /**
     * 解析数据
     */
    importFile(file) {
      if (!this.autoUpload) {
        this.parseFile(file);
      }
    },
    /**
     * 先上传文件
     */
    handleSuccess: function(response, file, fileList) {
      file.url = response.data;
      this.parseFile(file);
    },
    handleError: function(error, file, fileList) {
      console.log(error);
      this.$message({
        showClose: true,
        message: "文件上传失败，请重试!",
        type: "error"
      });
    },
    /**
     * 解析文件
     */
    parseFile(file) {
      this.$emit("file-loaded", file);
      let self = this;
      var rABS = false; //是否将文件读取为二进制字符串
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var wb; //读取完成的数据
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          var sheet = wb.Sheets[wb.SheetNames[0]];
          var header = self.parseHeader(sheet);
          var param = { ...{}, ...(self.parseParam || {}) };
          if (header) {
            param.header = header;
          }
          self.excelData = XLSX.utils.sheet_to_json(sheet, param);
          if (self.rowOffset > 0) {
            if ((self.excelData || []).length <= self.rowOffset) {
              self.excelData = [];
            } else {
              self.excelData = self.excelData.slice(self.rowOffset);
            }
          }
          var start = self.rowOffset > 0 ? self.rowOffset : 1;
          self.excelData.forEach((r, index) => {
            //属性空格统一 trim
            self.trim(r);
            r._row = index + start;
          });
          self.$emit("loaded", self.excelData);
          if (self.preview) {
            //预览数据
            self.showDataList(self.excelData, header);
          } else if (self.postData) {
            //直接提交数据
            self.postData(self.excelData);
          }
        };
        reader.readAsArrayBuffer(f);
      };
      try {
        showLoading();
        if (rABS) {
          reader.readAsArrayBuffer(file.raw);
        } else {
          reader.readAsBinaryString(file.raw);
        }
        hideLoading();
      } catch (e) {
        hideLoading();
      }
    },
    /**
     * 统一去除空格
     */
    trim(row) {
      for (var p in row) {
        if (row[p]) {
          try {
            row[p] = row[p].trim();
          } catch (e) {}
        }
      }
    },
    /**
     * 格式化表格
     */
    parseHeader(sheet) {
      if (this.rowOffset > 0) {
        if (this.parseParam && this.parseParam.header) {
          return this.parseParam.header;
        }
        //自动解析头部字段
        var self = this;
        var header = [];
        headerList.split(",").forEach(h => {
          var cell = h + self.rowOffset;
          if (sheet[cell]) {
            header.push(sheet[cell].v);
          }
        });
        return header;
      }
      return null;
    },
    /**
     * 显示数据
     */
    showDataList(data, header) {
      this.$layerUtil.openWin(this, {
        title: this.previewTitle || `数据预览 (确认无误后提交数据)`,
        area: this.previewArea || ["700px", "600px"],
        data: {
          dataList: data,
          showFields: header ?? this.showFields,
          autoClose: this.autoClose,
          rowValid: this.rowValid,
          postData: this.postData
        },
        component: excelPreviewList
      });
    }
  }
};
</script>
<style lang="less" scoped>
// 导入按钮的样式
.excel_import {
  display: initial;
  margin-left: 2px;
}
</style>