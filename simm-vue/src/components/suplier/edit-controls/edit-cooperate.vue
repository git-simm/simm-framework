<template>
  <section>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="140px"
      class="demo-ruleForm"
    >
      <h4 class="text-theme">合作信息</h4>
      <el-row>
        <el-col :span="10">
          <el-form-item label="供应商归属" label-width="160px" prop="is_direct_purchasing">
            <el-radio-group v-model="formData.is_direct_purchasing" :disabled="baseData.disabled">
              <el-radio
                :label="1"
                :disabled="(!isDirect && !isSupplyManager)|| baseData.agentDisabled"
              >直购</el-radio>
              <el-radio :label="0" :disabled="isDirect">团购</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="配送方式" prop="deliveryType">
            <el-radio-group v-model.trim="formData.deliveryType">
              <el-radio
                v-for="(item, index) in $cacheUtil.getDic('delivery_type')"
                :label="item.key"
                :disabled="baseData.deliveryTypeDisabled"
                :key="`deliveryType` + index"
              >{{ item.value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否为代理商" prop="isAgent">
            <el-select
              v-model="formData.isAgent"
              :disabled="(!(isCountry || isSupplyManager)) || baseData.agentEditDisabled || baseData.disableAgent"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="销售模式" prop="merchantModel">
            <el-radio-group
              v-model.trim="formData.merchantModel"
              :disabled="baseData.disabled || baseData.merchantModelDisabled"
            >
              <el-radio
                v-for="(item, index) in $cacheUtil.getDic('settltType')"
                :label="item.key"
                :disabled="(!isSupplyManager && item.key == 2)  || (baseData.agentDisabled && item.key == 2)"
                :key="`settltType` + index"
              >{{ item.value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否分账" prop="isSubAccount">
            <el-radio-group v-model="formData.isSubAccount" v-show="false">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <span style="color:red;">
              {{
              formData.isSubAccount == 1 ? `是` : `否`
              }}
            </span>
          </el-form-item>
          <el-form-item label="经营类目" prop="goodsCategoryI" id="goodsCatagory">
            <el-select
              v-model="goodsCategoryI"
              value-key="id"
              :clearable="false"
              multiple
              :multiple-limit="
                entity.process_status == 3
                  ? (baseData.baseCategoryData || []).length
                  : 1
              "
              placeholder="请选择类目"
            >
              <el-option
                v-for="item in baseData.baseCategoryData"
                :key="`goodsCategoryI-${item.id}`"
                :disabled="item.disabled"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="账期" prop="settle_day">
            <el-input v-model.number="formData.settle_day">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="结算邮箱" prop="contact_email">
            <el-input v-model.trim="formData.contact_email"></el-input>
          </el-form-item>
          <el-form-item label="保证金" prop="deposit_price">
            <el-input v-model.number="formData.deposit_price"></el-input>
          </el-form-item>
          <el-form-item
            label="平台比例"
            prop="platform_ratio"
            v-if="formData.isAgent ==1"
            disabled="baseData.agentEditDisabled"
          >
            <el-input v-model="formData.platform_ratio">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="代理城市" prop="agentCityI" v-if="formData.isAgent ==1" id="agentCity">
            <el-select
              v-model="formData.agentCityI"
              clearable
              filterable
              placeholder="请选择"
              :disabled="!baseData.agentDisabled || baseData.agentEditDisabled"
            >
              <el-option
                v-for="item in agentCityIs"
                :key="`agentCityI-${item.admin_shop_id}`"
                :label="item.level_name"
                :value="item.admin_shop_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同有效期"
            :class="formData.isSubAccount == 1 ? 'is-required' : ''"
            prop="contractValidityBegin"
          >
            <sxh-date
              v-model="contractTimeArr"
              controlType="daterange"
              @change="
                arr => {
                  formData.contractValidityBegin = arr[0];
                  formData.contractValidityEnd = arr[1];
                }
              "
            ></sxh-date>
          </el-form-item>
          <el-form-item label="收货邮箱" prop="receive_email">
            <el-input v-model.trim="formData.receive_email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="8"
          v-show="formData.is_direct_purchasing===0 && formData.isAgent===0"
          style="padding-right:20px;"
        >
          <el-card>
            <h4 class="text-theme">供应商服务区域</h4>
            <el-form-item label-width="20px">
              <sxh-city-multi
                ref="tree"
                :default-expanded-keys="formData.supplySiteIds"
                :default-checked-keys="formData.supplySiteIds"
                show-tags
              ></sxh-city-multi>
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card>
            <edit-aftersale ref="afterSale" :baseData="baseData" :entity="entity"></edit-aftersale>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import EditCooperateHandler from "./edit-cooperate-handler.js";
import EditCommonHandler from "./edit-common-handler.js";
import EditAftersale from "./edit-aftersale.vue";
export default {
  name: "EditCooperate",
  mixins: [EditCooperateHandler, EditCommonHandler],
  components: { EditAftersale },
  props: {
    baseData: {},
    entity: {},
  },
  watch: {
    "formData.merchantModel": {
      handler(val) {
        this.formData.isSubAccount = val == 1 ? 1 : 0;
        if (val == 2) {
          this.formData.deliveryType = 2;
        }
      },
    },
    goodsCategoryI(val) {
      this.formData.goodsCategoryI = val;
    },
    "formData.is_direct_purchasing": function (val) {
      if (val != null && val == 1) {
        this.baseData.disableAgent = true;
        this.baseData.deliveryTypeDisabled = true;
        this.formData.deliveryType = 1;
      } else {
        this.baseData.disableAgent = false;
        this.baseData.deliveryTypeDisabled = false;
        //供应商为 代理且团购 时，配送方式只能为 “自提”
        if (val != null && val == 2 && this.formData.isAgent == 1) {
          this.formData.deliveryType = 2;
        }
      }
    },
    "formData.isAgent": function (val) {
      if (val != null && val == 1) {
        this.formData.merchantModel = 1;
        this.baseData.agentDisabled = true;
        this.formData.is_direct_purchasing = 0;
      } else {
        this.formData.agentCityI = null;
        this.formData.platform_ratio = 0;
        this.baseData.agentDisabled = false;
      }
      //供应商为 代理且团购 时，配送方式只能为 “自提”
      if (val != null && val == 1 && this.formData.is_direct_purchasing == 0) {
        this.formData.deliveryType = 2;
      }
      this.baseData.deliveryTypeDisabled = false;
    },
    "formData.deliveryType": function (val) {
      if (val != null && (val == 1 || val == 3)) {
        this.formData.merchantModel = 1;
        this.baseData.merchantModelDisabled = true;
      } else {
        this.baseData.merchantModelDisabled = false;
      }
    },
  },
  computed: {
    /**
     * 直购角色
     */
    isDirect() {
      return this.$store.state.userInfo.roleType == 3;
    },
    isSupplyManager() {
      return (this.$store.state.userInfo.roles || []).some(
        (a) => a.adminRoleNo == "supplymanager"
      );
    },
    isCountry() {
      return this.$store.state.userInfo.roleType == 0;
    },
  },
  //方法列表
  methods: {
    handleCheckedCitiesChange() {},
    /**
     * 初始化
     * @param {*} data
     * @param {*} compProp
     */
    initData(data, compProp) {
      this.baseInitData(data, compProp);
      if (this.baseData.mode == "add") {
        this.formData.is_direct_purchasing = this.isDirect ? 1 : 0;
        if (!this.isSupplyManager) {
          this.formData.merchantModel = 1;
        }
      } else {
        if (this.formData.contractValidityBegin) {
          this.contractTimeArr.push(this.formData.contractValidityBegin);
          this.contractTimeArr.push(this.formData.contractValidityEnd);
        }
      }
      this.goodsCategoryI = this.formData.goodsCategoryI;
      if ((this.formData.serviceScopesList || []).length > 0) {
        this.formData.supplySiteIds = this.formData.serviceScopesList
          .filter((a) => a.addressCityId > 0)
          .map((a) => a.addressCityId);
        var self = this;
        this.$nextTick(() => {
          if (self.$refs.tree) {
            self.$refs.tree.setCheckedKeys(self.formData.supplySiteIds);
          }
        });
      }
      //武汉城市账号默认选中武汉
      if (
        this.$store.state.userInfo.roleType === 2 &&
        this.$store.state.userInfo.cityId === 4 &&
        this.baseData.mode === "add"
      ) {
        this.formData.supplySiteIds = [4];
      }
      this.$refs.afterSale.initData(this.formData.afterSaleInfoList);
      this.removeClass();
    },
    exec(cmd) {
      //只提交图片信息
      //this.$emit(cmd, this.getImgData());
    },
  },
};
</script>
