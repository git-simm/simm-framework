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
      <el-form-item label="商品ID">
        <el-input placeholder="商品ID" v-model.trim="request.id"></el-input>
      </el-form-item>
      <el-form-item label="SKU编码">
        <el-input placeholder="SKU编码" v-model.trim="request.prod_number"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input placeholder="商品名称" v-model.trim="request.prod_name_like"></el-input>
      </el-form-item>
      <el-form-item label="条形码">
        <el-input placeholder="请输入条形码" v-model.trim="request.bar_code"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-select
          v-model.number="request.purchase_supply_id"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, key) in baseData.supplyData"
            :key="key"
            :label="item.supply_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input placeholder="请输入创建人姓名" v-model.trim="request.admin_user_name"></el-input>
      </el-form-item>
      <el-form-item label="供应商编码">
        <el-input placeholder="供应商编码" v-model.trim="request.supply_number"></el-input>
      </el-form-item>
      <el-form-item label="类目">
        <sxh-category v-model="request.categoryList" @change="categoryChange"></sxh-category>
      </el-form-item>
      <el-form-item label="归属">
        <sxh-checkbox-group dic="user_role_type" v-model="request.roleTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="城市/省级">
        <sxh-city v-model="request.cityList" @change="cityChange"></sxh-city>
      </el-form-item>
      <el-form-item label="销售模式">
        <sxh-checkbox-group dic="settltType" v-model="request.settltTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="分账类型">
        <sxh-checkbox-group dic="is_sub_account" v-model="request.isSubAccountList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="供应商归属">
        <sxh-checkbox-group dic="supply_direct_purchasing" v-model="request.directList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="商品状态">
        <sxh-checkbox-group dic="prod_purchase_status" v-model="request.prodPurchaseStatusList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="初始审核">
        <sxh-checkbox-group dic="init_audit_status" v-model="request.initAuditStatus"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="调价审核">
        <sxh-checkbox-group dic="update_audit_status" v-model="request.updateAuditStatus"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="是否代理">
        <sxh-checkbox-group dic="is_agent" v-model="request.isAgents"></sxh-checkbox-group>
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
    baseData: {
      type: Object,
      default() {
        return {
          supplyData: [],
          cityList: []
        };
      }
    }
  },
  mixins: [baseMixin],
  data: function(router) {
    return {
      rules: {},
      request: {
        id:"",
        prod_number: "",
        prod_name_like: "",
        bar_code: "",
        purchase_supply_id: "",
        admin_user_name: "",
        supply_number: "",
        city: {},
        cityId: "",
        categoryId: "",
        twoCategoryId: "",
        threeCategoryId: "",
        roleTypeList: [],
        settltTypeList: [],
        isSubAccountList: [],
        directList: [],
        prodPurchaseStatusList: [],
        initAuditStatus: [],
        updateAuditStatus: [],
        isAgents: []
      }
    };
  },
  created() {
    this.getCategoryList();
    this.getSalesModelData();
  },
  methods: {
    cityChange(val) {
      if (val.cityId > 0) {
        this.request.city = {
          id: val.cityId,
          city_level: 2
        };
        return;
      } else if (val.provinceId > 0) {
        this.request.city = {
          id: val.provinceId,
          city_level: 1
        };
        return;
      }
      this.request.city = {};
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
      this.request.city = {};
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
