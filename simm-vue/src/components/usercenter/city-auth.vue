<template>
  <el-row v-if="user.roleType===2" style="margin-bottom:10px;">
    <h4>
      <i class="el-icon-s-operation"></i>城市功能配置
    </h4>
    <table class="el-table el-table--fit el-table--border city-func" style="align:center;">
      <thead>
        <th>差异化上架</th>
        <th>余额支付</th>
        <th>是否为代理</th>
        <th>建品审批</th>
        <th>配送方式</th>
        <th>默认团长佣金比例</th>
      </thead>
      <tbody>
        <tr style="line-height:30px;">
          <td>{{city.isDiff===1?"Y":"N"}}</td>
          <td>{{city.isPayByBalance===1?"Y":"N"}}</td>
          <td>{{city.is_agent===1?"Y":"N"}}</td>
          <td>{{city.isAudit===1?"Y":"N"}}</td>
          <td>{{$cacheUtil.getVal("delivery_type",city.deliveryType)}}</td>
          <td>{{city.commissionRatio>0?(city.commissionRatio+"%"):""}}</td>
        </tr>
      </tbody>
    </table>
    <p style="font-style: italic;color: crimson;margin-top:5px;">
      <span>Y：支持此功能</span>
      <span style="margin-left:20px;">N：不支持此功能</span>
    </p>
  </el-row>
</template>
<script>
import requestMixin from "@/common/mixins/requestMixin";
export default {
  name: "cityAuth",
  mixins: [requestMixin],
  data() {
    return {
      city: {},
      user: this.$store.state.userInfo
    };
  },
  created() {
    if (this.user.roleType === 2) {
      this.getCityAuth(this.user.cityId);
    }
  },
  methods: {
    getCityAuth(cityId) {
      var self = this;
      this.getCityInfo(cityId, city => {
        self.city = city;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.city-func {
  th,
  tr,
  td {
    text-align: center;
  }
}
</style>