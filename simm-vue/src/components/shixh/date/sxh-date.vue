<template>
  <el-date-picker
    v-if="controlType == 'daterange' || controlType == 'datetimerange'"
    v-model="bindValue"
    :type="controlType"
    :disabled="disabled"
    :picker-options="pickerOptions"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :clearable="clearable"
    @change="changeVal"
  ></el-date-picker>
</template>
<script>
import moment from "moment";
let controlConfig = {
  daterange: {
    format: "YYYY-MM-DD"
  },
  datetimerange: {
    format: "YYYY-MM-DD HH:mm:ss"
  }
};
export default {
  name: "sxh-date",
  props: {
    clearable: {
      type: Boolean,
      default: true,
      required: false
    },
    controlType: {
      type: String,
      default: "datetimerange",
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {};
      },
      required: false
    },
    value: Array
  },
  model: {
    prop: "value",
    event: "valChange"
  },
  watch: {
    value(newVal, oldVal) {
      if ((newVal || []).some(a => a != null)) {
        this.bindValue = newVal;
      }
    },
    deep: true
  },
  data() {
    return {
      bindValue: this.value
    };
  },
  methods: {
    changeVal(val) {
      //v-model数据通知
      var result = [];
      var format = (date, index) => {
        if (date == null || date == "") {
          return null;
        } else {
          return this.formatDate(date, index);
        }
      };
      if (!val) {
        result.push(null);
        result.push(null);
      } else {
        result.push(format(this.bindValue[0], 0));
        result.push(format(this.bindValue[1], 1));
      }
      if (
        (result[0] || "").includes("Invalid") ||
        (result[1] || "").includes("Invalid")
      ) {
        this.$commonUtil.valid.throwEx("非法的日期格式，请重新选择日期");
      }
      this.$emit("change", result);
      this.$emit("valChange", result);
    },
    /**
     * 格式化日期
     */
    formatDate(date, index) {
      var format = controlConfig[this.controlType].format;
      if (this.controlType == "daterange") {
        if (index === 0) {
          format += " 00:00:00";
        } else if (index === 1) {
          format += " 23:59:59";
        }
      }
      return moment(date).format(format);
    }
  }
};
</script>
