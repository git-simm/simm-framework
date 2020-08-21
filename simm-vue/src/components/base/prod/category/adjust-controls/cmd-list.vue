<template>
  <section class="content-section">
    <sxh-table :dataSource="data" ref="multipleTable" :config="config">
      <el-table-column prop="createBy" label="操作人">
        <template slot-scope="scope">
          <span>创建人：{{scope.row.createBy}}</span>
          <br />
          <span>{{scope.row.createAt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sysModuleId" label="模块">
        <template slot-scope="scope">
          <span>ID：{{scope.row.sysModuleId}}</span>
          <br />
          <span>{{scope.row.sysModuleName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cmdType" label="指令类型"></el-table-column>
      <el-table-column prop="cmdRemark" label="指令描述"></el-table-column>
      <el-table-column prop="cmdResult" label="执行结果"></el-table-column>
      <el-table-column prop="cmdStatus" label="锁定状态">
        <template slot-scope="scope">
          <span
            :style="`color:${scope.row.cmdStatus!==1?'red':''}`"
          >{{scope.row.cmdStatus==1?"释放":"锁定"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-permission:adjust_category>
            <el-button
              plain
              size="minier"
              v-if="scope.row.cmdStatus!==1"
              @click="()=>reTry(scope.row)"
            >重试</el-button>
            <el-button
              plain
              size="minier"
              v-if="scope.row.cmdStatus!==1"
              @click="()=>unLock(scope.row)"
            >强制解锁</el-button>
          </span>
          <sxh-detail-view comp="cmdView" :view-param="{ id: scope.row.id}"></sxh-detail-view>
          <el-button
                  plain
                  size="minier"
                  @click="()=>refresh()"
          >刷新</el-button>
        </template>
      </el-table-column>
    </sxh-table>
  </section>
</template>
<script>
export default {
  name: "cmdList",
  data() {
    return {
      request: {
        sysModuleId: 18 //类目调整指令集合
      },
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      data: {}
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = self.request;
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.pageNo = page;
      jsondata.pageSize = size;
      this.$httpUtil.post({
        url: "/sysCmd/list.json",
        data: jsondata,
        contentType: "form",
        succ: function(data) {
          var page = data.data || {};
          self.data = {
            data: page.records,
            records: page.total
          };
        }
      });
    },
    getListData: function() {
      this.getPagerListData(this.config.page, this.config.pagesize);
    },
    /**
     * 重试
     * @param {*} param
     */
    reTry(param) {
      var self = this;
      this.$httpUtil.post({
        url: "/sysCmd/reTry.json",
        data: param,
        succ: function(data) {
          self.getListData();
        }
      });
    },
    /**
     * 解锁
     * @param {*} param
     */
    unLock(param) {
      var self = this;
      this.$httpUtil.post({
        url: "/sysCmd/unLock.json",
        data: param,
        succ: function(data) {
          self.getListData();
        }
      });
    },
    /**
     * 刷新
     */
    refresh() {
      var self = this;
      self.getListData();
    }
  }
};
</script>