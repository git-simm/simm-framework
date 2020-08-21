<template>
  <!-- 销量信息 -->
  <!-- :before-close="handleClose" -->
  <el-drawer
    title="高级搜索"
    ref="drawer"
    :visible.sync="drawer"
    :direction="direction"
    @visibleChange="val => (drawer = val)"
  >
    <!-- @submit.native.prevent="searchFun" -->
    <el-form
      :model="request"
      :rules="rules"
      ref="request"
      label-width="100px"
      class="demo-ruleForm mini"
    >
      <el-form-item label="SPU编码">
        <el-input placeholder="请输入SPU编码" v-model.trim="request.spuNumber"></el-input>
      </el-form-item>
      <el-form-item label="组合名称">
        <el-input placeholder="请输入组合名称" v-model.trim="request.jointName"></el-input>
      </el-form-item>
      <el-form-item label="SKU编码">
        <el-input placeholder="请输入SKU编码" v-model.trim="request.skuNumber"></el-input>
      </el-form-item>
      <el-form-item label="条形码">
        <el-input placeholder="请输入条形码" v-model.trim="request.barCode"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input placeholder="请输入创建人姓名" v-model.trim="request.creatorName"></el-input>
      </el-form-item>
      <el-form-item label="品名">
        <el-input placeholder="请输入品名" v-model.trim="request.spuName"></el-input>
      </el-form-item>
      <el-form-item label="产地">
        <el-input placeholder="请输入产地" v-model.trim="request.placeName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input placeholder="请输入品牌" v-model.trim="request.brandName"></el-input>
      </el-form-item>
      <el-form-item label="类目">
        <sxh-category v-model="request.categoryList" @change="categoryChange"></sxh-category>
      </el-form-item>
      <el-form-item label="审核状态">
        <sxh-checkbox-group dic="prod_audit_status" v-model="request.processStatusList"></sxh-checkbox-group>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 20px;text-align:center;">
      <el-col :span="24">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "spuSearchAdvice",
  props: {
    direction: {
      type: String,
      default: "rtl"
    }
  },
  mixins: [baseMixin],
  data: function(router) {
    return {
      rules: {},
      request: {
        page: 1,
        pagesize: 10,
        spuNumber: "",
        jointName: "",
        skuNumber: "",
        barCode: "",
        creatorName: "",
        spuName: "",
        placeName: "",
        brandName: "",
        categoryId: "",
        twoCategoryId: "",
        threeCategoryId: "",
        processStatusList: [],
        categoryList: []
      }
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    /**
     * 类目信息获取
     */
    categoryChange(val) {
      this.request.categoryId = val.categoryId;
      this.request.twoCategoryId = val.twoCategoryId;
      this.request.threeCategoryId = val.threeCategoryId;
    },
    /**
     * 重置
     */
    reset() {
      for (var p in this.request) {
        if (this.$commonUtil.valid.isArray(this.request[p])) {
          this.request[p] = [];
        } else {
          this.request[p] = "";
        }
      }
    },
    /**
     * 确认
     */
    confirm() {
      this.$emit("confirm", this.request);
      this.$refs.drawer.closeDrawer();
    }
  }
};
</script>
