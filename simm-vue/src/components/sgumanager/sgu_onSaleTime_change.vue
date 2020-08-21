<template>
  <section class="content-section layer-container onsale-change">
    <P class="text-theme" v-if="data.isCycleOnSale===1">{{modeTip}}</P>
    <div v-if="data.isCycleOnSale == 0">
      <el-form :model="data" ref="data" label-width="80px">
        <el-row>
          <el-form-item label="上架时间" v-if="data.onSale == 0 || data.onSale == 2">
            <el-date-picker
              :editable="false"
              :clearable="false"
              style="width:90%;"
              type="datetime"
              v-model="data.onSaleTime"
              placeholder="请填写上架时间"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="下架时间">
            <el-date-picker
              :editable="false"
              :clearable="false"
              style="width:90%;"
              type="datetime"
              v-model="data.takenOffTime"
              placeholder="请填写下架时间"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="layer-footer" style="text-align:center;">
        <el-button type="primary" @click="saveDialog(1)">确 认</el-button>
        <el-button
          type="primary"
          @click="saveDialog(2)"
          v-if="data.onSale == 0 || data.onSale == 2"
        >立 即 上 架</el-button>
        <el-button
          type="primary"
          @click="saveDialog(3)"
          v-if="data.onSale == 1 || data.onSale == 2"
        >立 即 下 架</el-button>
        <el-button @click="closeWin">取 消</el-button>
      </div>
    </div>
    <div v-else>
      <el-form :model="data" ref="data" label-width="80px">
        <el-form-item label="开始日期" v-if="data.onSale == 0 || data.onSale == 2">
          <el-date-picker
            :editable="false"
            :clearable="false"
            v-model="data.cycleStartDate"
            style="width:90%;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始日期"
            :picker-options="pickerOptions0"
            @change="cycleStartDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            :editable="false"
            :clearable="false"
            v-model="data.cycleEndDate"
            style="width:90%;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束日期"
            :picker-options="pickerOptions0"
            @change="cycleEndDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="售卖时段" v-if="data.onSale == 0 || data.onSale == 2">
          <el-time-picker
            :is-range="true"
            :clearable="true"
            v-model="data.cycleTimeRange"
            style="width:90%;"
            value-format="HH:mm:ss"
            range-separator="  至  "
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            @change="cycleTimeRangeChange"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div class="layer-footer" style="text-align:center;">
        <el-button type="primary" @click="saveDialog(1)">确 认</el-button>
        <el-button
          type="primary"
          @click="saveDialog(3)"
          v-if="data.onSale == 1 || data.onSale == 2"
        >立 即 下 架</el-button>
        <el-button @click="closeWin">取 消</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";

export default {
  name: "SguOnSaleTimeChange",
  data: function() {
    return {
      filter: {},
      callback: null,
      modeTip: "",
      data: {
        id: "",
        onSaleTime: "",
        takenOffTime: "",
        onSale: "",
        isNextDay: "",
        oldTakenOffTime: "",
        isCycleOnSale: "",
        cycleStartDate: "",
        cycleStartTime: "",
        cycleEndDate: "",
        cycleEndTime: "",
        isOnSale: "", //0,下架按钮；1，上架按钮
        sguBaseProd: [],
        onSaleType: "",
        cycleTimeRange: [],
        cycleTakenOffTime: ""
      },
      userInfo: this.$store.state.userInfo,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  created() {
    this.callback = this.$options.propsData.callback;
    this.filter = this.$options.propsData.filter;
    this.data = {
      ...this.data,
      ...this.filter
    };
    //批量操作
    if (this.data.sguBaseProd.length > 0) {
      //下架按钮，弹框只显示立即下架，和下架时间
      if (this.data.isOnSale === 0) {
        this.data.onSale = 1;
      } else {
        this.data.onSale = 0;
      }
    }
    if (!this.data.cycleStartTime && !this.data.cycleEndTime) {
      this.data.cycleStartTime = "00:00:00";
      this.data.cycleEndTime = "23:59:59";
    }
    this.data.cycleTimeRange.push(this.data.cycleStartTime);
    this.data.cycleTimeRange.push(this.data.cycleEndTime);
    this.modeTip = this.data.isCycleOnSale === 1 ? "分时段售卖" : "24小时售卖";
    var extend = this.data.sguBaseProd.length > 0 ? "批量设置操作" : "设置操作";
    this.modeTip = `当前为${this.modeTip}${extend}`;
  },
  methods: {
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
    cycleTimeRangeChange(val) {
      var self = this;
      self.data.cycleTimeRange = val;
      // 判空 与 值改变
      if (!val || self.data.isCycleOnSale !== 1) {
        self.data.cycleStartTime = "00:00:00";
        self.data.cycleEndTime = "23:59:59";
        self.data.cycleTimeRange = [];
        self.data.cycleTimeRange.push(self.data.cycleStartTime);
        self.data.cycleTimeRange.push(self.data.cycleEndTime);
        return;
      }
      self.data.cycleStartTime = val[0];
      self.data.cycleEndTime = val[1];
      if (
        self.data.cycleStartTime &&
        self.data.cycleStartTime &&
        self.data.cycleStartDate
      ) {
        self.calculateTimes();
      }
    },
    cycleStartDateChange(val){
      var self = this;
      self.data.cycleStartDate = val;
      if (self.data.cycleEndDate && self.data.cycleStartDate) {
        self.calculateTimes();
      }
    },
    cycleEndDateChange(val){
      var self = this;
      self.data.cycleEndDate = val;
      if (self.data.cycleEndDate && self.data.cycleStartDate) {
        self.calculateTimes();
      }
    },
    calculateTimes() {
      var self = this;
      var onSaleTime =
        self.data.cycleStartDate + " " + self.data.cycleStartTime;
      var takenOffTime =
        self.data.cycleStartDate + " " + self.data.cycleEndTime;
      var cycleTakenOffTime =
        self.data.cycleEndDate + " " + self.data.cycleEndTime;
      self.data.onSaleTime = moment(onSaleTime).format("YYYY-MM-DD HH:mm:ss");
      self.data.takenOffTime = moment(takenOffTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      self.data.cycleTakenOffTime = moment(cycleTakenOffTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    saveDialog: function(onSaleType) {
      let self = this;
      self.data.onSaleType = onSaleType;
      //验证
      if (self.filter.beforeCallback) {
        self.filter.beforeCallback(self.data);
      }
      if (self.data.sguBaseProd.length > 0) {
        self.data.sguBaseProd.forEach(a => {
          if (a.isCycleOnSale === 1 && self.data.isOnSale===0) {
            a.cycleTakenOffTime = moment(
              self.data.cycleEndDate + " " + a.cycleEndTime
            ).format("YYYY-MM-DD HH:mm:ss");
            a.cycleEndDate = self.data.cycleEndDate;
          } else {
            a.onSaleTime = self.data.onSaleTime;
            a.takenOffTime = self.data.takenOffTime;
            a.cycleTakenOffTime = self.data.cycleTakenOffTime;
            a.cycleStartDate = self.data.cycleStartDate;
            a.cycleStartTime = self.data.cycleStartTime;
            a.cycleEndDate = self.data.cycleEndDate;
            a.cycleEndTime = self.data.cycleEndTime;
          }
          a.onSaleType = onSaleType;
        });
      }
      //回调关闭窗口
      if (self.callback) {
        self.callback(self.data);
      }
      self.closeWin();
    }
  }
};
</script>

<style lang="less">
.onsale-change {
  .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
