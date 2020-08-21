<template>
  <section class="content-section business-analysis layer-container" style="width:100%">
    <el-form :inline="true" :model="formData" @keyup.enter.native="search" class="demo-form-inline">
      <el-form-item label>
        <el-date-picker
          v-model="formData.date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row style="font-size:18px;">
      <el-col :span="6">
        <el-card shadow="hover">
          <span>正在上架：</span>
          <span>
            <b>{{sguData.nowOnSale}}</b>
          </span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <span>待上架：</span>
          <span>
            <b>{{sguData.nowReSale}}</b>
          </span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <span>今日上架：</span>
          <span>
            <b>{{sguData.todayOnSale}}</b>
          </span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <span>今日下架：</span>
          <span>
            <b>{{sguData.todayOffSale}}</b>
          </span>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row style="margin-top:10px;">
      <el-col :span="24">
        <sxh-sgu-chart
          ref="on_sale_info_day_hour"
          business-code="on_sale_info_day_hour"
          :height="350"
        ></sxh-sgu-chart>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: "sgu-data-chart",
  data() {
    return {
      formData: {
        date: new Date()
      },
      sguData: {
        nowOnSale: 0,
        nowReSale: 0,
        todayOnSale: 0,
        todayOffSale: 0
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const today = new Date();
              picker.$emit("pick", today);
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.search(this.formData.date);
  },
  methods: {
    /**
     * 查找数据
     */
    search() {
      this.$refs.on_sale_info_day_hour.initMychart(
        "on_sale_info_day_hour",
        this.formData.date
      );
      this.getSguInfo(this.formData.date);
    },
    getSguInfo(date) {
      var self = this;
      this.$httpUtil.post({
        url: "/summary/getSguSaleInfo.json",
        data: {
          date: date
        },
        contentType: "form",
        succ: function(data) {
          self.sguData.nowOnSale = data.data.nowOnSale.data[0].number;
          self.sguData.nowReSale = data.data.nowReSale.data[0].number;
          self.sguData.todayOnSale = data.data.todayOnSale.data[0].number;
          self.sguData.todayOffSale = data.data.todayOffSale.data[0].number;
        }
      });
    }
  }
};
</script>

<style lang="less">
.business-analysis {
  .el-card__body {
    padding: 10px 20px !important;
  }
}
</style>
