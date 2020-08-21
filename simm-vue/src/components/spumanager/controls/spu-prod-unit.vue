<template>
  <el-card class="box-card" style="margin-right:3px;margin-bottom:3px;">
    <el-form
      :model="formData"
      :disabled="disabled"
      :rules="rules"
      ref="request"
      label-width="80px"
      style="padding:5px;"
    >
      <el-row>
        <el-col :span="20">
          <!-- 水果 -->
          <el-form-item label="单位" prop="unit" v-if="unitConfig.unitType == 1">
            <el-select
              :disabled="disabled"
              v-model="formData.unit"
              clearable
              filterable
              placeholder="请选择单位"
              @change="fruitUnitChange"
              @clear="fruitUnitChange"
            >
              <el-option
                v-for="(item,index) in $cacheUtil.getDic('prod_unit')"
                :key="'prod_unit'+index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 标品 -->
          <el-form-item label="单位" prop="unit" v-if="unitConfig.unitType == 2">
            <el-select
              :disabled="disabled"
              v-model="formData.unit"
              clearable
              filterable
              placeholder="请选择单位"
              @change="unitChange"
              @clear="unitChange"
            >
              <el-option
                v-for="(item, key) in baseData.unitData"
                :key="key"
                :label="item.unitName"
                :value="item.unitName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <slot name="append"></slot>
        </el-col>
        <el-col :span="24">
          <!-- 水果单位为个时-->
          <el-form-item label="规格" v-if="unitConfig.unitType == 1 && formData.unit == '个'">
            <el-col :span="2" align="center">1{{formData.unit}}</el-col>
            <el-col :span="2" align="center">=</el-col>
            <el-col :span="18">
              <el-col :span="11">
                <el-form-item prop="minNum">
                  <el-input
                    :disabled="disabled"
                    v-model="formData.minNum"
                    @change="handleChange('minNum')"
                    placeholder="请输入规格"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" align="center">~</el-col>
              <el-col :span="11">
                <el-form-item prop="maxNum">
                  <el-input
                    :disabled="disabled"
                    v-model="formData.maxNum"
                    @change="handleChange('maxNum')"
                    placeholder="请输入规格"
                  />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="2" align="center">KG</el-col>
          </el-form-item>
          <!-- 水果单位为盒/箱时 -->
          <el-form-item
            label="规格"
            v-if="unitConfig.unitType == 1 && 
                (formData.unit == '盒' || formData.unit == '箱' || formData.unit == '袋' || formData.unit == '组' || formData.unit == '份')"
          >
            <el-col :span="2" align="center">1{{formData.unit}}</el-col>
            <el-col :span="2" align="center">=</el-col>
            <el-col
              :span="13"
              v-if="formData.fruitUnit == '个' || formData.fruitUnit == '袋' || formData.fruitUnit == '盒'"
            >
              <el-col :span="11">
                <el-form-item prop="minOne">
                  <el-input
                    :disabled="disabled"
                    v-model="formData.minOne"
                    @change="handleChange('minOne')"
                    placeholder="请输入规格"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" align="center">~</el-col>
              <el-col :span="11">
                <el-form-item prop="maxOne">
                  <el-input
                    :disabled="disabled"
                    v-model="formData.maxOne"
                    @change="handleChange('maxOne')"
                    placeholder="请输入规格"
                  />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="13" v-else>
              <el-col :span="11">
                <el-form-item prop="min">
                  <el-input
                    :disabled="disabled"
                    v-model="formData.min"
                    @change="handleChange('min')"
                    placeholder="请输入规格"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" align="center">~</el-col>
              <el-col :span="11">
                <el-form-item prop="max">
                  <el-input
                    :disabled="disabled"
                    v-model="formData.max"
                    @change="handleChange('max')"
                    placeholder="请输入规格"
                  />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="6" align="center">
              <el-form-item prop="fruitUnit">
                <el-select
                  :disabled="disabled"
                  v-model="formData.fruitUnit"
                  clearable
                  filterable
                  placeholder="请选择单位"
                  @change="fruitViceUnitChange"
                  @clear="fruitViceUnitChange"
                >
                  <el-option label="KG" value="KG"></el-option>
                  <el-option label="克" value="克"></el-option>
                  <el-option label="个" value="个"></el-option>
                  <el-option label="袋" value="袋"></el-option>
                  <el-option label="盒" value="盒"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="24"
              v-if="formData.fruitUnit == '个' || formData.fruitUnit == '袋' || formData.fruitUnit == '盒'"
              style="margin-top: 18px;"
            >
              <el-col :span="2" align="center">1{{formData.fruitUnit}}</el-col>
              <el-col :span="2" align="center">=</el-col>
              <el-col :span="14">
                <el-col :span="11">
                  <el-form-item prop="minVice">
                    <el-input
                      :disabled="disabled"
                      v-model="formData.minVice"
                      @change="handleChange('minVice')"
                      placeholder="请输入规格"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2" align="center">~</el-col>
                <el-col :span="11">
                  <el-form-item prop="maxVice">
                    <el-input
                      :disabled="disabled"
                      v-model="formData.maxVice"
                      @change="handleChange('maxVice')"
                      placeholder="请输入规格"
                    />
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="6" align="center">
                <el-select
                  :disabled="disabled"
                  v-model="formData.secondfruitUnit"
                  @change="specificationFlag"
                  filterable
                  placeholder="请选择单位"
                >
                  <el-option label="KG" value="KG"></el-option>
                  <el-option label="克" value="克"></el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-form-item>
          <!-- 标品单位不为KG时 -->
          <el-form-item
            label="规格"
            v-if="unitConfig.unitType == 2 && formData.unit!='' && !isKgFlag"
          >
            <!-- 标品三级单位 -->
            <el-col :span="11">
              <el-col :span="12">
                <el-form-item prop="third_sales_multiple">
                  <el-input
                    :disabled="disabled"
                    placeholder="请输入"
                    v-model.trim="formData.third_sales_multiple"
                    @change="specificationFlag"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="third_unit">
                  <el-select
                    :disabled="disabled"
                    v-model="formData.third_unit"
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="specificationFlag"
                    @clear="specificationFlag"
                  >
                    <el-option
                      v-for="(item, key) in thirdUnitData"
                      :key="key"
                      :label="item.unitName"
                      :value="item.unitName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="2" align="center" v-if="level == 2">/ {{formData.first_unit}}</el-col>
            <el-col :span="2" align="center">*</el-col>
            <!-- 标品二级单位 -->
            <el-col :span="11">
              <el-col :span="10">
                <el-form-item>
                  <el-input
                    :disabled="disabled"
                    placeholder="请输入"
                    v-model.trim="formData.sec_sales_multiple"
                    @change="specificationFlag"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item>
                  <el-select
                    :disabled="disabled"
                    v-model="formData.sec_unit"
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="secUnitChange"
                    @clear="secUnitChange"
                  >
                    <el-option
                      v-for="(item, key) in baseData.secUnitData"
                      :key="key"
                      :label="item.unitName"
                      :value="item.unitName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" align="center">/ {{formData.unit}}</el-col>
            </el-col>
            <el-col :span="24" style="margin-top: 15px; line-height: 20px;" v-if="level == 2">
              <span style="margin: 0;  color: red;">规格示例：200克/袋</span>
            </el-col>
            <el-col :span="24" style="margin-top: 15px; line-height: 20px;">
              <span style="margin: 0;  color: red;">规格示例：200克/袋 或者 250毫升*12瓶/箱</span>
            </el-col>
          </el-form-item>
          <!-- 标品单位为KG时 -->
          <el-form-item label="规格" v-if="unitConfig.unitType == 2 && formData.unit!='' && isKgFlag">
            <el-col :span="2" align="center">1</el-col>
            <el-col :span="9">
              <el-form-item prop="third_unit">
                <el-select
                  :disabled="disabled"
                  v-model="formData.third_unit"
                  clearable
                  filterable
                  placeholder="请选择"
                  @change="specificationFlag"
                  @clear="specificationFlag"
                >
                  <el-option
                    v-for="(item, key) in baseData.secUnitData"
                    :key="key"
                    :label="item.unitName"
                    :value="item.unitName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" align="center">=</el-col>
            <el-col :span="9">
              <el-form-item prop="third_sales_multiple">
                <el-input
                  :disabled="disabled"
                  placeholder="请输入"
                  v-model.trim="formData.third_sales_multiple"
                  @change="specificationFlag"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" align="center">{{formData.unit}}</el-col>
            <el-col :span="24" style="margin-top: 15px; line-height: 20px;">
              <span style="margin: 0;  color: red;">规格示例：1箱=15KG</span>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
let salesModelConfig = [
  {
    unit: "KG",
    salesModel: 3
  },
  {
    unit: "个",
    salesModel: 23
  },
  {
    unit: "盒",
    salesModel: 6
  },
  {
    unit: "箱",
    salesModel: 4
  },
  {
    unit: "袋",
    salesModel: 7
  },
  {
    unit: "组",
    salesModel: 31
  },
  {
    unit: "份",
    salesModel: 26
  }
];
let fieldValid = {
  min: "单位的最小值不能为空",
  max: "单位的最大值不能为空",
  minNum: "单位的最小值不能为空",
  maxNum: "单位的最大值不能为空",
  minVice: "单位的最小值不能为空",
  maxVice: "单位的最大值不能为空",
  minOne: "单位的最小值不能为空",
  maxOne: "单位的最大值不能为空",
  first_unit: "一级单位不能为空",
  fruitUnit: "水果单位不能为空",
  unit: "单位不能为空",
  // 标品二级单位值
  sec_sales_multiple: "标品二级单位值不能为空",
  // 标品二级单位
  sec_unit: "标品二级单位不能为空",
  // 标品三级单位值
  third_sales_multiple: "标品三级单位值不能为空",
  // 标品三级单位
  third_unit: "标品三级单位不能为空"
};
let validFunc = (vue, data, fields) => {
  fields.forEach(f => {
    if (vue.$commonUtil.valid.isEmpty(data[f])) {
      vue.$commonUtil.valid.throwEx(fieldValid[f]);
    }
  });
};
let unitConfigList = [
  {
    unitType: 1, //水果
    categoryValid: (categoryOne, categoryTwo) =>
      categoryOne == "水果绿植" && categoryTwo != "绿植鲜花",
    //符合一二级类目过滤条件的规则
    unitRules: [
      {
        unitValid: data => data.unit == "KG",
        format: data => "(KG)",
        valid: (vue, data) => {
          validFunc(vue, data, ["unit"]);
        }
      },
      {
        unitValid: data => data.unit == "个",
        format: data => {
          if (data.maxNum > 0) {
            return `${data.minNum}~${data.maxNum}${data.secondfruitUnit}/${data.unit}`;
          } else {
            return `${data.minNum}${data.secondfruitUnit}/${data.unit}`;
          }
        },
        valid: (vue, data) => {
          validFunc(vue, data, ["unit", "minNum"]);
        }
      },
      // {
      //     unitValid: data => data.unit == "盒",
      //     format: data => `${data.minNum}~${data.maxNum}KG/${data.unit}`,
      //     valid: (vue, data) => {
      //         validFunc(vue, data, ['unit', 'minNum', 'maxNum']);
      //     }
      // },
      {
        unitValid: data =>
          data.unit == "盒" ||
          data.unit == "箱" ||
          data.unit == "袋" ||
          data.unit == "组" ||
          data.unit == "份",
        format: data => {
          if (data.fruitUnit == "KG" || data.fruitUnit == "克") {
            if (data.max > 0) {
              return `${data.min}~${data.max}${data.fruitUnit}/${data.unit}`;
            } else {
              return `${data.min}${data.fruitUnit}/${data.unit}`;
            }
          } else {
            var secStr = "";
            if (data.maxVice > 0) {
              secStr = `${data.minVice}~${data.maxVice}${data.secondfruitUnit}/${data.fruitUnit}`;
            } else {
              secStr = `${data.minVice}${data.secondfruitUnit}/${data.fruitUnit}`;
            }
            if (data.maxOne > 0) {
              return `${data.minOne}~${data.maxOne}${data.fruitUnit}/${data.unit}(${secStr})`;
            } else {
              return `${data.minOne}${data.fruitUnit}/${data.unit}(${secStr})`;
            }
          }
        },
        valid: (vue, data) => {
          if (data.fruitUnit == "KG" || data.fruitUnit == "克") {
            validFunc(vue, data, ["unit", "min"]);
          } else {
            validFunc(vue, data, ["unit", "minOne", "minVice"]);
          }
        }
      }
    ]
  },
  {
    unitType: 2, //标品
    categoryValid: (categoryOne, categoryTwo) =>
      !(categoryOne == "水果绿植" && categoryTwo != "绿植鲜花"),
    //不符合一二级类目过滤条件的规则(min 输入值，unit一级单位，second 二级单位(列表))
    unitRules: [
      {
        unitValid: data => data.unit == "KG",
        format: data => `${data.third_sales_multiple}KG/${data.third_unit}`,
        valid: (vue, data) => {
          validFunc(vue, data, ["unit", "third_sales_multiple", "third_unit"]);
        }
      },
      //200克/袋 或者 250毫升*12瓶/箱
      {
        unitValid: data => data.unit != "KG",
        format: data => {
          if (data.sec_unit != "") {
            return `${data.third_sales_multiple}${data.third_unit}/${data.sec_unit}*${data.sec_sales_multiple}${data.sec_unit}/${data.unit}`;
          } else if (data.third_unit != "") {
            return `${data.third_sales_multiple}${data.third_unit}/${data.unit}`;
          } else {
            return `/${data.unit}`;
          }
        },
        valid: (vue, data) => {
          if (data.sec_unit != "") {
            validFunc(vue, data, [
              "unit",
              "third_sales_multiple",
              "third_unit",
              "sec_sales_multiple"
            ]);
          } else if (data.third_unit != "") {
            validFunc(vue, data, ["unit", "third_sales_multiple"]);
          } else {
            validFunc(vue, data, ["unit"]);
          }
        }
      }
    ]
  }
];
const MIN_NUMBER = 0;
const MAX_NUMBER = 100000;
export default {
  name: "SpuProdUnit",
  props: {
    //禁用编辑
    disabled: false,
    entity: {
      isSelfBrand: 0
    },
    baseData: {
      unitData: [],
      secUnitData: []
    }
  },
  data() {
    return {
      isKgFlag: false,
      level: "",
      unitConfig: {},
      formData: {
        categoryName: "",
        twoCategoryName: "",
        min: "",
        max: "",
        minNum: "",
        maxNum: "",
        minVice: "",
        maxVice: "",
        minOne: "",
        maxOne: "",
        first_unit: "",
        fruitUnit: "",
        secondfruitUnit: "KG",
        unit: "",
        // 标品二级单位值
        sec_sales_multiple: "",
        // 标品二级单位
        sec_unit: "",
        // 标品三级单位值
        third_sales_multiple: "",
        // 标品三级单位
        third_unit: ""
      },
      rules: {}
    };
  },
  computed: {
    thirdUnitData: function() {
      return this.baseData.secUnitData;
    }
  },
  watch: {
    "formData.unit": {
      handler: function(val) {
        this.isKgFlag = val == "KG";
      }
    }
  },
  created() {
    this.formData = {
      ...this.formData,
      ...this.entity
    };
    this.initRules();
    this.unitConfig = unitConfigList.find(a =>
      a.categoryValid(this.formData.categoryName, this.formData.twoCategoryName)
    );
  },
  //方法列表
  methods: {
    initRules() {
      this.rules = {
        min: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          },
          {
            validator: this.validateCom,
            trigger: "blur"
          },
          {
            validator: this.validateMin,
            max: this.formData.max,
            trigger: "blur"
          }
        ],
        // max: [{
        //         required: true,
        //         message: '请输入规格',
        //         trigger: 'blur'
        //     },
        //     {
        //         validator: this.validateCom,
        //         trigger: 'blur'
        //     },
        //     {
        //         validator: this.validateMax,
        //         min: this.formData.min,
        //         trigger: 'blur'
        //     }
        // ],
        minVice: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          },
          {
            validator: this.validateCom,
            trigger: "blur"
          },
          {
            validator: this.validateMin,
            max: this.formData.maxVice,
            trigger: "blur"
          }
        ],
        // maxVice: [{
        //         required: true,
        //         message: '请输入规格',
        //         trigger: 'blur'
        //     },
        //     {
        //         validator: this.validateCom,
        //         trigger: 'blur'
        //     },
        //     {
        //         validator: this.validateMax,
        //         min: this.formData.minVice,
        //         trigger: 'blur'
        //     }
        // ],
        minNum: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          },
          {
            validator: this.validateCom,
            trigger: "blur"
          }
        ],
        // maxNum: [{
        //         required: true,
        //         message: '请输入规格',
        //         trigger: 'blur'
        //     },
        //     {
        //         validator: this.validateCom,
        //         trigger: 'blur'
        //     },
        // ],
        minOne: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          },
          {
            validator: this.validateComOne,
            trigger: "blur"
          },
          {
            validator: this.validateMin,
            max: this.formData.maxOne,
            trigger: "blur"
          }
        ],
        secondfruitUnit: [
          {
            required: true,
            message: "请选择二级单位",
            trigger: "blur"
          }
        ],
        sec_sales_multiple: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          },
          {
            pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,6})?$/,
            message: "请输入正确的规格",
            trigger: "blur"
          }
        ],
        sec_unit: [
          {
            required: true,
            message: "请选择单位",
            trigger: "blur"
          }
        ],
        unit: [
          {
            required: true,
            message: "请选择单位",
            trigger: "change"
          }
        ],
        fruitUnit: [
          {
            required: true,
            message: "请选择单位",
            trigger: "change"
          }
        ]
      };
    },
    validateCom(rule, value, callback) {
      const one = Number(value);
      // Number.isInteger(one)  效验正整数
      if (/^([1-9][\d]{0,7}|0)(\.[\d]{1,6})?$/.test(one)) {
        if (one < MIN_NUMBER) {
          return callback(new Error("输入值必须大于0"));
        } else if (one > MAX_NUMBER) {
          return callback(new Error("输入值必须小于100000"));
        }
        return callback();
      }
      return callback(new Error("请输入正取的数值"));
    },
    validateComOne(rule, value, callback) {
      const one = Number(value);
      if (Number.isInteger(one)) {
        if (one < MIN_NUMBER) {
          return callback(new Error("输入值必须大于0"));
        } else if (one > MAX_NUMBER) {
          return callback(new Error("输入值必须小于100000"));
        }
        return callback();
      }
      return callback(new Error("请输入正取的数值"));
    },
    validateMin(rule, value, callback) {
      if (rule.max == "") {
        return callback();
      }
      const one = Number(value);
      const max = Number(rule.max);
      if (!max || one <= max) {
        return callback();
      }
      return callback(new Error("输入值不得大于最大阈值"));
    },
    validateMax(rule, value, callback) {
      const one = Number(value);
      const min = Number(rule.min);
      if (!min || one >= min) {
        return callback();
      }
      return callback(new Error("输入值不得小于最小阈值"));
    },
    fruitUnitChange() {
      this.formData.min = "";
      this.formData.max = "";
      this.formData.minNum = "";
      this.formData.maxNum = "";
      this.formData.minVice = "";
      this.formData.maxVice = "";
      this.specificationFlag();
    },
    fruitViceUnitChange() {
      this.formData.minVice = "";
      this.formData.maxVice = "";
      this.specificationFlag();
    },
    // 标品一级单位选择
    unitChange(value) {
      var self = this;
      self.dataInit();
      var unit = self.baseData.unitData.find(a => a.unitName == value);
      if (unit) {
        self.level = unit.level;
        self.parentId = unit.id;
        self.formData.salesModel = unit.salesModel;
      }
      this.specificationFlag();
    },
    dataInit() {
      this.formData.sec_unit = "";
      this.formData.sec_sales_multiple = "";
      this.formData.third_unit = "";
      this.formData.third_sales_multiple = "";
    },
    // 二级单位选择
    secUnitChange(value) {
      var self = this;
      self.baseData.secUnitData.forEach(ele => {
        if (ele.unitName == value) {
          self.parentId = ele.id;
        }
      });
      self.specificationFlag();
    },
    handleChange(field) {
      this.$refs.request.validateField(field);
      this.specificationFlag();
    },
    unitValid() {
      if (this.currentValid) {
        this.currentValid(this, this.formData);
      }
    },
    //计算规格信息
    specificationFlag() {
      var self = this;
      // 水果传sales_model
      if (self.unitConfig.unitType == 1) {
        var config = salesModelConfig.find(a => a.unit == self.formData.unit);
        if (config) {
          self.formData.salesModel = config.salesModel;
        } else {
          self.formData.salesModel = 3; //默认值给个3
        }
      }
      var rule = this.unitConfig.unitRules.find(a =>
        a.unitValid(self.formData)
      );
      if (rule) {
        self.formData.validFunc = () => {
          rule.valid(self, self.formData);
        };
        self.formData.specVal = self.formData.unit;
        self.formData.specification = rule.format(self.formData);
        delete self.formData.specJson;
        var copy = JSON.parse(JSON.stringify(self.formData));
        delete copy.creatorId;
        delete copy.creatorName;
        delete copy.createTime;
        delete copy.modifierId;
        delete copy.modifierName;
        delete copy.modifyTime;
        delete copy.deleteFlag;
        self.formData.specJson = JSON.stringify(copy);
      }
      this.$emit("specificationChange", this.formData);
    }
  }
};
</script>
