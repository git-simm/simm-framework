<template>
  <el-cascader
    ref="bankCascader"
    v-model="bindValue"
    filterable
    :key="cascKey"
    :before-filter="beforeSearchBank"
    :options="provinceList"
    @expand-change="handleItemChange"
    @change="change"
    :show-all-levels="true"
    :props="cascaderProps"
    :title="(subBank||{}).label"
    clearable
  ></el-cascader>
</template>

<script>
export default {
  name: "sxh-bank",
  props: {
    bankCode: String,
    value: {
      type: Array,
      required: true
    }
  },
  model: {
    prop: "value",
    event: "valChange"
  },
  data() {
    return {
      cascaderProps: {
        value: "code",
        children: "children"
      },
      bindValue: this.value,
      provinceList: [],
      cityList: [],
      subBankList: [],
      province: {},
      city: {},
      subBank: {},
      cascKey:""
    };
  },
  watch: {
    value: {
      handler: function(newVal, oldVal) {
        if ((newVal || []).length > 0 && this.city == null) {
          //说明数据刚加载过来，但是控件并没有联动计算出城市、分行,需要重新运算
          var self = this;
          this.initData(() => {
            self.bindValue = newVal;
          });
        } else {
          this.bindValue = newVal;
        }
      },
      deep: true
    },
    /**
     * 监听银行是否发生改变
     */
    bankCode(newVal, oldVal) {
      if(oldVal>""){
        this.bindValue = [];
      }
      this.initData();
      // 绑定Key值 触发重新渲染 解决js报错问题
      this.cascKey = Math.random();
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData(callback) {
      var self = this;
      if (self.city) {
        self.city.children = [];
      }
      self.subBank = {};
      this.getAllCity(cities => {
        self.getProvinceList(cities, list => {
          if ((self.value || []).length > 0) {
            //获取城市数据
            self.province = self.provinceList.find(
              a => a.code == self.value[0]
            );
            if (!self.province) return;
            self.getCityList(self.province, province => {
              //获取支行信息
              self.city = province.children.find(a => a.code == self.value[1]);
              if (!self.city) return;
              self.getSubBankList(self.city, city => {
                self.subBank = city.children.find(a => a.code == self.value[2]);
                if (callback) {
                  callback();
                }
              });
            });
          } else if (self.city && self.city.cityCode) {
            self.getSubBankList(self.city, city => {
              //从新数据中获取当前 省市信息
              var tempCity = self.cityList.find(a => a.code == city.cityCode);
              if(tempCity){
                tempCity.children = city.children;
                self.city = tempCity;
                self.province = tempCity.province;
                if (callback) {
                  callback();
                }
              }
            });
          } else if (callback) {
            callback();
          }
        });
      });
    },
    /**
     * 选中项发生改变
     */
    handleItemChange(val) {
      if (val.length == 1) {
        //省级切换
        this.province = this.provinceList.find(a => a.code == val[0]);
        this.getCityList(this.province);
      } else if (val.length == 2) {
        this.city = this.cityList.find(a => a.code == val[1]);
        this.getSubBankList(this.city);
      }
    },
    change(newVal) {
      this.$emit("valChange", newVal);
      if ((newVal || []).length === 0) {
        //清空
        this.subBank = null;
        this.$emit("bankChange", null);
      } else {
        this.subBank = this.subBankList.find(a => a.subBankCode == newVal[2]);
        this.province = this.subBank.province;
        this.city = this.subBank.city;
        this.$emit("bankChange", {
          province: this.province,
          city: this.city,
          subBank: this.subBank
        });
      }
    },
    /**
     * 获取省级信息
     */
    getProvinceList(cities, callback) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getProvinceList.json",
        data: {},
        succ: function(data) {
          self.provinceList = data.data;
          self.provinceList.forEach(a => {
            a.label = a.name;
            a.type = 1;
            a.parentId = null;
            var children = cities.filter(c => c.provinceCode == a.code) || [];
            children.forEach(c => {
              c.label = c.cityName;
              c.type = 2;
              c.code = c.cityCode;
              c.parentId = a.code;
              c.province = a;
              self.$set(c, "children", []);
            });
            self.$set(a, "children", children);
          });
          if (callback) {
            callback(self.provinceList);
          }
        }
      });
    },
    /**
     * 获取所有的银行对应的城市信息
     */
    getAllCity(callback) {
      if (!this.bankCode) {
        return;
      }
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getCityList.json",
        data: {
          bankCode: this.bankCode
        },
        succ: function(data) {
          self.cityList = data.data || [];
          if (callback) {
            callback(self.cityList);
          }
        }
      });
    },
    /**
     * 获取城市信息(补偿方法,安全性拦截)
     */
    getCityList(province, callback) {
      if (!this.bankCode) {
        this.$commonUtil.valid.throwEx("请先选择开户行");
      }
      var self = this;
      if ((province.children || []).length > 0) {
        if (callback) {
          callback(province);
        }
        return;
      }
      this.$httpUtil.post({
        url: "/supplyInfo/getCityList.json",
        data: {
          provinceCode: province.code,
          bankCode: this.bankCode
        },
        succ: function(data) {
          //var temp = self.provinceList.find(a => a.code == province.code);
          data.data.forEach(a => {
            a.label = a.cityName;
            a.type = 2;
            a.code = a.cityCode;
            a.parentId = province.code;
            a.province = province;
            self.$set(a, "children", []);
          });
          self.$set(province, "children", data.data);
          if (callback) {
            callback(province);
          }
        }
      });
    },
    /**
     * 获取支行信息
     */
    getSubBankList(city, callback) {
      if (!this.bankCode) {
        this.$commonUtil.valid.throwEx("请先选择开户行");
      }
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getSubBankList.json",
        data: {
          bankCode: this.bankCode,
          cityCode: city.cityCode
        },
        succ: function(data) {
          self.province.children.forEach(a => {
            //城市支行清空
            self.$set(a, "children", []);
          });
          self.subBankList = data.data;
          self.subBankList.forEach(a => {
            a.label = a.subBankName;
            a.type = 3;
            a.code = a.subBankCode;
            a.parentId = city.cityCode;
            a.province = city.province;
            a.city = city;
          });
          self.$set(city, "children", self.subBankList);
          if (callback) {
            callback(city);
          }
        }
      });
    },
    /**
     * 搜索前校验
     */
    beforeSearchBank(keyword) {
      var key = (keyword || "").trim();
      if (key == "") {
        return false;
      }
      //界面上已经加载并且可以精确匹配，则直接显示
      if (this.subBankList.some(bank => bank.label == key)) {
        return true;
      }
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/getSubBankListBySubName.json",
        data: {
          bankCode: this.bankCode,
          subBankName: key
        },
        succ: function(data) {
          if ((data.data || []).length === 0) return;
          //组装数据
          self.subBankList = [];
          data.data.forEach(a => {
            var city = self.cityList.find(c => c.code == a.cityCode);
            if (city) {
              a.type = 3;
              a.label = a.subBankName;
              a.code = a.subBankCode;
              a.parentId = city.cityCode;
              a.province = city.province;
              a.city = city;
              self.subBankList.push(a);
              if (!(city.children || []).some(c => c.code == a.subBankCode)) {
                city.children.push(a);
              }
            }
          });
          //异步加载完成，主动触发查找
          self.$nextTick(() => self.$refs.bankCascader.getSuggestions());
        }
      });
      return false;
    }
  }
};
</script>
