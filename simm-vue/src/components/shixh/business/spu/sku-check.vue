<template>
  <section class="content-section">
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="24">
            <el-form
              :model="formData"
              ref="formData"
              label-width="120px"
              class="demo-ruleForm"
              @keyup.enter.native="search"
            >
              <el-col :span="20">
                <el-form-item label="SKU名称">
                  <el-input v-model="formData.productName" placeholder="支持分词检索"></el-input>
                </el-form-item>
                <el-form-item label="类目">
                  <sxh-category v-model="formData.categoryList" @change="categoryChange"></sxh-category>
                </el-form-item>
                <el-form-item label="品牌">
                  <el-input v-model.trim="formData.brandName" placeholder="请输入品牌"></el-input>
                </el-form-item>
                <el-form-item label="产地">
                  <el-input v-model.trim="formData.placeName" placeholder="请输入产地"></el-input>
                </el-form-item>
                <el-form-item label="SKU编码">
                  <el-input v-model.trim="formData.prodNumber" placeholder="请输入SKU编码"></el-input>
                </el-form-item>
                <el-form-item label="SPU编码">
                  <el-input v-model.trim="formData.spuNumber" placeholder="请输入SPU编码"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
          <el-col :span="24" style="text-align:center;">
            <el-button
              type="primary"
              icon="el-icon-search"
              style="transform: scale(1.5);"
              @click="search"
            >检索</el-button>
          </el-col>
          <!--<el-button @click="down(1)">下载自提模版</el-button>
          <el-button @click="down(2)">下载包邮模版</el-button>
          <sxh-excel-import
            :parse-param="param"
            :row-offset="2"
            @file-loaded="fileLoaded"
            :post-data="postData"
            auto-upload
          ></sxh-excel-import>
          <span>{{fileName}}</span>-->
        </el-row>
      </el-col>
      <el-col :span="12">
        <sku-es-search ref="esSearch"></sku-es-search>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { FileApi } from "@/common/api/FileApi.js";
export default {
  name: "SkuCheck",
  data() {
    return {
      formData: {
        spuName: "",
        spuNumber: "",
        productName: "",
        prodNumber: "",
        brandName: "",
        placeName: "",
        categoryId: "",
        twoCategoryId: "",
        threeCategoryId: "",
        categoryList: []
      }
      // fileName: "",
      // param: {
      //   raw: false,
      //   cellDates: true
      // }
    };
  },
  methods: {
    // postData(data) {
    //   console.log(data);
    // },
    // fileLoaded(file) {
    //   console.log(file);
    //   this.fileName = file.name;
    // },
    // down(id) {
    //   new FileApi(this).getTemplateFile(id);
    // },
    search() {
      this.$refs.esSearch.search(this.formData);
    },
    categoryChange(val) {
      this.formData.categoryId = val.categoryId;
      this.formData.twoCategoryId = val.twoCategoryId;
      this.formData.threeCategoryId = val.threeCategoryId;
      this.$refs.esSearch.search(this.formData);
    }
  }
};
</script>
