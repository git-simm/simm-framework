<template>
  <!-- 销量信息 -->
  <!-- :before-close="handleClose" -->
  <el-drawer
    title="高级搜索"
    ref="drawer"
    :visible.sync="drawer"
    :direction="direction"
    @visibleChange="val=>drawer=val"
  >
    <!-- @submit.native.prevent="searchFun" -->
    <el-form
      :model="request"
      :rules="rules"
      ref="request"
      label-width="100px"
      class="demo-ruleForm mini"
    >
      <el-form-item label="供应商名称">
        <el-select v-model="request.supply_name" clearable filterable placeholder="请选择">
          <el-option
            v-for="(item, key) in baseData.supplyData"
            :key="key"
            :label="item.supply_name"
            :value="item.supply_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商编码">
        <el-input placeholder="请输入供应商编码" v-model.trim="request.supply_number"></el-input>
      </el-form-item>
      <el-form-item label="创建人姓名">
        <el-input placeholder="请输入创建人姓名" v-model.trim="request.admin_user_name"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名">
        <el-input placeholder="请输入联系人姓名" v-model.trim="request.contact_person"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话">
        <el-input placeholder="请输入联系人电话" v-model.trim="request.contact_phone"></el-input>
      </el-form-item>
      <el-form-item label="供应商类型">
        <el-select v-model="request.supply_identity" clearable placeholder="请选择">
          <el-option
            v-for="(item,index) in $cacheUtil.getDic('supply_identity')"
            :key="'supply_identity'+index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售模式">
        <sxh-checkbox-group dic="settltType" v-model="request.settltTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="供应商归属">
        <sxh-checkbox-group dic="supply_direct_purchasing" v-model="request.supplyPurchasingList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="是否分账">
        <sxh-checkbox-group dic="is_sub_account" v-model="request.accountTypeList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="状态">
        <sxh-checkbox-group dic="account_status_type" v-model="request.statusList"></sxh-checkbox-group>
      </el-form-item>
      <el-form-item label="审核状态">
        <sxh-checkbox-group dic="biz_status" v-model="request.bizStatusList"></sxh-checkbox-group>
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
  name: "supplySearchAdvice",
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
        supply_name: "",
        supply_number: "",
        admin_user_name: "",
        contact_person: "",
        contact_phone: "",
        supply_identity: "",
        settltTypeList: [],
        supplyPurchasingList: [],
        accountTypeList: [],
        statusList: [],
        processStatusList: [],
        bizStatusList: []
      }
    };
  },
  created() {},
  methods: {
    /*
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


