<template>
  <div class="search-table">
    <el-table
      ref="multipleTable"
      size="mini"
      :data="dataSource.data"
      :max-height="maxHeight"
      class="word-break"
      style="width: 100%;"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      @row-dblclick="handleRowDblClick"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
    >
      <el-table-column
        v-if="!userConfig.multiple && userConfig.showNo"
        align="center"
        type="index"
        label="序号"
        :index="i=>i+1"
      ></el-table-column>
      <el-table-column type="selection" v-if="userConfig.multiple && userConfig.showCheckbox"></el-table-column>
      <slot></slot>
      <el-table-column min-width="20" v-if="userConfig.autofit"></el-table-column>
    </el-table>
    <el-row class="top-margin" style="margin-top:10px;">
      <sxh-pagination
        ref="pager"
        v-if="userConfig.pagable"
        :totalSize="dataSource.records"
        :currentRows="(dataSource.data||[]).length"
        :pageSize="userConfig.pagesize"
        :small="userConfig.small"
        :layout="userConfig.layout"
        :simple="userConfig.simplePager"
        :queryData="userConfig.getListData"
      ></sxh-pagination>
    </el-row>
  </div>
</template>

<script>
import sxhPagination from "./sxh-pagination";
export default {
  name: "sxh-table",
  components: {
    "sxh-pagination": sxhPagination
  },
  props: {
    tableKey: String,
    reload: Function,
    maxHeight: {
      type: Number,
      default: null
    },
    dataSource: {
      data: [],
      records: {}
    },
    totalData: Array,
    bottomHeight: {
      type: Number,
      default: 164
    }, //table下部的高度
    config: Object,
    dbclick: Function
  },
  watch: {
    config: {
      handler: function(val, oldVal) {
        this.userConfig = { ...this.userConfig, val };
      },
      deep: true
    }
  },
  data() {
    return {
      selectedRows: [],
      currentRow: {},
      sortCols: [],
      useConfig: {},
      tableHeight: 200,
      userConfig: {
        ...{
          layout: "total,sizes, prev, pager, next, jumper",
          small: false, //小号
          entity: {}, //对应的后台实体
          showNo: true, //显示序号
          allowEdit: false, // 允许编辑
          showSummary: true, //默认值为 true
          multiple: false, //允许多选
          showCheckbox: true, //是否显示复选框
          sortable: true, //字段可排序
          pagable: true, //是否分页
          pagesize: 10, //默认分页尺寸
          simplePager: false, //简单的分页插件(不返回总数)
          getListData: Function, //获取数据列表的方法
          height: null, //默认高度
          autofit: false, //是否为自动适配列
          extendConfig: null //扩展列表配置[{prop:"",label:""}]
        },
        ...this.config
      }
    };
  },
  methods: {
    setPage(page) {
      this.$refs.pager.setPage(page);
    },
    handleExpandChange(row, event, column) {
      this.$emit("expand-change", row, event, column);
    },
    handleRowDblClick(row, event) {
      if (this.userConfig.dbclick != null) {
        this.userConfig.dbclick(row, event);
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.$emit("current-change", val);
    },
    handleRowClick(row, coloumn, event) {
      //处理table多选行自动选中
      if (this.userConfig.multiple && this.userConfig.showCheckbox) {
        this.toggleSelection([row]);
      }
    },
    toggleRowSelection(rows) {
      this.toggleSelection(rows);
    },
    toggleSelection(rows) {
      if (rows) {
        var $this = this;
        rows.forEach(row => {
          $this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    getOriTable() {
      return this.$refs.multipleTable;
    },
    getTableInfo: function() {
      return this.dataSource;
    },
    //获取选中行信息
    getSelectedRows: function() {
      return this.selectedRows;
    },
    //选中行返回
    handleSelectionChange(val) {
      this.selectedRows = val;
      this.$emit("selectedChange", val);
      this.$emit("selection-change", val);
    },
    getCurrentRow() {
      return this.currentRow;
    }
  }
};
</script>
