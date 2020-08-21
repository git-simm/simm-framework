<template>
  <!-- <div class="block" style="text-align:center;"> -->
  <div class="block">
    <el-button-group class="pull-right">
      <el-button type="primary" @click="handleLastPage" :disabled="!canPrev || prevDisabled">
        <i class="el-icon-arrow-left el-icon--left"></i>上一页
      </el-button>
      <el-button
        type="primary"
        style="margin-left:5px"
        :disabled="!canNext || nextDisabled"
        @click="handleNextPage"
      >
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-button-group>
    <el-select
      v-model="realPageSize"
      placeholder="分页尺寸"
      class="pull-right"
      style="margin-right:10px;width:100px;"
      @change="handleSizeChange"
    >
      <el-option
        v-for="size in pageSizes"
        :key="`page-size-${size}`"
        :label="`${size}条/页`"
        :value="size"
      ></el-option>
    </el-select>
    <span
      style="font-size: 15px;margin-right:10px;margin-top:8px;"
      class="pull-right"
    >共 {{totalSize}} 条,第 {{curPage}} 页</span>
  </div>
</template>

<script>
export default {
  props: {
    queryData: {
      required: true,
      type: Function
    },
    currentRows: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    totalSize: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 25, 50, 100, 200];
      }
    },
    hasNext: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      canPrev: false,
      canNext: true,
      prevDisabled: false,
      nextDisabled: false,
      curPage: 1,
      realPageSize: this.pageSize
    };
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
  watch: {
    curPage: {
      handler: function(val) {
        this.canPrev = val > 1;
      }
    },
    currentRows: {
      handler: function(len) {
        //到达末尾页，下一页不能继续操作
        this.canNext = len >= this.realPageSize;
      }
    }
    // totalSize: {
    //   handler: function(val, oldVal) {
    //     console.log(val);
    //     console.log(oldVal);
    //   }
    // }
  },
  mounted() {
    this.realPageSize = this.pageSize;
    //this.queryData(this.curPage - 1, this.realPageSize);
  },
  methods: {
    handleSizeChange(val) {
      this.curPage = 1;
      this.queryData(this.curPage, this.realPageSize);
    },
    /**
     * 下一页操作
     */
    handleNextPage() {
      var self = this;
      this.curPage++;
      this.nextDisabled = true;
      this.queryData(this.curPage, this.realPageSize, data => {
        self.nextDisabled = false;
      });
    },
    /**
     * 上一页操作
     */
    handleLastPage() {
      var self = this;
      this.curPage--;
      this.canNext = true;
      this.prevDisabled = true;
      this.queryData(this.curPage, this.realPageSize, data => {
        self.prevDisabled = false;
      });
    },
    setPage(page) {
      this.curPage = page;
    }
  }
};
</script>
