<template>
  <section class="content-section spu-edit">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane actived label="基本信息" name="first">
        <el-row>
          <h4 class="text-theme">基本信息</h4>
          <el-col :span="24" style="padding:20px;">
            <table class="table table-hover table-bordered table-largePadding">
              <thead>
                <th width="150px" />
                <th width="40%" />
                <th width="150px" />
                <th width="40%" />
              </thead>
              <tbody>
                <tr>
                  <td>SPU编码</td>
                  <td>{{formData.spuNumber}}</td>
                  <td>是否为自有品牌</td>
                  <td>{{formData.isSelfBrand==1?'是':'否'}}</td>
                </tr>
                <tr>
                  <td>一级类目</td>
                  <td>{{formData.categoryName}}</td>
                  <td>商品品牌</td>
                  <td>{{formData.brandName}}</td>
                </tr>
                <tr>
                  <td>二级类目</td>
                  <td>{{formData.twoCategoryName}}</td>
                  <td>商品产地</td>
                  <td>{{formData.placeName}}</td>
                </tr>
                <tr>
                  <td>三级类目</td>
                  <td>{{formData.threeCategoryName}}</td>
                  <td>组合名称</td>
                  <td colspan="3">{{formData.jointName}}</td>
                </tr>
                <tr>
                  <td>品名</td>
                  <td>{{formData.spuName}}</td>
                  <td>商品属性</td>
                  <td>{{ $cacheUtil.getVal('storage_method',formData.storageModeCode )}}</td>
                </tr>
                <tr>
                  <td>保质期</td>
                  <td>{{formData.quaranteePeriodCode}}天</td>
                  <td>审核状态</td>
                  <td>{{ $cacheUtil.getVal('prod_audit_status',formData.processStatus ) }}</td>
                </tr>
              </tbody>
            </table>
          </el-col>
        </el-row>
        <el-row>
          <h4 class="text-theme">商品规格</h4>
          <el-col :span="24" style="padding:20px;">
            <table class="table table-hover table-bordered">
              <thead>
                <th width="60" style="height:40px;">序号</th>
                <th width="180" style="height:40px;">规格名称</th>
                <th>规格值</th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in formData.specList" :key="'spec'+index">
                  <td style="vertical-align: middle;">{{ index+1 }}</td>
                  <td style="vertical-align: middle;">{{item.name}}</td>
                  <!-- 非单位 -->
                  <td style="vertical-align: middle;" v-if="item.spec!=baseData.unitSpec">
                    <el-tag
                      size="mini"
                      effect="plain"
                      v-for="(specItem,i) in item.specArr"
                      :key="'spec'+index+'val'+i"
                    >{{specItem.specVal}}</el-tag>
                  </td>
                  <!-- 单位 -->
                  <td style="vertical-align: middle;" v-if="item.spec==baseData.unitSpec">
                    <el-col
                      :span="12"
                      v-for="(specItem,i) in item.specArr"
                      :key="'spec'+index+'val'+i"
                    >
                      <SpuProdUnit
                        :entity="specItem"
                        :baseData="baseData"
                        :index="i"
                        label-width="0"
                        disabled
                      ></SpuProdUnit>
                    </el-col>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-col>
        </el-row>
        <el-row>
          <h4 class="text-theme">SKU列表</h4>
          <el-col :span="24">
            <el-table
              border
              ref="multipleTable"
              :data="formData.skuMixList"
              style="width: 100%;margin-top:10px;"
              fit
              max-height="350"
            >
              <el-table-column type="index" label="序号" width="70"></el-table-column>
              <el-table-column prop="productName" label="规格名称" width="240"></el-table-column>
              <el-table-column prop="prodNumber" label="SKU编码" width="200"></el-table-column>
              <el-table-column prop="processStatus" label="审核状态" v-if="formData.id>0">
                <template slot-scope="scope">
                  <sxh-process
                    process-enum="SKU_AUDIT"
                    :key="`sku_process_`+scope.row.id"
                    :ref-id="scope.row.id"
                    :process-status="scope.row.processStatus"
                  ></sxh-process>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(spec,index) in (formData.specList||[])"
                :key="'spec'+index"
                :label="spec.name"
              >
                <template slot-scope="scope">{{ (scope.row.specAttrs||{})['spec' + spec.spec]}}</template>
              </el-table-column>
              <el-table-column prop="barCode" label="条形码"></el-table-column>
              <el-table-column prop="tax" label="税率">
                <template slot-scope="scope">{{$cacheUtil.getVal('tax-new',scope.row.tax)}}</template>
              </el-table-column>
              <el-table-column prop="parentName" label="母码"></el-table-column>
              <el-table-column prop="length" label="长">
                <template slot-scope="scope">{{scope.row.length? (scope.row.length+'mm'):''}}</template>
              </el-table-column>
              <el-table-column prop="width" label="宽">
                <template slot-scope="scope">{{scope.row.width? (scope.row.width+'mm'):''}}</template>
              </el-table-column>
              <el-table-column prop="height" label="高">
                <template slot-scope="scope">{{scope.row.height? (scope.row.height+'mm'):''}}</template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <!-- 审核进入 有以下菜单 -->
          <el-col
            :span="24"
            v-if="baseData.mode!=='view'"
            style="text-align:center;margin-top:20px;"
          >
            <span v-permission:spu_manager_audit>
              <el-button
                type="primary"
                v-if="baseData.auditId!=null"
                @click="$emit('audit',1,baseData.auditId)"
              >审核通过</el-button>
              <el-button
                type="primary"
                v-if="baseData.auditId!=null"
                @click="$emit('audit',-1,baseData.auditId)"
              >审核不通过</el-button>
            </span>
            <el-button @click="$back">返回</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" v-if="formData.id!=null">
        <sxh-log ref="detailLog" :biz-list="[4]" :id-list="[formData.id]"></sxh-log>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import spuProdUnit from "./spu-prod-unit";
import { setTimeout } from "timers";
export default {
  name: "SpuView",
  components: {
    SpuProdUnit: spuProdUnit
  },
  props: {
    entity: {
      isSelfBrand: 0
    },
    baseData: {
      unitData: [],
      secUnitData: [],
      categoryNameData: []
    },
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      activeName: "first",
      specDic: [],
      // 二级类目数据
      twoCategoryNameData: [],
      formData: {
        isSelfBrand: null,
        spuName: "",
        categoryId: "",
        categoryName: "",
        twoCategoryId: "",
        twoCategoryName: "",
        storageModeCode: "",
        quaranteePeriodCode: "",
        //默认数据为编辑中
        processStatus: 0,
        spuNumber: "",
        brandName: "",
        placeName: "",
        specList: []
      }
    };
  },
  watch: {
    //监听外部实体信息的变化
    entity: {
      handler: function(val) {
        var self = this;
        this.formData = {
          ...this.formData,
          ...val
        };
        setTimeout(() => {
          if (self.$refs.multipleTable) {
            self.$refs.multipleTable.doLayout();
          }
        }, 2000);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.form-input {
  float: left;
  margin-bottom: 0;
  padding-right: 10px;
}
</style>
