<template>
  <section class="content-section">
    <el-row class="cmd_detail">
      <el-col :span="12">
        <h4 class="text-theme">指令详情</h4>
      </el-col>
      <el-col :span="12">
        <div class="pull-right">
          <el-button type="primary" icon="el-icon-download" @click="excelExport()">导出变更的业务数据</el-button>
        </div>
      </el-col>
      <el-col :span="24" style="padding:20px;">
        <table class="table table-hover table-bordered table-largePadding">
          <tbody>
            <tr>
              <td>指令ID</td>
              <td>{{sysCmd.id}}</td>
              <td>指令类型</td>
              <td>{{sysCmd.cmdType}}</td>
              <td>创建人</td>
              <td>{{sysCmd.createBy}}</td>
              <td>创建时间</td>
              <td>{{sysCmd.createAt}}</td>
            </tr>
            <tr>
              <td>模块ID</td>
              <td>{{sysCmd.sysModuleId}}</td>
              <td>模块CODE</td>
              <td>{{sysCmd.sysModuleName}}</td>
              <td>指令状态</td>
              <td
                colspan="3"
                :style="`color:${sysCmd.cmdStatus!==1?'red':''}`"
              >{{sysCmd.cmdStatus==1?"释放":"锁定"}}</td>
            </tr>
            <tr>
              <td>指令描述</td>
              <td colspan="3">{{sysCmd.cmdRemark}}</td>
              <td>指令参数</td>
              <td colspan="3" style="word-wrap:break-word;word-break:break-all;">{{sysCmd.cmdJson}}</td>
            </tr>
            <tr>
              <td>执行结果</td>
              <td colspan="7">{{sysCmd.cmdResult}}</td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
    <sxh-table :dataSource="data" ref="multipleTable" :config="config">
      <el-table-column prop="sysModuleId" label="业务模块">
        <template slot-scope="scope">
          <span>ID：{{scope.row.sysModuleId}}</span>
          <el-tag size="mini" effect="plain">{{scope.row.sysModuleName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="refId" label="业务ID"></el-table-column>
      <el-table-column prop="refNumber" label="业务数据编码"></el-table-column>
      <el-table-column prop="cmdRemark" label="变更前">
        <template slot-scope="scope">
          <span>{{$metadata.cmdDetailExport.methods.getOldProp(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cmdResult" label="变更后">
        <template slot-scope="scope">
          <span>{{$metadata.cmdDetailExport.methods.getNewProp(scope.row)}}</span>
        </template>
      </el-table-column>
    </sxh-table>
  </section>
</template>
<style lang="less">
.cmd_detail {
  .table.table-largePadding > tbody > tr > td:nth-child(2n + 1) {
    width: 100px !important;
  }
}
</style>
<script>
import exportUtil from "../../../../../common/utils/ExportUtil";

export default {
  name: "cmdView",
  props: {
    //查看参数
    viewParam: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      id: this.viewParam ? this.viewParam.id : Number(this.$route.params.id),
      sysCmd: {},
      request: {},
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      data: {}
    };
  },
  created() {
    this.getDetail();
    this.getListData();
  },
  methods: {
    getDetail() {
      var self = this;
      this.$httpUtil.post({
        url: "/sysCmd/getOne.json",
        data: { id: this.id },
        succ: function(data) {
          self.sysCmd = data.data;
        }
      });
    },
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = self.request;
      jsondata.id = this.id;
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.pageNo = page;
      jsondata.pageSize = size;
      this.$httpUtil.post({
        url: "/sysCmdBizLog/list.json",
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
     * excel导出
     */
    excelExport() {
      var self = this;
      var jsondata = self.request;
      jsondata.id = this.id;
      this.$httpUtil.post({
        url: "/sysCmdBizLog/export.json",
        data: jsondata,
        contentType: "form", //json,form,multipart
        succ: function(data) {
          var config = self.$metadata.cmdDetailExport;
          var exportData = self.wrapExportData(data.data, config);
          exportUtil.exportByConfig(self, exportData, config);
        }
      });
    },
    /**
     * 组装导出数据
     */
    wrapExportData(data, config) {
      (data || []).forEach(a => {
        //获取变更前、后数据
        a.cmdRemark = config.methods.getOldProp(a);
        a.cmdResult = config.methods.getNewProp(a);
      });
      return data;
    }
  }
};
</script>
