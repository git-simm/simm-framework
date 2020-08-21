<template>
  <section class="content-section sys-log">
    <sxh-table :dataSource="data" ref="multipleTable" :config="config">
      <el-table-column prop="createBy" label="操作人" width="120"></el-table-column>
      <el-table-column prop="createAt" label="操作时间" width="180"></el-table-column>
      <el-table-column
        prop="sysModuleName"
        label="业务模块"
        width="180"
        :filters="filters"
        :filter-method="filterHandler"
      ></el-table-column>
      <el-table-column prop="operRemark" label="操作说明"></el-table-column>
    </sxh-table>
  </section>
</template>

<script>
export default {
  name: "sxhLog",
  props: {
    bizList: { type: Array, required: true, default: [] },
    idList: { type: Array, required: true, default: [] }
  },
  data: function() {
    return {
      data: {},
      filters: [],
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      }
    };
  },
  watch: {
    bizList: {
      handler(val, oldVal) {
        if (JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.getListData();
        }
      },
      deep: true
    },
    idList: {
      handler(val, oldVal) {
        if (JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.getListData();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getListData();
  },
  methods: {
    /**
     * 过滤处理器
     */
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      this.config.page = page;
      this.config.pagesize = size;
      var jsondata = {
        bizList: this.bizList,
        idList: [this.idList],
        pageNo: page,
        pageSize: size
      };
      this.$httpUtil.post({
        url: "/sys/oper/log/list.json",
        data: jsondata,
        contentType: "form",
        succ: function(data) {
          var page = data.data || {};
          self.data = {
            data: page.records,
            records: page.total
          };
          if ((self.data.data || []).length === 0) return;
          //生成过滤条件
          var modules = Array.from(
            new Set(self.data.data.map(a => a.sysModuleName))
          );
          self.filters = modules.map(a => {
            return { text: a, value: a };
          });
        }
      });
    },
    getListData: function() {
      this.getPagerListData(this.config.page, this.config.pagesize);
    }
  }
};
</script>
<style lang="less">
.sys-log .el-table__column-filter-trigger {
  line-height: 26px !important;
}
</style>