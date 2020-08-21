<template>
  <section class="content-section">
    <div class="row">
      <div class="col-md-12">
        <img src="/static/img/dhlcshuoming.png" width="935" />
      </div>
    </div>
    <!-- <el-form ref="settingDataForm" label-width="0">
      <el-form-item v-for="(item, index) in settingData">
        <el-checkbox v-model="item.status" :true-label="1" :false-label="0">
          启用
          <span v-if="item.pay_type === 1"></span>
          <span v-else-if="item.pay_type === 2">货到付款</span>
          <span v-else-if="item.pay_type === 3">授信付款</span>
          <span v-else-if="item.pay_type === 4">账期付款</span>
          <span v-else-if="item.pay_type === 5">果坊结算</span>订单自动审核，审核时间5分钟
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('settingDataForm')">提交</el-button>
      </el-form-item>
    </el-form>-->
  </section>
</template>

<script>
export default {
  name: "autoConfirmSetting",
  data: function(router) {
    return {
      response: "",
      settingData: [
        { pay_type: 1, status: 0 }
        // {pay_type: 2, status: 0},
        // {pay_type: 3, status: 0},
        // {pay_type: 4, status: 0},
        // {pay_type: 5, status: 0}
      ]
    };
  },
  created: function() {
    // this.getsettingData()
  },
  methods: {
    getsettingData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "GET",
        "/supplyAutoConfirm/list.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid
        },
        function(data) {
          self.settingData = data.data;
        }
      );
    },
    submitForm(formName) {
      var self = this;
      var store = this.$store;
      let payTypeStatus = JSON.stringify(self.settingData);
      this.$parent.callAPI(
        "POST",
        "/supplyAutoConfirm/save.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          pay_type_status: payTypeStatus
        },
        function(data) {
          self.$message({
            message: "设置成功!",
            type: "success"
          });
          setTimeout(function() {
            location.reload();
          }, 1500);
        }
      );
    }
  }
};
</script>
