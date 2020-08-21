<template>
<div ref="prodAnalysisChart" :style="`height: ${height}px`"></div>
</template>

<script>
export default {
    name: "prod-analysis-chart",
    props: {
        // 业务编码
        businessCode: {
            type: String,
            required: true,
            default: "",
        },
        // 高度
        height: {
            type: Number,
            required: false,
            default: 390,
        },
        dataSource: {
            data: [],
            records: {},
        },
        prodId: {
            type: Number,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            myChart: {},
            chartOptions: {
                title: {
                    text: "",
                },
                xAxis: {
                    name: "日期",
                    data: [],
                },
                yAxis: {
                    name: this.businessCode == "prod" ? "采购价(元)" : "销售价(元)",
                },
                series: {
                    data: [],
                },
            },
        };
    },
    computed: {
        title() {
            if (this.businessCode === "sgu") {
                return "销售价趋势分析";
            } else if (this.businessCode === "prod") {
                return "采购价趋势分析";
            }
        },
    },
    methods: {
        init(data) {
            this.initMychart(data, this.businessCode);
        },
        initMychart(listData, businessCode) {
            var self = this;
            self.getAnalysisData(listData, businessCode, () => {
                self.mychart = this.$echarts.init(this.$refs.prodAnalysisChart);
                self.mychart.setOption({
                        visualMap: {
                            show: false,
                            type: "continuous",
                            seriesIndex: 0,
                            min: 0,
                            max: 400,
                        },
                        title: {
                            left: "center",
                            text: self.chartOptions.title.text,
                        },
                        tooltip: {
                            trigger: "axis",
                        },
                        xAxis: {
                            name: self.chartOptions.xAxis.name,
                            data: self.chartOptions.xAxis.data,
                            axisLabel: {
                                rotate: 20
                            },
                        },
                        yAxis: {
                            name: self.chartOptions.yAxis.name,
                            minInterval: 1,
                            splitLine: {
                                show: false
                            },
                        },
                        grid: {
                            bottom: "30%",
                        },
                        series: {
                            type: "line",
                            showSymbol: false,
                            data: self.chartOptions.series.data,
                            itemStyle: {
                                emphasis: {
                                    // 普通图表的高亮颜色
                                    color: "#fe3b91",
                                },
                                normal: {
                                    color: '#fe3b91',
                                    areaStyle: {
                                        type: 'default',
                                        color: '#fbeef4'
                                    },
                                    lineStyle: {
                                        color: '#fe3b91'
                                    }
                                }
                            },
                        },
                    },
                    true
                );
                window.addEventListener("resize", () => {
                    self.mychart.resize();
                });
            });
        },
        getAnalysisData(listData, businessCode, callBack) {
            var self = this;
            if (listData) {
                var list = [];
                if (businessCode === "sgu") {
                    // 上架流水
                    (listData || []).map((item) => {
                        if (!list.find(o => o.x == item.onSaleTime)) {
                            list.push({
                                x: item.onSaleTime,
                                d: item.salePrice
                            });
                        }
                    });
                } else if (businessCode === "prod") {
                    //采购流水
                    (listData || []).map((item) => {
                        if (!list.find(o => o.x == item.createAt)) {
                            list.push({
                                x: item.createAt,
                                d: item.prodPrice
                            });
                        }
                    });
                }
                // 日期正序
                list.sort((prev, curr) => {
                    if (prev.x > curr.x) {
                        return 1;
                    } else if (prev.x === curr.x) {
                        return 0;
                    } else if (prev.x < curr.x) {
                        return -1;
                    }
                });
                // 初始化曲线数据
                self.chartOptions.series.data = list.map(item => item.d);
                // 初始化X轴数据
                self.chartOptions.xAxis.data = list.map(item => item.x);
                // 初始化图表标题
                self.chartOptions.title.text = self.title;
                if (callBack) {
                    callBack();
                }
            }
        },
    },
};
</script>

<style scoped>
</style>
