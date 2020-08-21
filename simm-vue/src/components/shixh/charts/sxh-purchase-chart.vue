<template>
  <div ref="puchaseEchart" :style="`height: ${height}px`"></div>
</template>

<script>
export default {
  name: "sxh-purchase-chart",
  props: {
    // 业务编码
    businessCode: {
      type: String,
      required: true,
      default: ""
    },
    // 高度
    height: {
      type: Number,
      required: false,
      default: 390
    }
  },
  data() {
    return {
      myChart: {},
      chartOptions: {
        title: {
          text: "",
          subtext: ""
        },
        xAxis: {
          name: "日期",
          data: []
        },
        yAxis: {
          name: "近期增量"
        },
        series: {
          data: []
        }
      }
    };
  },
  mounted() {
    this.initMychart(this.businessCode);
  },
  methods: {
    initMychart(businessCode) {
      var self = this;
      self.getAnalysisData(businessCode, () => {
        self.mychart = this.$echarts.init(this.$refs.puchaseEchart);
        self.mychart.setOption(
          {
            visualMap: {
              show: false,
              type: "continuous",
              seriesIndex: 0,
              min: 0,
              max: 400
            },
            title: {
              left: "center",
              subtext: self.chartOptions.title.subtext,
              text: self.chartOptions.title.text
            },
            tooltip: {
              trigger: "axis"
            },
            xAxis: {
              name: self.chartOptions.xAxis.name,
              data: self.chartOptions.xAxis.data,
              axisLabel: { rotate: 20 }
            },
            yAxis: {
              name: self.chartOptions.yAxis.name,
              minInterval: 1,
              splitLine: { show: false }
            },
            grid: {
              bottom: "18%"
            },
            series: {
              type: "line",
              showSymbol: false,
              data: self.chartOptions.series.data
            }
          },
          true
        );
        window.addEventListener("resize", () => {
          self.mychart.resize();
        });
      });
    },
    getAnalysisData(businessCode, callBack) {
      var self = this;
      this.$httpUtil.post({
        url: "/summary/queryAnalysisData.json",
        data: {
          businessCode: businessCode,
          beginDate: null,
          endDate: null
        },
        contentType: "form", //json,form,multipart
        succ: function(data) {
          if (data.data) {
            // 初始化曲线数据
            self.chartOptions.series.data = (data.data.analysisData || []).map(
              item => {
                return item.increment;
              }
            );
            // 初始化X轴数据
            self.chartOptions.xAxis.data = (data.data.analysisData || []).map(
              item => {
                return item.create_date;
              }
            );
            // 初始化图表标题
            self.chartOptions.title.text =
              self.$cacheUtil.getVal(
                "business_model_enum",
                self.businessCode,
                ""
              ) + "统计";

            var weekIncrement = 0;
            (self.chartOptions.series.data || []).forEach(el => {
              weekIncrement += Number(el);
            });
            // 初始化图标 副标题
            // self.chartOptions.title.subtext ="";
            var name = self.$cacheUtil.getVal(
              "business_model_enum",
              self.businessCode,
              ""
            );
            self.chartOptions.title.text = `${name}总计 ${data.data.total}  ,最近一月增量 ${data.data.monthIncrement}  ,最近一周增量 ${weekIncrement}`;
            self.chartOptions.title.textStyle = {
              rich: {
                red: { color: "red" }
              }
            };
            if (callBack) {
              callBack();
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
</style>