<template>
  <section class="content-section spu-edit">
    <el-row>
      <el-col>
        <!-- sku编码 -->
        <span v-if="baseData.canEdit || formData.processStatus == 3">
          <el-button type="primary" class="btn-default" @click="generateMix">重新生成SKU组合</el-button>
        </span>
        <el-table
          border
          ref="multipleTable"
          :data="formData.skuMixList"
          style="width: 100%;margin-top:10px;"
        >
          <el-table-column type="index" width="70" label="序号" fixed></el-table-column>
          <el-table-column prop="productName" width="240" label="规格名称" fixed></el-table-column>
          <el-table-column width="150" prop="prodNumber" label="SKU编码" v-if="formData.id>0" fixed></el-table-column>
          <el-table-column width="120" prop="processStatus" label="审核状态" v-if="formData.id>0" fixed>
            <template slot-scope="scope">
              <sxh-process
                process-enum="SKU_AUDIT"
                :key="`sku_process_`+scope.row.id"
                :ref-id="scope.row.id"
                :process-status="scope.row.processStatus"
              ></sxh-process>
            </template>
          </el-table-column>
          <el-table-column width="80" label="操作" fixed>
            <template slot-scope="scope">
              <!-- 草稿状态允许删除 -->
              <el-button
                plain
                size="minier"
                v-if="rowCanEdit(scope.row,null)"
                @click="removeItem(scope.row,scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            v-for="(spec,index) in specList"
            :key="'spec'+index"
            :label="spec.name"
          >
            <template slot-scope="scope">{{ (scope.row.specAttrs||{})['spec' + spec.spec]}}</template>
          </el-table-column>
          <el-table-column width="240" prop="barCode" label="条形码">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.barCode"
                :disabled="!rowCanEdit(scope.row,'barCode')"
                placeholder="请输入条形码"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column width="150" prop="tax" label="税率">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.tax"
                :disabled="!rowCanEdit(scope.row,null)"
                clearable
                filterable
                placeholder="请选择税率"
              >
                <el-option
                  v-for="(item, key) in $cacheUtil.getDic('tax-new')"
                  :key="key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="parentName" label="母码">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.parentName"
                v-if="(scope.row.parentList||[]).length>0"
                :disabled="!rowCanEdit(scope.row,'refId')"
                :title="scope.row.parentName"
                clearable
                filterable
                placeholder="请选择母码"
              >
                <el-option
                  v-for="(item, key) in (scope.row.parentList||[])"
                  :key="key"
                  :label="item.productName"
                  :value="item.productName"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="180" prop="length" label="长">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.length"
                :disabled="!rowCanEdit(scope.row,null)"
                type="number"
                :min="0"
                placeholder="请输入长"
              >
                <template slot="append">mm</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column width="180" prop="width" label="宽">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.width"
                :disabled="!rowCanEdit(scope.row,null)"
                type="number"
                :min="0"
                placeholder="请输入宽"
              >
                <template slot="append">mm</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column width="180" prop="height" label="高">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.height"
                :disabled="!rowCanEdit(scope.row,null)"
                type="number"
                :min="0"
                placeholder="请输入高"
              >
                <template slot="append">mm</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col :span="24" style="text-align:center;">
        <span v-permission:spu_manager_edit>
          <el-button
            type="primary"
            v-if="baseData.canEdit || formData.processStatus==3"
            @click="$emit('save',formData)"
          >保存</el-button>
          <el-button type="primary" v-if="baseData.canEdit" @click="$emit('submit',formData)">提交</el-button>
        </span>
        <el-button @click="$emit('prev',formData)">上一步</el-button>
        <el-button @click="$emit('next',formData)">退出</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { stringify } from "querystring";
export default {
  name: "SpuSkuMix",
  props: {
    baseData: {},
    entity: {
      isSelfBrand: 0
    }
  },
  data() {
    return {
      formData: {
        isSelfBrand: null,
        skuMixList: []
      },
      specList: []
    };
  },
  watch: {
    "formData.skuMixList": {
      handler: function(val) {
        //计算sku组合的母码可选择范围
        this.calcParentSource();
      },
      deep: true
    }
  },
  created() {
    this.initData();
  },
  //方法列表1
  methods: {
    rowCanEdit(row, prop) {
      if (prop == "barCode") {
        return this.baseData.canEdit || this.formData.processStatus == 3;
      } else if (prop == "refId") {
        //允许编辑父级编码的条件(未审核通过或者审核通过但还没有保存父子级关系)
        return (
          this.baseData.canEdit ||
          (this.formData.processStatus == 3 && !(row.refId > 0))
        );
      }
      //spu-可编辑 或者 sku未保存 或者 sku为打回或草稿状态
      return (
        this.baseData.canEdit ||
        !(row.id > 0) ||
        row.processStatus == -2 ||
        row.processStatus == 0
      );
    },
    initData() {
      this.formData = {
        ...this.formData,
        ...this.entity
      };
      //获取规格列表
      var self = this;
      (this.formData.specList || []).forEach(spec => {
        if (spec) {
          self.specList.push({
            spec: spec.spec,
            name: spec.name
          });
        }
      });
      //生成笛卡尔集合
      if (this.formData.skuMixList.length == 0) {
        this.generateMix();
      } else {
        //重新计算sku的规格名称
        this.formData.skuMixList.forEach(a => {
          a.productName = self.formData.jointName + a.specDesc;
        });
      }
    },
    /**
     * 计算父级数据源
     */
    calcParentSource() {
      var self = this;
      this.formData.skuMixList.forEach(a => {
        if (a.unit == "KG") {
          a.parentList = [];
          return;
        }
        //如果自身被其他sku设置为母码，则不允许再设置母码
        if (
          self.formData.skuMixList.some(sku => sku.parentName == a.productName)
        ) {
          a.parentList = [];
          return;
        }
        //查找出除单位外，其他规格值都相同的sku做为其母码数据源(以KG为单位的数据不计算母码)
        var key = a.productName.replace(a.specification, "");
        //排除自身(并且不能为子码)
        var list = self.formData.skuMixList.filter(
          sku =>
            sku.productName.includes(key) &&
            sku.productName != a.productName &&
            !(sku.parentName > "")
        );
        var copyList = JSON.parse(JSON.stringify(list));
        (copyList || []).forEach(p => {
          delete p.parentList;
        });
        a.parentList = copyList;
      });
    },
    /**
     * 二维数组的笛卡尔积
     * @param specs 二维数组，需要做笛卡尔积运算的数组
     * @returns {Array}
     */
    multiCartesian(specs) {
      // 判断是否传递了参数，是否是空数组
      if (!specs || specs.length == 0) {
        return [];
      } else {
        return joinSpec(
          [
            {
              productName: "",
              skuName: "",
              specification: "",
              specAttrs: {},
              addInfo: "",
              prodNumber: "",
              parentName: "",
              barCode: "",
              length: "",
              width: "",
              height: "",
              tax: ""
            }
          ],
          specs,
          0,
          specs.length - 1
        );
      }

      // prevProducts 和 specs 两个数组做笛卡尔积
      // i 是索引，表示原始数组遍历的位数
      // max 是原始数组最大的长度
      function joinSpec(prevProducts, specs, i, max) {
        if (i > max) {
          return prevProducts;
        }
        //求单位规格值
        var currentProducts = [],
          currentSpecIsUnit = specs[i].spec == 3,
          //是否为单位
          currentSpecField = "spec" + specs[i].spec,
          currentSpecs = specs[i].specArr;
        // 前面的数组 和 紧跟着后面的数组 做笛卡尔积
        prevProducts.forEach(function(prevProduct) {
          currentSpecs.forEach(function(spec) {
            //拷贝第一个对象
            var currentProduct = JSON.parse(JSON.stringify(prevProduct));
            currentProduct.specAttrs[currentSpecField] = spec.specVal;
            currentProduct.productName += currentSpecIsUnit
              ? spec.specification
              : spec.specVal;
            if (currentSpecIsUnit) {
              currentProduct.specification = spec.specification;
              currentProduct.unit = spec.specVal;
              currentProduct.salesModel = spec.salesModel;
            }
            currentProducts.push(currentProduct);
          });
        });
        // 递归处理，前面笛卡尔积之后的结果作为前面的数组，然后循环往前推进1位
        return joinSpec(currentProducts, specs, ++i, max);
      }
    },
    generateMix() {
      var self = this;
      //生成笛卡尔集合
      self.formData.skuMixList = self.formData.skuMixList || [];
      var list = this.multiCartesian(this.formData.specList);
      list.forEach(a => {
        //计算一个规格字段
        a.specDesc = a.productName;
        a.skuName = self.formData.spuName;
        a.unit = a.unit;
        a.addInfo = JSON.stringify(a.specAttrs);
      });
      //1.保留已经存在的sku信息
      var validList = [];
      self.formData.skuMixList.forEach(a => {
        if (a.id && !self.baseData.canEdit) {
          //非编辑(草稿或驳回)状态下,保留有id的数据
          validList.push(a);
        } else if (list.some(item => item.specDesc == a.specDesc)) {
          //如果sku信息已经存在，则不用移除
          validList.push(a);
        }
        //规格名称需要替换掉
        a.productName = self.formData.jointName + a.specDesc;
      });
      //2.查找到新生成的笛卡尔集
      list.forEach(a => {
        if (!validList.some(item => item.specDesc == a.specDesc)) {
          a.productName = self.formData.jointName + a.specDesc;
          validList.push(a);
        }
      });
      self.formData.skuMixList = validList;
    },
    /**
     * 移除笛卡尔项
     */
    removeItem(sku, index) {
      this.formData.skuMixList.splice(index, 1);
    }
  }
};
</script>
