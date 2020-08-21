<template>
  <!-- 销量信息 -->
  <!-- :before-close="handleClose" -->
  <el-drawer title="高级搜索" ref="drawer" :visible.sync="drawer" :direction="direction">
    <!-- @submit.native.prevent="searchFun" -->
    <el-form
      :model="request"
      :rules="rules"
      ref="request"
      label-width="100px"
      class="demo-ruleForm mini"
    >
      <el-form-item label="SGU ID">
        <el-input placeholder="请输入SGU ID" v-model.trim="request.id"></el-input>
      </el-form-item>
      <el-form-item label="SGU编码">
        <el-input placeholder="请输入SGU编码" v-model.trim="request.sguNumber"></el-input>
      </el-form-item>
      <el-form-item label="SGU名称">
        <el-input placeholder="请输入SGU名称" v-model.trim="request.sguName"></el-input>
      </el-form-item>
      <el-form-item label="SKU编码">
        <el-input placeholder="请输入SKU编码" v-model.trim="request.skuNumber"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-select v-model="request.supplyId" clearable filterable placeholder="请输入供应商名称">
          <el-option
            v-for="(item, key) in baseData.supplyData"
            :key="key"
            :label="item.supply_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商编码">
        <el-input placeholder="请输入供应商编码" v-model.trim="request.supplyNumber"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input placeholder="请输入创建人姓名" v-model.trim="request.creatorName"></el-input>
      </el-form-item>
      <!-- @change="datechange" -->
      <el-form-item label="上架时间">
        <sxh-date
          v-model="request.timeArr"
          controlType="daterange"
          @change="
            arr => {
              request.beginDate = arr[0];
              request.endDate = arr[1];
            }
          "
        ></sxh-date>
      </el-form-item>
      <el-form-item label="类目">
        <sxh-category v-model="request.categoryArr" @change="categoryChange"></sxh-category>
      </el-form-item>
      <el-form-item label="配送方式">
        <sxh-checkbox-group dic="distribution_type" v-model="request.distributionTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="数据归属">
        <sxh-checkbox-group dic="user_role_type" v-model="request.roleTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="省级/城市">
        <sxh-city v-model="request.cityList" @change="cityChange"></sxh-city>
      </el-form-item>
      <el-form-item label="售卖类型">
        <sxh-checkbox-group dic="sale_type" v-model="request.saleTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="SGU状态">
        <sxh-checkbox-group dic="sgu_on_sale" v-model="request.onSaleList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="审核状态">
        <sxh-checkbox-group dic="prod_audit_status" v-model="request.processStatusList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="上架模式">
        <sxh-checkbox-group dic="is_cycle_onsale" v-model="request.isCycleOnSaleList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="是否差异化上架" label-width="110px">
        <sxh-checkbox-group dic="isDiff" v-model="request.isDiffList"></sxh-checkbox-group>
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
import moment from "moment";
var d = new Date();
var start = new Date();
var end = new Date();
start.setDate(start.getDate() - 4);
end.setDate(end.getDate() + 3);
var strStart = moment(start).format("YYYY-MM-DD 00:00:00");
var strEnd = moment(end).format("YYYY-MM-DD 23:59:59");
export default {
  name: "sguSearchAdvice",
  props: {
    direction: {
      type: String,
      default: "rtl"
    },
    baseData: {
      type: Object,
      default() {
        return {
          supplyData: []
        };
      }
    }
  },
  mixins: [baseMixin],
  data: function(router) {
    return {
      rules: {},
      request: {
        page: 1,
        pagesize: 10,
        supplyId: "",
        supplyNumber: "",
        sguName: "",
        sguNumber: "",
        skuNumber: "",
        creatorName: "",
        categoryId: "",
        twoCategoryId: "",
        threeCategoryId: "",
        beginDate: strStart,
        endDate: strEnd,
        distributionTypeList: [],
        roleTypeList: [],
        saleTypeList: [],
        onSaleList: [],
        processStatusList: [],
        timeArr: [start, end],
        categoryArr: [],
        cityList: [],
        provinceId: "",
        cityId: "",
        isCycleOnSaleList: [],
        isDiffList:[]
      }
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    cityChange(val) {
      this.request.provinceId = val.provinceId;
      this.request.cityId = val.cityId;
    },
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
