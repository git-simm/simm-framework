<template>
  <el-row>
    <div class="table-responsive sku-detail">
      <table class="table table-hover table-bordered table-largePadding">
        <tbody>
          <tr>
            <td style="width：120px">是否为自有品牌</td>
            <td>{{formData.isSelfBrand==1?'是':'否'}}</td>
          </tr>
          <tr>
            <td>类目</td>
            <td>{{formData.categoryName}} / {{formData.twoCategoryName}} / {{formData.threeCategoryName}}</td>
          </tr>
          <tr>
            <td>SKU编码</td>
            <td>{{formData.prodNumber}}</td>
          </tr>
          <tr>
            <td>商品名称</td>
            <td>{{formData.productName}}</td>
          </tr>
          <tr>
            <td>单位</td>
            <td>{{formData.unit}}</td>
          </tr>
          <tr>
            <td>规格</td>
            <td>{{formData.specification}}</td>
          </tr>
          <tr>
            <td>产地</td>
            <td>{{formData.placeName}}</td>
          </tr>
          <tr>
            <td>品牌</td>
            <td>{{formData.brandName}}</td>
          </tr>
          <tr>
            <td>税率</td>
            <td>{{formData.tax==0.17?'17%增值税':formData.tax==0.16?'16%增值税':formData.tax==0.13?'13%增值税':formData.tax==0.12?'12%增值税':formData.tax==0.11?'11%增值税':formData.tax==0.10?'10%增值税':formData.tax==0.09?'9%增值税':formData.tax==0.08?'8%增值税':formData.tax==0.07?'7%增值税':formData.tax==0.06?'6%增值税':formData.tax==0.04?'4%增值税':formData.tax==0.05?'5%增值税':formData.tax==0.03?'3%增值税':formData.tax==0.00?'0%增值税':''}}</td>
          </tr>
          <tr>
            <td>商品属性</td>
            <td>{{ $cacheUtil.getVal('storage_method',formData.storageMethod,'' )}}</td>
          </tr>
          <tr>
            <td>审核状态</td>
            <td>{{$cacheUtil.getVal('prod_audit_status',formData.processStatus,'')}}</td>
          </tr>
          <tr>
            <td>采销状态</td>
            <td>
              <span v-if="formData.processStatus==3">
                <span>{{ formData.canBuy===1?"可订货":"不可订货" }}</span> /
                <span>{{ formData.canSale===1?"可销售":"不可销售" }}</span>
              </span>
            </td>
          </tr>
          <tr v-if="formData.deleteFlag==1">
            <td>状态</td>
            <td>
              <span style="color:red">已删除</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-row>
</template>
<script>
export default {
  name: "viewBase",
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    initData(data) {
      this.formData = { ...this.formData, ...data };
    }
  }
};
</script>
<style>
.sku-detail .table.table-largePadding > tbody > tr > td:nth-child(2n + 1) {
  width: 120px;
}
</style>