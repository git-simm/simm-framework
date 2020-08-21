<template>
  <section class="content-section">
    <sxh-table :dataSource="dataSource" ref="multipleTable" :config="config" :max-height="600">
      <el-table-column prop="user_admin_name" label="操作人" width="150"></el-table-column>
      <el-table-column prop="create_at" label="操作时间" width="180"></el-table-column>
      <el-table-column prop="opt_content" label="操作说明"></el-table-column>
    </sxh-table>
  </section>
</template>
<script>
import moment from "moment";
export default {
  data: function() {
    return {
      dataSource: { data: [] },
      config: {
        getListData: null,
        pagable: false,
        page: 1,
        pagesize: 10
      },
      infoData: {}, // 基本信息
      soOptLogList: [] // 操作日志
    };
  },
  methods: {
    initData(data) {
      this.infoData = data.infoData;
      this.dataSource.data = data.soOptLogList;
    }
  }
};
</script>
