<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @submit.native.prevent="searchFun"
      >
        <el-col :span="8">
          <el-form-item label="标签名称">
            <el-input placeholder="请输入标签名称" v-model.trim="request.label_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label-width="10px">
            <el-button type="primary" class="btn-default" @click="searchFun()">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-button type="primary" class="btn-default row-button" @click="addShow()">新增标签</el-button>
      <el-table border :data="data.data" style="width: 100%">
        <el-table-column prop="id" label="标签ID"></el-table-column>
        <el-table-column prop="label_name" label="标签名称"></el-table-column>
        <el-table-column prop="create_at" label="创建时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.status == 1 ? "可用" : "不可用" }}</template>
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
    <el-dialog title="新增标签" :visible.sync="addFlg">
      <el-form :model="addData" :rules="rulesAdd" ref="addData" label-width="100px">
        <el-form-item label="标签名称" prop="label_name">
          <el-input v-model.trim="addData.label_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave(addData, 'addData')">确 定</el-button>
        <el-button @click="addFlg = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data: function(router) {
    return {
      addData: {},
      addFlg: false,
      loading: true,
      request: {
        page: 1,
        pagesize: 10,
        label_name: ""
      },
      rulesAdd: {
        label_name: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
          { max: 4, message: "标签名不能超过4个字", trigger: "blur" }
        ]
      },
      data: {}
    };
  },
  created: function() {
    this.getListData();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.request.page = val;
      this.getListData();
    },
    getListData: function() {
      var self = this;
      var store = this.$store;
      var jsondata = Object.assign(self.request, {
        token: store.state.token,
        tokenid: store.state.tokenid
      });
      this.$parent.callAPI2("GET", "/labelinfo/view.json", jsondata, function(
        data
      ) {
        if (data.resultCode === 1000) {
          self.data = data;
        }
      });
    },
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
      }
    },
    addShow: function() {
      this.addData = {
        label_name: ""
      };
      this.addFlg = true;
    },
    addSave: function(item, formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var store = self.$store;
          self.$parent.callAPI(
            "POST",
            "/labelinfo/doadd.json",
            {
              token: store.state.token,
              tokenid: store.state.tokenid,
              label_name: item.label_name
            },
            function(data) {
              self.request.page = 1;
              self.getListData();
              self.addFlg = false;
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>
