import moment from "moment";
var start = moment(new Date()).format("YYYY-MM-DD 00:00:00");
var end = moment(new Date()).format("YYYY-MM-DD 23:59:59");
var upColor = "#00da3c";
var downColor = "#ec0000";
export default {
  name: "summaryHandler",
  data() {
    return {
      formData: {
        dates: [start, end],
        choosedCitys: []
      },
      myChart: {},
      user: this.$store.state.userInfo,
      provinces: [],
      citys: [],
      addressData: [],
      summaryData: { xAxisData: [], series: [] },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      markLine: {
        silent: true,
        data: [
          {
            yAxis: 20
          },
          {
            yAxis: 50
          },
          {
            yAxis: 100
          },
          {
            yAxis: 200
          }
        ]
      }
    };
  },
  mounted() {
    var self = this;
    this.myChart = this.$echarts.init(this.$refs.main);
    this.getAddressData(() => {
      //登录时触发一次查询
      self.search();
    });
  },
  methods: {
    /**
     * 初始化图表
     */
    initChar(summaryData) {
      this.myChart.setOption(
        {
          title: {
            text: "上架监控"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            },
            position: function(pos, params, el, elRect, size) {
              var obj = { top: 5 };
              obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj;
            },
            formatter: function(params) {
              var rows = params
                .filter(p => p.value > 0 && p.seriesName !== "总数")
                .sort((a, b) => b.value - a.value);
              var item = params.find(p => p.seriesName == "总数");
              var list = [];
              if (params.filter(p => p.seriesName !== "总数").length == 1) {
                list.push(`${params[0].name} 数量:${item.value}`);
              } else {
                list.push(`${params[0].name} 总数:${item.value}`);
                //太多的时候只加载15条
                for (
                  var i = 0;
                  i < (rows.length > 20 ? 20 : rows.length);
                  i++
                ) {
                  var p = rows[i];
                  list.push(
                    `<i style="display: inline-block;width: 10px;height: 10px;background:${p.color};margin-right: 5px;border-radius: 50%;}"></i>${p.seriesName}:${p.value}`
                  );
                }
              }
              return list.join("<br/>");
            }
          },
          legend: {
            data: summaryData.legend,
            bottom: "0%"
          },
          visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
              {
                value: 1,
                color: downColor
              },
              {
                value: -1,
                color: upColor
              }
            ]
          },
          xAxis: [
            {
              name: "时段",
              type: "category",
              boundaryGap: false,
              scale: true,
              data: summaryData.xAxisData,
              axisLine: { onZero: false },
              splitLine: { show: false },
              min: "dataMin",
              max: "dataMax",
              axisPointer: {
                z: 100
              }
            },
            {
              name: "时段",
              type: "category",
              gridIndex: 1,
              boundaryGap: false,
              scale: true,
              data: summaryData.xAxisData,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              min: "dataMin",
              max: "dataMax"
            }
          ],
          yAxis: [
            {
              name: "新增SGU数(个)",
              minInterval: 1,
              scale: true,
              splitArea: {
                show: true
              }
            },
            {
              scale: true,
              gridIndex: 1,
              minInterval: 1,
              axisLabel: { show: true },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false }
            }
          ],
          axisPointer: {
            link: { xAxisIndex: "all" },
            label: {
              backgroundColor: "#777"
            }
          },
          brush: {
            xAxisIndex: "all",
            brushLink: "all",
            outOfBrush: {
              colorAlpha: 0.1
            }
          },
          grid: [
            // {
            //   bottom: "120px",
            //   containLabel: true
            // },
            {
              left: "10%",
              right: "8%",
              height: "40%"
            },
            {
              left: "10%",
              right: "8%",
              top: "60%",
              height: "16%"
            }
          ],
          toolbox: {
            left: "center",
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              type: "inside",
              xAxisIndex: [0, 1],
              startValue: summaryData.startValue
            },
            // {
            //   type: "inside"
            // }
            {
              show: true,
              xAxisIndex: [0, 1],
              type: "slider",
              top: "78%"
            }
          ],
          series: summaryData.series
        },
        true
      );
    },
    /**
     * 查找数据
     */
    search() {
      var self = this;
      //获取城市列表
      var citys = [];
      this.formData.choosedCitys.forEach(a => {
        citys.push(a[a.length - 1]);
      });
      if (this.user.userType === 3) {
        //直购人员默认直接查直购的数据y
        citys = [1];
      }
      if (citys.length == 0) {
        this.$commonUtil.valid.throwEx("请选择要查询的城市");
      }
      var filter = {
        beginDate: this.formData.dates[0],
        endDate: this.formData.dates[1],
        citys: citys
      };
      this.$httpUtil.post({
        url: "/summary/getSguSummaryData.json",
        data: filter,
        contentType: "form",
        succ: function(data) {
          //进行数据转换
          self.wrapLineChartData(data.data);
        }
      });
    },
    /**
     * 组装图表数据
     * @param {*} list
     */
    wrapLineChartData(list) {
      var self = this;
      //x轴
      var xAxisData = [...new Set(list.map(a => a.onSaleTime))].sort((a, b) => {
        return a.localeCompare(b);
      });
      var cities = [...new Set(list.map(a => a.admin_shop_id))];
      var series = [];
      cities.forEach(c => {
        var cSeries = {};
        cSeries.name = (self.citys.find(a => a.value === c) || {}).label;
        cSeries.type = "line";
        cSeries.smooth = true;
        //cSeries.markLine = self.markLine;
        cSeries.data = [];
        var cData = list.filter(a => a.admin_shop_id === c) || [];
        xAxisData.forEach(x => {
          var dateD = cData.find(a => a.onSaleTime === x);
          cSeries.data.push(dateD ? dateD.onSaleCount : 0);
        });
        series.push(cSeries);
      });
      self.summaryData.xAxisData = xAxisData;
      self.calcSummaryData(series);
      self.summaryData.series = series;
      self.summaryData.legend = [...new Set(series.map(a => a.name))];
      self.summaryData.startValue = "";
      if (xAxisData.length >= 14) {
        self.summaryData.startValue = xAxisData[xAxisData.length - 14];
      } else if (xAxisData.length > 0) {
        self.summaryData.startValue = xAxisData[0];
      }
      self.initChar(self.summaryData);
    },
    /**
     * 计算汇总数据
     */
    calcSummaryData(series) {
      var len = (this.summaryData.xAxisData || []).length;
      if ((this.summaryData.xAxisData || []).length == 0) {
        series.push({
          name: "总数",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: []
        });
        return;
      }
      var summaryList = [];
      for (var i = 0; i < len; i++) {
        var summaryItem = 0;
        series.forEach(s => {
          if (s.data.length > i) {
            summaryItem += s.data[i];
          }
        });
        summaryList.push(summaryItem);
      }
      series.push({
        name: "总数",
        type: "bar",
        barMaxWidth: "20px",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: summaryList
      });
    },
    /**
     * 获取地址
     * @param {*} callback
     */
    getAddressData(callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/summary/getAddressData.json",
        succ: function(data) {
          self.wrapAddress(data.data);
          if (callback) {
            callback();
          }
        }
      });
    },
    /**
     * 地址组装
     * @param {*} data
     */
    wrapAddress(data) {
      var self = this;
      if (this.user.userType === 3) {
        //直购人员，是不允许地址过滤的
        return;
      }
      self.citys = (data.citys || []).map(c => {
        return {
          value: c.admin_shop_id,
          label: c.level_name,
          isAgent: c.is_agent,
          parentId: c.supply_site_id,
          type: 2
        };
      });
      self.provinces = (data.provinces || []).map(p => {
        return {
          value: p.id,
          label: p.site_name,
          type: 1,
          parentId: -999,
          children: self.citys.filter(c => c.parentId == p.id)
        };
      });
      self.provinces = self.provinces.filter(p => p.children.length > 0);
      self.addressData = [];
      if (this.user.userType === 2) {
        //城市只用显示一条数据
        self.addressData = self.citys;
        self.formData.choosedCitys = self.citys.map(c => [c.value]);
      } else if (this.user.userType === 1) {
        //省级显示全省的数据
        self.addressData = self.provinces;
        self.provinces.forEach(p => {
          p.children.forEach(c => {
            self.formData.choosedCitys.push([p.value, c.value]);
          });
        });
      } else {
        self.addressData = [
          {
            value: -999,
            label: "全国",
            type: 0,
            children: self.provinces
          }
        ];
        //不显示代理城市的数据
        self.provinces.forEach(p => {
          p.children
            .filter(c => c.isAgent != 1)
            .forEach(c => {
              self.formData.choosedCitys.push([-999, p.value, c.value]);
            });
        });
      }
    }
  }
};
