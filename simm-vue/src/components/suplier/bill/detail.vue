<template>
  <section class="content-section">
    <el-row>
      <el-col :span="12">
        <h4 class="text-theme">费用单</h4>
      </el-col>
      <el-col :span="24" style="padding:20px;">
        <sxh-view-container :item-span="12" :label-width="150" style="padding:10px;">
          <sxh-view-item title="单据类型">{{ $cacheUtil.getVal('bill_model', billInfo.billModel) }}</sxh-view-item>
          <sxh-view-item title="单据名称">{{ billInfo.billName }}</sxh-view-item>
          <sxh-view-item title="公司名称">{{ billInfo.supplyName }}</sxh-view-item>
          <sxh-view-item title="供应商编码">{{ billInfo.supplyNumber }}</sxh-view-item>
          <sxh-view-item title="费用单号">{{ billInfo.billNumber }}</sxh-view-item>
          <sxh-view-item title="是否分账">{{ $cacheUtil.getVal('is_sub_account', billInfo.isSubAccount) }}</sxh-view-item>
          <sxh-view-item title="是否扣款">
            <span style="color: red;">{{ $cacheUtil.getVal('is_deducted', billInfo.isDeducted) }}</span>
            </sxh-view-item>
          <sxh-view-item title="扣款金额">{{ billInfo.billAmount }}</sxh-view-item>
          <sxh-view-item title="城市">{{ billInfo.cityName }}</sxh-view-item>
          <sxh-view-item title="城市ID">{{ billInfo.cityName }}</sxh-view-item>
          <sxh-view-item title="城市">{{ billInfo.cityId }}</sxh-view-item>
          <sxh-view-item title="创建时间">{{ billInfo.createAt }}</sxh-view-item>
          <sxh-view-item title="备注">{{ billInfo.remark }}</sxh-view-item>
        </sxh-view-container>
      </el-col>
    </el-row>
    <el-col :span="12">
      <h4 class="text-theme">操作日志</h4>
    </el-col>
    <el-col :span="24" style="padding:20px;">
      <sxh-log ref="detailLog" :biz-list="[30]" :id-list="[id]"></sxh-log>
    </el-col>
  </section>
</template>
<script>

export default {
  name: "billDetail",
  props: {
    //查看参数
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      id: this.viewParam ? this.viewParam.id : Number(this.$route.params.id),
      billInfo: {},
      data: {}
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      var self = this;
      this.$httpUtil.post({
        url: "/billInfo/queryDetail.json",
        data: {id: this.id},
        succ: function (data) {
          self.billInfo = data.data;
        }
      });
    },
  }
};
</script>
