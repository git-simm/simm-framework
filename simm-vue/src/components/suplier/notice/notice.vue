<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm el-drawer__body"
        @keyup.native.enter="searchFun"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="标题">
              <el-input placeholder="请输入公告标题" v-model.trim="request.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="类型">
              <el-select
                v-model.number="request.noticeType"
                clearable
                placeholder="请选择"
                type="number"
              >
                <el-option
                  v-for="(item,index) in $cacheUtil.getDic('notice_type')"
                  :key="'noticeType'+index"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态">
              <el-select v-model.number="request.status" clearable placeholder="请选择" type="number">
                <el-option
                  v-for="(item,index) in $cacheUtil.getDic('notice_status_type')"
                  :key="'status'+index"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="发布时间">
              <el-date-picker
                :editable="false"
                :clearable="true"
                v-model="timedate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                @change="datechange"
                placeholder="开始到结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <div class="pull-right">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜 索</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <span>
        <router-link to="/suplier/notice/add">
          <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
        </router-link>
      </span>
      <el-table
        border
        size="mini"
        :data="listData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="标题" prop="date">
          <template scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="类型" width="200">
          <template scope="scope">{{ $cacheUtil.getVal('notice_type',scope.row.noticeType) }}</template>
        </el-table-column>
        <el-table-column label="创建人" width="150">
          <template scope="scope">{{scope.row.creator}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template scope="scope">{{scope.row.createAt}}</template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template scope="scope">{{scope.row.releaseTime}}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template scope="scope">{{ $cacheUtil.getVal('notice_status_type',scope.row.status) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <router-link :to="'/suplier/notice/view/'+scope.row.id">
              <el-button plain size="minier">查看</el-button>
            </router-link>
            <span v-permission:notice_edit>
              <router-link
                v-if="scope.row.status ==0"
                :to="'/suplier/notice/edit/'+scope.row.id+'/'+scope.row.status"
              >
                <el-button plain size="minier">编辑</el-button>
              </router-link>
            </span>
            <span v-permission:notice_modification>
              <router-link
                v-if="scope.row.status ==1"
                :to="'/suplier/notice/edit/'+scope.row.id+'/'+scope.row.status"
              >
                <el-button plain size="minier">修改</el-button>
              </router-link>
            </span>
            <span v-permission:notice_close>
              <el-button
                plain
                size="minier"
                v-if="scope.row.status ==0 || scope.row.status ==1 || scope.row.status == 2"
                @click="closeNotice(scope.row,-1)"
              >关闭</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="request.page"
        layout="total, prev, pager, next, jumper"
        :page-size="request.pagesize"
        :total="data.records"
      ></el-pagination>
    </div>
  </section>
</template>

<script>
import moment from "moment";
export default {
  name: "notice",
  data: function(router) {
    return {
      listData: [],
      request: {
        title: "",
        noticeType: "",
        status: "",
        releaseTimeBegin: "",
        releaseTimeEnd: "",
        page: 1,
        pagesize: 10
      },
      firstFlag: false,
      timedate: [
        new Date(new Date().setMonth(new Date().getMonth() - 12)),
        new Date()
      ],
      data: {}
    };
  },
  created: function() {
    const start = new Date();
    const end = new Date();
    start.setMonth(start.getMonth() - 2);
    end.setMonth(end.getMonth() + 1);
    this.timedate = [start, end];
    this.stringdata();
    this.getListData();
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.request.page = val;
      this.getListData();
    },
    stringdata() {
      !!this.timedate && !!this.timedate[0]
        ? (this.request.releaseTimeBegin = moment(this.timedate[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          ))
        : (this.request.releaseTimeBegin = "");
      !!this.timedate && !!this.timedate[1]
        ? (this.request.releaseTimeEnd = moment(this.timedate[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          ))
        : (this.request.releaseTimeEnd = "");
    },
    datechange(value) {
      this.firstFlag = true;
      if (value) {
        if (this.firstFlag) {
          var self = this;
          var value = String(value).split(" - ");
          this.stringdata();
          let start = new Date(self.timedate[0]);
          let end = new Date(self.timedate[1]);
          let addstart = start;
          addstart.setMonth(start.getMonth() + 3);
          if (addstart < end) {
            let newStart = new Date(end);
            newStart.setMonth(end.getMonth() - 3);
            self.timedate = [newStart, end];
            self.$message({
              message: "选择日期范围不能超过三个月",
              type: "error"
            });
          }
        }
      } else {
        this.request.releaseTimeBegin = "";
        this.request.releaseTimeEnd = "";
      }
    },
    closeNotice(item, noticeType) {
      var self = this;
      self
        .$confirm("是否确定关闭该公告", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var self = this;
          this.$httpUtil.post({
            url: "/supplyBulletin/close.json",
            data: {
              id: item.id,
              status: noticeType
            },
            contentType: "form",
            succ: function(data) {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.getListData();
            }
          });
        })
        .catch(() => {});
    },
    getListData: function() {
      var self = this;
      var store = this.$store;
      var jsondata = self.request;
      this.$httpUtil.post({
        url: "/supplyBulletin/list.json",
        data: jsondata,
        contentType: "form",
        succ: function(data) {
          self.data = data;
          self.listData = data.data;
        }
      });
    },
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
      }
    }
  }
};
</script>

<style scoped>
</style>
