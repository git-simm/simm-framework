<template>
  <section class="content-section" style="position:relative;">
    <!-- 查询条件 -->
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="时间段">
        <sxh-date
          v-model="formData.dates"
          control-type="daterange"
          :clearable="false"
          :picker-options="pickerOptions"
        ></sxh-date>
      </el-form-item>
      <el-form-item label="区域" v-if="user.userType !== 3">
        <el-cascader
          :options="addressData"
          :props="{ multiple: true}"
          :show-all-levels="false"
          collapse-tags
          clearable
          filterable
          v-model="formData.choosedCitys"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div ref="main" style="height:500px;"></div>
    <!-- 帮助文档 -->
    <el-header style="position:absolute;top:10px;right:0;">
      <a href="https://sxhimg.shixiangyiwei.com/upload/download/help.doc">帮助文档</a>&nbsp;|&nbsp;
      <el-popover
        placement="top-start"
        title
        width="200"
        trigger="hover"
        :content="`账号类型: ${account}`"
      >
        <a
          slot="reference"
          href="javascript:;"
          class="dropdown-toggle messages-trigger"
        >{{ $store.state.user }}</a>
      </el-popover>
    </el-header>
  </section>
</template>
<script>
import summaryHandler from "./summary-handler";
export default {
  name: "Index",
  mixins: [summaryHandler],
  computed: {
    account: function() {
      var user = this.user;
      var type = this.$cacheUtil.getVal("user_role_type", user.roleType, "");
      if (user.cityName > "") {
        return `${type} (${user.provinceName}-${user.cityName})`;
      } else if (this.user.provinceName > "") {
        return `${type} (${user.provinceName})`;
      }
      return type;
    }
  },
  methods: {}
};
</script>
<style scoped>
</style>