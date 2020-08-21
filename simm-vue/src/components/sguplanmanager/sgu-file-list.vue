<template>
  <section class="content-section sgu-import">
    <el-row :gutter="24" class="search-form el-drawer__body">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @submit.native.prevent="searchFun"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input placeholder="请输入创建人" v-model.trim="request.creatorName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="创建日期">
              <sxh-date
                v-model="request.timeArr"
                controlType="daterange"
                @change="arr => {
                                request.beginCreateAt = arr[0];
                                request.endCreateAt = arr[1];}"
              ></sxh-date>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="计划名称">
              <el-input placeholder="请输入计划名称" v-model.trim="request.planName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="计划编码">
              <el-input placeholder="请输入计划编码" v-model.trim="request.planNumber"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <div style="padding-left:10px;">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜索</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row></el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-row>
        <el-col :span="20" v-if="userInfo.roleType==2">
          <label></label>
          <span v-permission:plan_import_pick_up>
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-document"
              @click="importData(2)"
            >批量导入(自提)</el-button>
          </span>
          <span v-permission:plan_import_post>
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-document"
              @click="importData(1)"
            >批量导入(包邮)</el-button>
          </span>
        </el-col>
        <el-col v-else :span="20">
          <label class="text-theme">*仅支持城市人员批量上传上架计划</label>
        </el-col>
        <el-col :span="4">
          <div class="pull-right">
            <sxh-help code="031001"></sxh-help>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <sxh-table ref="sguFileTable" :config="config" :dataSource="infoData">
          <el-table-column prop="planNumber" label="计划信息">
            <template slot-scope="scope">
              <span>编码：{{scope.row.planNumber}}</span>
              <br />
              <span>名称：{{scope.row.planName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fileName" label="文件">
            <template slot-scope="scope">
              <a :href="scope.row.url">{{scope.row.fileName}}</a>
            </template>
          </el-table-column>
          <!--<el-table-column prop="url" label="文件URL" width="200"></el-table-column>
                <el-table-column label="导入状态">
                  <template slot-scope="scope">{{$cacheUtil.getVal("valid", scope.row.valid)}}</template>
          </el-table-column>-->
          <el-table-column prop="submitSum" width="140" label="SGU处理统计">
            <template slot="header">
              <span>SGU处理统计</span>
              <sxh-popover :tooltip="summaryRemark" :tooltip-width="260"></sxh-popover>
            </template>
            <template slot-scope="scope">
              <!--<span style="color: gray;">作废：{{scope.row.deleteSum}}</span>
              <br />-->
              <span style="color: crimson;" title="子任务还未生成SGU">创建失败：{{scope.row.waitEditSum}}</span>
              <br />
              <span style="color: darkred;">SGU草稿：{{scope.row.draftSum}}</span>
              <br />
              <span style="color: darkgreen;">SGU已提交：{{scope.row.submitSum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建信息">
            <template slot-scope="scope">
              姓名：{{scope.row.creatorName}}
              <br />
              时间：{{scope.row.createTime}}
              <br />
              <el-tag size="mini" effect="plain">{{scope.row.creatorBelongs}}</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column prop="remark" label="备注"></el-table-column>
           <el-table-column label="是否删除">
                  <template slot-scope="scope">{{$cacheUtil.getVal("delete_flag", scope.row.deleteFlag)}}</template>
          </el-table-column>-->
          <el-table-column label="是否作废" width="100">
            <template slot-scope="scope">
              <el-tag size="mini" effect="plain" v-if="scope.row.deleteFlag===1">已作废</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <span v-permission:sgu_plan_detail>
                <router-link :to="'/sguplanmanager/sguPlanList/' + scope.row.id">
                  <el-button type="primary" plain size="minier">任务处理</el-button>
                </router-link>
              </span>
              <span>
                <el-button plain size="minier" @click="exportResult(scope.row,scope.row.id)">异常导出</el-button>
              </span>
              <!--TODO 权限控制-->
              <span v-permission:cancel_imported_sgu_plan>
                <el-button
                  v-if="scope.row.deleteFlag === 0 && scope.row.submitSum === 0"
                  plain
                  size="minier"
                  @click="cancel(scope.row)"
                >作废</el-button>
              </span>
            </template>
          </el-table-column>
        </sxh-table>
      </el-row>
    </div>
  </section>
</template>

<script>
import sguPlanImport from "@/components/sguplanmanager/template/sgu-plan-import";
import moment from "moment";
export default {
  name: "sgu-file-list",
  components: { sguPlanImport },
  data() {
    return {
      infoData: {},
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      userInfo: this.$store.state.userInfo,
      request: {
        timeArr: [],
        beginCreateAt: "",
        endCreateAt: "",
        creatorName: "",
        planName: "",
        planNumber: ""
      },
      summaryRemark: `
            <span style="color: crimson;">创建失败：子任务还未生成SGU</span>
            <br/>
            <span style="color: darkred;">SGU草稿：SGU还未提交</span>
            <br/>
            <span style="color: darkgreen;">SGU已提交：SGU已经提交完成</span>`
    };
  },
  mounted() {
    this.searchFun();
  },
  activated() {
    this.searchFun();
  },
  methods: {
    /**
     * 作废
     * @param row
     */
    cancel(row) {
      var self = this;
      self.$commonUtil.message.confirm(`确定要作废当前计划?`, () => {
        self.$httpUtil.post({
          url: "/sguPlanImpFileInfo/invalid.json",
          data: {
            id: row.id
          },
          contentType: "json",
          succ: function() {
            self.searchFun();
            self.$message({
              type: "success",
              message: "操作成功!"
            });
          }
        });
      });
    },
    exportResult(row, id) {
      this.$httpUtil.export({
        url: "/sguPlanImpFileInfo/exportErr.json?id=" + id,
        title: `计划【${row.planNumber}】错误说明`,
        contentType: "form",
        succ: function() {}
      });
    },
    importData(deliveryType) {
      var self = this;
      // 弹框title
      var winName = "";
      if (deliveryType == 1) {
        winName = "批量导入【团购包邮】";
      } else if (deliveryType == 2) {
        winName = "批量导入【团购自提】";
      }
      this.$layerUtil.openWin(this, {
        title: winName,
        area: ["600px", "450px"],
        data: {
          deliveryType: deliveryType,
          callback: (allRecords, failedRecords) => {
            this.searchFun();
            // 根据导入结果给不同提示
            var message, messageType;
            if (failedRecords > 0) {
              message = `总计导入${allRecords}条计划,其中${failedRecords}条生成SGU草稿失败!详情请在批量导入管理界面点击【异常导出】按钮下载!`;
              messageType = "warning";
            } else {
              message = `总计导入${allRecords}条计划,均已生成SGU草稿!`;
              messageType = "success";
            }
            self.$message({
              type: messageType,
              message: message
            });
          }
        },
        component: sguPlanImport
      });
    },
    searchFun: function() {
      if (this.$refs.sguFileTable) {
        this.$refs.sguFileTable.setPage(1);
      }
      this.getPagerListData(this.config.page, this.config.pagesize);
    },
    getPagerListData: function(page, pagesize) {
      var self = this;

      if (self.request.endCreateAt) {
        self.request.endCreateAt = moment(self.request.endCreateAt).format(
          "YYYY-MM-DD 23:59:59"
        );
      }
      if (self.request.beginCreateAt) {
        self.request.beginCreateAt = moment(self.request.beginCreateAt).format(
          "YYYY-MM-DD 00:00:00"
        );
      }
      var jsonData = Object.assign({}, self.request);
      jsonData.current = page;
      jsonData.size = pagesize;
      this.$httpUtil.post({
        url: "/sguPlanImpFileInfo/list.json",
        data: jsonData,
        contentType: "form", //json,form,multipart
        isShowLoading: false, //不显示遮罩
        succ: function(data) {
          var page = data.data || {};
          self.infoData = {
            data: page.records,
            records: page.total
          };
        }
      });
    }
  }
};
</script>

<style scoped>
</style>