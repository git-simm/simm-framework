<template>
  <!-- 销量信息 -->
  <!-- :before-close="handleClose" -->
  <el-drawer
    title="高级搜索"
    ref="drawer"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="appendToBody"
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
      <el-form-item label="SKU编码">
        <el-input placeholder="请输入SKU编码" v-model.trim="request.prod_number"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input placeholder="请输入商品名称" v-model.trim="request.product_name"></el-input>
      </el-form-item>
      <el-form-item label="条形码">
        <el-input placeholder="请输入条形码" v-model.trim="request.barCode"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input placeholder="请输入创建人姓名" v-model.trim="request.creatorName"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-select v-model="request.unit" clearable filterable placeholder="请选择">
          <el-option
            v-for="(item, key) in salesModelData"
            :key="key"
            :label="item.unitName"
            :value="item.unitName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产地">
        <el-input placeholder="请输入产地" v-model.trim="request.place_name"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input placeholder="请输入品牌" v-model.trim="request.brand_name"></el-input>
      </el-form-item>
      <el-form-item label="税率">
        <el-select v-model="request.tax" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in $cacheUtil.getDic('tax')"
            :key="'tax' + index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类目">
        <sxh-category v-model="request.categoryList" @change="categoryChange"></sxh-category>
      </el-form-item>
      <el-form-item label="自有品牌">
        <sxh-checkbox-group dic="isSelfBrand" v-model="request.isSelfBrandList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="可订货">
        <sxh-checkbox-group dic="commonIsOrNot" v-model="request.canBuyList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="可销售">
        <sxh-checkbox-group dic="commonIsOrNot" v-model="request.canSaleList"></sxh-checkbox-group>
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
  name: "skuSearchAdvice",
  props: {
    direction: {
      type: String,
      default: "rtl"
    },
    appendToBody: {
      type: Boolean,
      default: false
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
        product_name: "",
        prod_number: "",
        barCode: "",
        creatorName: "",
        place_name: "",
        brand_name: "",
        category_id: "",
        two_category_id: "",
        three_category_id: "",
        unit: "",
        tax: "",
        processStatusList: [],
        isSelfBrandList: [],
        canBuyList: [],
        canSaleList: [],
        categoryList: []
      }
    };
  },
  created() {
    this.getCategoryList();
    this.getSalesModelData();
  },
  methods: {
    /**
     * 类目信息获取
     */
    categoryChange(val) {
      this.request.category_id = val.categoryId;
      this.request.two_category_id = val.twoCategoryId;
      this.request.three_category_id = val.threeCategoryId;
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
