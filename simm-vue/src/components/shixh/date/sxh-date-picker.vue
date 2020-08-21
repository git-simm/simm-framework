<template>
  <el-date-picker
    v-if="controlType == 'date' || controlType == 'datetime'"
    v-model="bindValue"
    :type="controlType"
    align="right"
    placeholder="请选择日期"
    format="yyyy年MM月dd日"
    :picker-options="pickerOptions"
    @change="changeValue"
  ></el-date-picker>
</template>

<script>
import moment from "moment";

let controlConfig = {
  date: {
    format: "YYYY-MM-DD 00:00:00"
  },
  datetime: {
    format: "YYYY-MM-DD HH:mm:ss"
  }
};
export default {
  name: "sxh-date-picker",
  props: {
    controlType: {
      type: String,
      default: "date",
      required: false
    },
    disabledDateConf: {
      type: String,
      default: "before",
      required: false
    },
    value: ""
  },
  model: {
    prop: "value",
    event: "valChange"
  },
  watch: {
    value(newVal, oldVal) {
      this.bindValue = newVal;
    },
    deep: true
  },
  data() {
    return {
      // 日期控件
      pickerOptions: {
        // disabledDate(time) {
        //         return time.getTime() < Date.now();
        // },
        shortcuts: [
          {
            text: "长期有效",
            onClick(picker) {
              const date = new Date();
              date.setTime(Date.parse("2199-12-31"));
              picker.$emit("pick", date);
            }
          }
        ]
      },
      bindValue: this.value
    };
  },
  methods: {
    changeValue(val) {
      //v-model数据通知
      this.$emit("valChange", val);
      var format = date => {
        return date == null || date == "" ? null : this.formatDate(date);
      };
      var formattedVal = format(val);
      if ((formattedVal || "").includes("Invalid")) {
        this.$commonUtil.valid.throwEx("非法的日期格式，请重新选择日期");
      }
      this.$emit("change", formattedVal);
    },
    /**
     * 格式化日期
     */
    formatDate(date) {
      var format = controlConfig[this.controlType].format;
      return moment(date).format(format);
    }
  }
};
</script>