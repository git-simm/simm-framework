<template>
  <div ref="sguEchart" :style="`height: ${height}px`"></div>
</template>

<script>
export default {
  name: "sxh-sgu-chart",
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
      default: 360
    }
  },
  data() {
    return {
      myChart: {},
      myData:[],
      chartOptions: {
        title: {
          text: "",
          subtext: ""
        },
        xAxis: {
          name: "时间",
          data: []
        },
        yAxis: {
          name: "上架数量"
        },
        series: {
          data0: [],
          data1: []
        }
      }
    };
  },
  methods: {
    initMychart(businessCode, date) {
      var self = this;
      self.getAnalysisData(businessCode, date, () => {
        self.mychart = self.$echarts.init(self.$refs.sguEchart);
        self.mychart.setOption(
          {
            visualMap: {
              show: false,
              type: "continuous",
              seriesIndex: 0,
              min: 0,
              max: 400
            },
            // title: {
            //   left: "center",
            //   subtext: self.chartOptions.title.subtext,
            //   text: self.chartOptions.title.text
            // },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                animation: false
              }
            },
            axisPointer: {
              link: { xAxisIndex: "all" }
            },
            legend: {
              data: ["SGU上架数量", "SGU下架数量"],
              left: 10
            },
            xAxis: [
              {
                type: "category",
                name: "时段",
                boundaryGap: false,
                axisLine: { onZero: true },
                data: self.chartOptions.xAxis.data0
              },
              {
                gridIndex: 1,
                type: "category",
                boundaryGap: false,
                axisLine: { onZero: true },
                data: self.chartOptions.xAxis.data1,
                position: "top"
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "SGU上架数量"
              },
              {
                gridIndex: 1,
                name: "SGU下架数量",
                type: "value",
                inverse: true
              }
            ],
            grid: [
              {
                left: 50,
                right: 50,
                height: "35%"
              },
              {
                left: 50,
                right: 50,
                top: "60%",
                height: "32%"
              }
            ],
            series: [
              {
                name: "上架数量",
                type: "line",
                symbolSize: 8,
                hoverAnimation: false,
                data: self.chartOptions.series.data0
              },
              {
                name: "下架数量",
                type: "line",
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: 8,
                hoverAnimation: false,
                data: self.chartOptions.series.data1
              }
            ],
            toolbox: {
              feature: {
                dataZoom: {
                  yAxisIndex: "none"
                },
                restore: {},
                saveAsImage: {}
              }
            }
          },
          true
        );
        window.addEventListener("resize", () => {
          self.mychart.resize();
        });
      });
    },
    getAnalysisData(businessCode, date, callBack) {
      if (date == null || date == "") {
        date = null;
      }
      var self = this;
      this.$httpUtil.post({
        url: "/summary/querySguSaleInfoData.json",
        data: {
          businessCode: businessCode,
          date: date
        },
        contentType: "form", //json,form,multipart
        succ: function(data) {
          if (data.data) {
            var onSaleData = (data.data.data0 || []).map(
                item => {
                  return item.date;
                }
            );
            var offSaleData = (data.data.data1 || []).map(
                item => {
                  return item.date;
                }
            );
            var sguData = Array.from(new Set(onSaleData.concat(offSaleData))).sort((a, b) => a-b);
            var chartData=[] ;
            // 初始化曲线数据
            for (var i = 0; i < sguData.length; i++) {
              chartData.push({date: sguData[i], onSaleNumber: 0, offSaleNumber: 0});
            }
            for (var i = 0; i < chartData.length; i++) {
              for (var j = 0; j < data.data.data0.length; j++) {
                if (chartData[i].date === data.data.data0[j].date) {
                  chartData[i].onSaleNumber = data.data.data0[j].number;
                  break;
                }
              }
              for (var f = 0; f < data.data.data1.length; f++) {
                if (chartData[i].date === data.data.data1[f].date) {
                  chartData[i].offSaleNumber = data.data.data1[f].number;
                  break;
                }
              }
            }
            self.chartOptions.xAxis.data0 = (sguData || []).map(
                item => {
                  return item;
                }
            );
            self.chartOptions.xAxis.data1 = (sguData || []).map(
                item => {
                  return item;
                }
            );
            // 初始化x轴数据
            self.chartOptions.series.data0 =(chartData|| []).map(
                item => {
                  return item.onSaleNumber;
                }
            );
            self.chartOptions.series.data1 =(chartData || []).map(
                item => {
                  return item.offSaleNumber;
                }
            );
            // 初始化图表标题
            self.chartOptions.title.text =
              self.$cacheUtil.getVal(
                "business_model_enum",
                self.businessCode,
                ""
              ) + "统计";

            var name = self.$cacheUtil.getVal(
              "business_model_enum",
              self.businessCode,
              ""
            );
            self.chartOptions.title.text = `${name}总计 ${data.data.total0}  `;
            self.chartOptions.title.textStyle = {
              rich: {
                red: { color: "red" }
              }
            };
            if (callBack) {
              callBack();
            }
          } else {
            self.chartOptions.series = null;
            self.chartOptions.xAxis = null;
            self.chartOptions.yAxis = null;
          }
        }
      });
    }
  }
};
</script>
