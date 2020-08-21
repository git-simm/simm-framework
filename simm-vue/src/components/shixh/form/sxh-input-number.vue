<template>
  <div
    :class="['sxh-input-number el-input',inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'el-input--prefix': $slots.prefix || prefixIcon,
      'el-input--suffix': $slots.suffix || suffixIcon 
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- 后置元素 -->
    <div
      :class="['el-input-group__prepend',inputSize ? 'el-input-group__prepend--' + inputSize : '']"
      v-if="$slots.prepend"
    >
      <slot name="prepend"></slot>
    </div>
    <el-input-number
      :precision="precision"
      :step="step"
      :stepStrictly="stepStrictly"
      :min="min"
      :max="max"
      :controls="controls"
      v-model="currentValue"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    ></el-input-number>
    <!-- 前置内容 -->
    <span
      :class="['el-input__prefix',inputSize ? 'el-input__prefix--' + inputSize : '']"
      v-if="$slots.prefix || prefixIcon"
    >
      <slot name="prefix"></slot>
      <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
    </span>
    <!-- 后置元素 -->
    <div
      :class="['el-input-group__append',inputSize ? 'el-input-group__append--' + inputSize : '']"
      v-if="$slots.append"
    >
      <slot name="append"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "sxhInputNumber",
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: String,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ""
    },
    name: String,
    label: String,
    placeholder: String,
    suffixIcon: String,
    prefixIcon: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      }
    }
  },
  data() {
    return {
      hovering: false,
      currentValue: this.value
    };
  },
  model: {
    prop: "value",
    event: "input"
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal;
    }
  },
  computed: {
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit;
    }
  },
  methods: {
    handleBlur(event) {
      this.$emit("blur", event);
    },
    handleFocus(event) {
      this.$emit("focus", event);
    },
    handleInput(val) {
      this.$emit("input", val);
    },
    handleChange(val) {
      this.$emit("change", val);
    }
  }
};
</script>
<style lang="less">
.sxh-input-number {
  .el-input-number {
    width: 100% !important;
    .el-input__inner {
      text-align: left !important;
    }
  }
  .el-input-group__append--small,
  .el-input-group__prepend--small {
    background-color: transparent;
    border: none;
    padding: 0 3px;
  }
}
</style>