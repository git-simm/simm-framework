<template>
  <section class="content-section sgu-plan-import">
    <el-form :model="formData" ref="sguPlanImport" label-width="30px">
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-input
              placeholder="请点击【上传批量上架Excel文件】按钮上传文件,已上传文件名将在该区域显示"
              disabled
              v-model="formData.fileName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <div :span="12">
              <sxh-excel-import
                label="上传文件"
                :tooltip-width="400"
                :rowOffset="2"
                :post-data="postData"
                :autoUpload="true"
                @file-loaded="fileLoaded"
                :preview-area="['1000px','600px']"
                :parse-param="param"
              ></sxh-excel-import>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <div v-if="deliveryType == 2">
              <el-link type="primary" @click="down(2,`SGU批量导入模板(自提)`)">下载【团购自提】批量模版</el-link>
            </div>
            <div v-if="deliveryType ==1">
              <el-link type="primary" @click="down(1,`SGU批量导入模板(包邮)`)">下载【团购包邮】批量模版</el-link>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item>
            <div v-html="content"></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button type="primary" @click="closeWin()">关闭</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import { FileApi } from "@/common/api/FileApi.js";
import planImportHandler from "@/components/sguplanmanager/template/plan-import-handler";
export default {
  name: "sgu-plan-import",
  mixins: [planImportHandler],
  props: {
    deliveryType: {
      // 1-包邮 2-自提
      type: Number,
      require: false,
      default: 2
    },
    callback: Function
  },
  data() {
    return {
      formData: {
        fileName: null,
        fileUrl: null,
        saleType: 0
      },
      planData: [],

      content: "",
      param: {
        raw: false,
        cellDates: true
      }
    };
  },
  created() {
    this.content = this.getContent();
  },
  methods: {
    fileLoaded(file) {
      var self = this;
      self.formData.fileName = file.name;
      self.formData.fileUrl = file.url;
    },
    /**
     * 下载模板
     */
    down(deliveryType, title) {
      new FileApi(this).getTemplateFile(deliveryType, title);
    },

    postData(dataArr) {
      var self = this;
      self.planData = self.wrapPlanData(dataArr);
      self.submit();
      self.closeWin();
    },
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
    /**
     * 提交
     */
    submit() {
      var self = this;
      self.baseValid(
        () => (self.planData || []).length === 0,
        "批量导入未解析出有效数据,请确保excel文件表头及数据格式与指定模板一致!"
      );
      self.baseValid(
        () => self.formData.fileUrl == null || self.formData.fileUrl == "",
        "请上传批量上架计划excel文件!"
      );
      // 非模板 基础数据赋值
      (self.planData || []).forEach(e=>{
        e.deliveryType = self.deliveryType;
        e.saleType = self.formData.saleType;
      });

      this.$httpUtil.post({
        url: "/sguPlanImpFileInfo/planImport.json",
        data: {
          fileName: self.formData.fileName,
          url: self.formData.fileUrl,
          sguPlanBaseInfoList: self.planData
        },
        contentType: "json", //json,form,multipart
        succ: function(data) {
          if (self.callback) {
            var allRecords = (data.data.sguPlanBaseInfoList || []).length;
            var failedRecords = (data.data.sguPlanBaseInfoList || []).filter(
              el => el.sguNumber == null
            ).length;
            self.callback(allRecords, failedRecords);
          }
        }
      });
    },

    /**
     * excel数据解析成结构对象
     * @param dataArr
     */
    wrapPlanData(dataArr) {
      var planData = [];
      var self = this;
      var fields = Array.from(self.planFields);
      var lastBaseInfo = {};
      if ((dataArr || []).length == 0) {
        return [];
      }
      for (var elIndex in dataArr) {
        var el = dataArr[elIndex];
        self.baseValid(()=> elIndex ==="0" && !el["供应商编码"],"首行供应商编码为空,检查模板及数据后重试!");
        var basePlan = {};
        var planProd = {};
        for (var eleIndex in fields) {
          var ele = fields[eleIndex];
          if (el[ele.colName] && ele.isProdInfo) {
            var prodValue = self.valFormat(ele, el[ele.colName]);
            self.$set(planProd, ele.fieldName, prodValue);
          } else if (el[ele.colName]) {
            var baseValue = self.valFormat(ele, el[ele.colName]);
            self.$set(basePlan, ele.fieldName, baseValue);
          }
        }

        if (Object.keys(basePlan).length > 0 && basePlan.supplyNumber) {
          lastBaseInfo = basePlan;
          basePlan.sguPlanProdInfoList = [];
          if (Object.keys(planProd).length > 0) {
            basePlan.sguPlanProdInfoList.push(planProd);
          }
          planData.push(basePlan);
        } else if (Object.keys(lastBaseInfo).length > 0) {
          basePlan = lastBaseInfo;
          if (Object.keys(planProd).length > 0) {
            basePlan.sguPlanProdInfoList.push(planProd);
          }
        }
      }
      return planData;
    },

  }
};
</script>

<style scoped>
</style>