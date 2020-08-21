<template>
  <el-cascader
    :options="addressData"
    :props="{ checkStrictly: checkStrictly }"
    v-model="cityList"
    placeholder="请选择省市"
    filterable
    clearable
    @change="change"
  ></el-cascader>
</template>
<script>
import baseMixin from "@/common/mixins/baseMixin";

export default {
  name: "sxhCity",
  mixins: [baseMixin],
  props: {
    value: {
      required: false,
      default() {
        return [];
      }
    },
    selectFirst:{
      type:Boolean,
      default:false
    },
    checkStrictly: {
      type: Boolean,
      required: false,
      default: true //默认可以取任意层级
    }
  },
  data() {
    return {
      user: this.$store.state.userInfo,
      cityList: this.value,
      addressData: [],
      citys: [],
      provinces: []
    };
  },
  model: {
    prop: "value",
    event: "valChange"
  },
  watch: {
    value(newVal) {
      this.cityList = newVal;
    }
  },
  created() {
    this.getAddressAuthData(this.wrapAddress);
  },
  methods: {
    /**
     * 地址组装
     * @param {*} data
     */
    wrapAddress(data) {
      var self = this;
      if (this.user.userType === 3) {
        //直购人员，不需要城市过滤
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
      self.addressData = self.provinces;
      if(self.selectFirst){
        if((self.provinces).length>0 && (self.provinces[0].children||[]).length>0){
          self.cityList = [self.provinces[0].value,self.provinces[0].children[0].value];
          var data = self.change(self.cityList);
          self.$emit("first-selected",data);
        }
      }
    },
    /**
     * 选项改变
     */
    change(val) {
      this.$emit("valChange", val);
      var data = {};
      data.cityList = val;
      data.provinceId = "";
      data.cityId = "";
      if (val == null) {
        return;
      }
      if (val.length >= 2) {
        data.cityId = val[1];
      }
      if (val.length >= 1) {
        data.provinceId = val[0];
      }
      this.$emit("change", data);
      return data;
    }
  }
};
</script>
