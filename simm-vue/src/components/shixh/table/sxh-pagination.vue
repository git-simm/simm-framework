<template>
  <div>
    <div class="block" v-if="!simple">
      <el-pagination
        class="pull-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :small="small"
        :current-page="curPage"
        :page-sizes="pageSizes"
        :page-size="realPageSize"
        :layout="layout"
        :total="realTotal"
      ></el-pagination>
    </div>
    <sxh-simple-pagination
      ref="simplePager"
      :queryData="queryData"
      :currentRows="currentRows"
      :totalSize="realTotal"
      v-else
    ></sxh-simple-pagination>
  </div>
</template>
<script>
import sxhSimplePagination from "./sxh-simple-pagination";
export default {
  components: {
    sxhSimplePagination
  },
  props: {
    simple: {
      type: Boolean,
      default: false
    },
    queryData: {
      required: true,
      type: Function
    },
    currentRows: {
      type: Number,
      default: 0
    },
    small: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: "total,sizes, prev, pager, next, jumper"
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 25, 50, 100, 200];
      }
    },
    totalSize: null
  },
  computed: {
    realTotal() {
      //判断totalSize是否为数字
      if (this.totalSize != null) {
        var temp = Number(this.totalSize);
        if (!isNaN(temp)) {
          return temp;
        } else {
          return 0;
        }
      }
      return 0;
    }
  },
  mounted() {
    this.realPageSize = this.pageSize;
    //this.queryData(this.curPage - 1, this.realPageSize);
  },
  methods: {
    handleSizeChange(val) {
      this.realPageSize = val;
      this.curPage = 1;
      this.queryData(this.curPage, this.realPageSize);
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.queryData(this.curPage, this.realPageSize);
    },
    refreshData(param) {
      this.curPage = 1;
      this.queryData(this.curPage, this.realPageSize, param);
    },
    setPage(page) {
      if (this.$refs.simplePager) {
        this.$refs.simplePager.setPage(page);
      } else {
        this.curPage = page;
      }
    }
  },
  data() {
    return {
      curPage: 1,
      realPageSize: 25
    };
  }
};
</script>
