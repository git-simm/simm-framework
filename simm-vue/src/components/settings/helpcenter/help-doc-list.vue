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
              <el-input placeholder="请输入标题" v-model.trim="request.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="编码">
              <el-input placeholder="请输入编码" v-model.trim="request.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              style="margin-left:20px;"
              @click="searchFun()"
            >搜 索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <span style="float:left;">
        <router-link :to="'/settings/helpcenter/doc/add/'+helpDocTree.id" v-if="helpDocTree.id">
          <el-button type="primary" class="btn-default row-button" icon="el-icon-plus">新增</el-button>
        </router-link>
      </span>
      <span style="float:left;padding-left:10px;" v-if="helpDocTree.name">
         <el-tag
                  effect="light"
                  title="层级名称"
                ><h5>层级名称:【{{helpDocTree.name}}】  ID:【{{helpDocTree.id}}】</h5></el-tag>
      </span>
      <sxh-table :dataSource="data" ref="multipleTable" :config="config">
        <el-table-column label="编码" width="150" prop="code"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="类型" width="100">
          <template scope="scope">{{ $cacheUtil.getVal('doc_type',scope.row.docType) }}</template>
        </el-table-column>
        <el-table-column label="排序码" width="80" prop="sort"></el-table-column>
        <el-table-column label="父级目录" width="100" prop="treeId"></el-table-column>
        <!-- <el-table-column label="创建人" width="150" prop="createBy"></el-table-column> -->
        <!-- <el-table-column label="创建时间" width="180" prop="createAt"></el-table-column> -->
        <el-table-column label="状态" width="100">
          <template scope="scope">{{ $cacheUtil.getVal('city_status',scope.row.status) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link :to="'/settings/helpcenter/doc/view/'+scope.row.id">
              <el-button plain size="minier">查看</el-button>
            </router-link>
            <span>
              <router-link :to="'/settings/helpcenter/doc/edit/'+scope.row.id">
                <el-button plain size="minier">编辑</el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
      </sxh-table>
    </div>
  </section>
</template>
<script>
import moment from "moment";
export default {
  name: "helpDocList",
  data: function(router) {
    return {
      listData: [],
      request: {
        title: "",
        code: ""
      },
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      data: {},
      helpDocTree:{}
    };
  },
  created() {
    this.getListData();
  },
  activated() {
    this.getListData();
  },
  methods: {
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = self.request;
      this.helpDocTree={};
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.pageNo = page;
      jsondata.pageSize = size;
      this.$httpUtil.post({
        url: "/helpdoc/list.json",
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
    seachByTreeIds:function(data){
      var self = this;
      self.helpDocTree=data.helpDocTree;
      var jsondata = {};
      jsondata.treeIdList=data.treeIdList;
      jsondata.pageNo = this.config.page;
      jsondata.pageSize =  this.config.pagesize;
      this.$httpUtil.post({
        url: "/helpdoc/listByIds.json",
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
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
         this.getListData();
      }
    }
  }
};
</script>
