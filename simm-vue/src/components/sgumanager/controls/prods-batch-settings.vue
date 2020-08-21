<template>
  <section class="content-section sgu-prod-settings">
    <div style="width:100%;height:100%;padding:10px;overflow:auto;">
      <el-form
        :model="defaultFormData"
        ref="defaultFormData"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="24">
            <!-- 实物库存不显示可售数量 -->
            <el-col :span="6" v-if="filter.formData.saleType !=2">
              <el-form-item label="可售数量" prop="defaultSellableStock">
                <el-input v-model="defaultFormData.defaultSellableStock" type="number" :min="0"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="filter.formData.saleType !=2">
              <el-form-item label="虚拟销量" prop="defaultInitSales">
                <el-input v-model="defaultFormData.defaultInitSales" type="number" :min="0"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="filter.formData.saleType !=2">
              <el-form-item label="购买人数" prop="defaultBoughtPeople">
                <el-input v-model="defaultFormData.defaultBoughtPeople" type="number" :min="0"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="filter.formData.isSubAccount !=1">
              <el-form-item label="销售价格" prop="defaultSalePrice">
                <el-input v-model="defaultFormData.defaultSalePrice" type="number" :min="0">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="划线价格" prop="defaultMarketPrice">
                <el-input v-model="defaultFormData.defaultMarketPrice" type="number" :min="0">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="filter.formData.distributionType ===1">
              <el-form-item label="团长比例" prop="defaultCommissionAmountRate">
                <el-input v-model="defaultFormData.defaultCommissionAmountRate" type="number">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="filter.formData.distributionType === 1">
              <el-form-item label="分享比例" prop="defaultSharedCommissionRate">
                <el-input type="number" v-model="defaultFormData.defaultSharedCommissionRate">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="filter.formData.distributionType != 1">
              <el-form-item label="团长佣金" prop="defaultCommissionAmount">
                <el-input v-model="defaultFormData.defaultCommissionAmount" type="number">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="售后周期" prop="defaultAfterSaleCycle">
                <el-input
                  type="text"
                  placeholder="例:一个月"
                  v-model="defaultFormData.defaultAfterSaleCycle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生产日期" prop="defaultProductionDate">
                <el-input
                  type="text"
                  placeholder="例:2019年11月11日"
                  v-model="defaultFormData.defaultProductionDate"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="保质期" prop="defaultGuaranteePeriod">
                <el-input
                  type="text"
                  placeholder="例:六个月"
                  v-model="defaultFormData.defaultGuaranteePeriod"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否限购" prop="defaultIsLimit">
                <el-select v-model="defaultFormData.defaultIsLimit">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="defaultFormData.defaultIsLimit==1">
              <el-form-item label="限购数量" prop="defaultLimitAmount">
                <el-input
                  v-model="defaultFormData.defaultLimitAmount"
                  placeholder="每个用户最多购买数量"
                  title="每个用户最多购买数量"
                  type="number"
                  :min="1"
                  :step="1"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="商品描述" prop="defaultProdDesc">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入商品描述"
                  maxlength="80"
                  show-word-limit
                  v-model="defaultFormData.defaultProdDesc"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="layer-footer" style="text-align:center;">
      <el-button type="primary" @click="syncSettings(defaultFormData,'defaultFormData')">同步设置</el-button>
      <el-button @click="closeWin">取 消</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: "prodsBatchSettings",
  data: function() {
    return {
      filter: {},
      callback: null,
      defaultFormData: {
        defaultSellableStock: "",
        defaultInitSales: "",
        defaultBoughtPeople: "",
        defaultSalePrice: "",
        defaultMarketPrice: "",
        defaultCommissionAmount: "",
        defaultCommissionAmountRate: "",
        defaultSharedCommissionAmount: "",
        defaultSharedCommissionRate: "",
        defaultAfterSaleCycle: "",
        defaultProductionDate: "",
        defaultGuaranteePeriod: "",
        defaultIsLimit: "",
        defaultLimitAmount: "",
        defaultProdDesc: ""
      },
      rules: {
        defaultSellableStock: [
          {
            validator: this.numberValid,
            required: true,
            message: "可售数量不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            message: "可售数量要大于0",
            trigger: "blur"
          }
        ],
        defaultLimitAmount: [
          {
            validator: this.numberValid,
            required: true,
            message: "限购数量不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            message: "限购数量要大于0",
            trigger: "blur"
          }
        ],
        defaultSalePrice: [
          {
            validator: this.numberValid,
            required: true,
            message: "销售价格不能为空",
            trigger: "blur"
          },
          {
            min: 0.01,
            message: "销售价格要大于0",
            trigger: "blur"
          }
        ],
        defaultMarketPrice: [
          {
            validator: this.numberValid,
            required: true,
            message: "划线价格不能为空",
            trigger: "blur"
          },
          {
            min: 0.01,
            message: "划线价格须大于0",
            trigger: "blur"
          }
        ],
        defaultCommissionAmount: [
          {
            validator: this.numberValid,
            required: true,
            message: "团长佣金不能为空",
            trigger: "blur"
          },
          {
            min: 0.01,
            message: "佣金金额须大于0",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.callback = this.$options.propsData.callback;
    this.filter = this.$options.propsData.filter;
  },
  methods: {
    numberValid(rule, value, callback) {
      if (value === "" || value === null || value === undefined) {
        return callback(new Error(rule.message));
      } else {
        return callback();
      }
    },
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
    syncSettings() {
      var self = this;
      if (self.callback) {
        self.callback(self.defaultFormData);
      }
      self.closeWin();
    }
  }
};
</script>
