<template id="list">
  <section class="content-section">
    <el-row :gutter="20" class="search-form el-drawer__body">
      <el-form :model="request" label-width="120px" class="demo-ruleForm">
        <el-col :span="8">
          <el-form-item label="类目名称">
            <el-input placeholder="请输入类目名称" v-model.trim="request.prod_category_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="10px">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              @click="searchFun()"
            >搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <span v-permission:prodtype_add>
        <el-button type="primary" @click="addShow()" icon="el-icon-plus" class="btn-default">新增类目</el-button>
      </span>
      <el-table border :data="infoData.data" size="mini" style="width: 100%">
        <el-table-column prop="id" label="类目ID"></el-table-column>
        <el-table-column prop="prod_category_name" label="类目名称"></el-table-column>
        <el-table-column prop="create_at" label="创建时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.status == 1 ? "启用" : "禁用" }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              plain
              size="minier"
              @click="editShow(scope.row)"
              v-permission:prodtype_update
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="page"
        layout="total, prev, pager, next, jumper"
        :page-size="pagesize"
        :total="infoData.records"
      ></el-pagination>
    </div>
    <el-dialog title="新增类目" :visible.sync="addFlg">
      <el-form :model="addData" label-width="25%" :rules="rulesAdd" ref="addData">
        <el-form-item label="类目名称" prop="prod_category_name">
          <el-input v-model.trim="addData.prod_category_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="addData.sort" auto-complete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addData.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave(addData, 'addData')">确 定</el-button>
        <el-button @click="addFlg = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑类目" :visible.sync="editFlg">
      <el-form :model="selected" label-width="25%" :rules="rulesAdd" ref="selected">
        <el-form-item label="类目名称" prop="prod_category_name">
          <el-input v-model.trim="selected.prod_category_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="selected.sort" auto-complete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="selected.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSave(selected, 'selected')">确 定</el-button>
        <el-button @click="editFlg = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: "prodTypeList",
  data: function() {
    return {
      menuBtnId: [],
      loading: true,
      page: 1,
      pagesize: 10,
      editFlg: false,
      addFlg: false,
      selected: {},
      request: {
        prod_category_name: ""
      },
      addData: {
        prod_category_name: "",
        sort: "0",
        status: "1"
      },
      infoData: {},
      rulesAdd: {
        prod_category_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 4, message: "分类名称长度不得超过4", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入排序(正整数)", trigger: "blur" },
          {
            pattern: /^[1-9]\d*|0$/,
            message: "请输入排序(正整数)",
            trigger: "blur"
          }
        ],
        status: [{ required: true, message: "请输入状态", trigger: "change" }]
      },
      rulesEdit: {
        prod_category_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 4, message: "分类名称长度不得超过4", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入排序(正整数)", trigger: "blur" },
          {
            pattern: /^[1-9]\d*|0$/,
            message: "请输入排序(正整数)",
            trigger: "blur"
          }
        ],
        status: [{ required: true, message: "请输入状态", trigger: "change" }]
      }
    };
  },
  created: function() {
    this.getListData();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getListData();
    },
    getListData: function() {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI2(
        "GET",
        "/prodCategory/list.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          prod_category_name: self.request.prod_category_name,
          page: self.page,
          pagesize: self.pagesize
        },
        function(data) {
          if (data.resultCode === 1000) {
            self.infoData = data;
          }
        }
      );
    },
    searchFun: function() {
      if (this.page === 1) {
        this.getListData();
      } else {
        this.page = 1;
      }
    },
    ajaxFun: function(json, item) {
      var self = this;
      var store = this.$store;
      var jsondata = Object.assign(
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: item.id,
          prod_category_name: item.prod_category_name,
          sort: item.sort,
          status: item.status
        },
        json
      );
      this.$parent.callAPI(
        "POST",
        "/prodCategory/save.json",
        jsondata,
        function(data) {
          self.getListData();
          self.editFlg = false;
        }
      );
    },
    addShow: function() {
      this.addData = {
        prod_category_name: "",
        sort: "0",
        status: "1"
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
            "/prodCategory/save.json",
            {
              token: store.state.token,
              tokenid: store.state.tokenid,
              prod_category_name: item.prod_category_name,
              sort: item.sort,
              status: item.status
            },
            function(data) {
              self.page = 1;
              self.getListData();
              self.addFlg = false;
            }
          );
        } else {
          return false;
        }
      });
    },
    editShow: function(item) {
      item.status = String(item.status);
      item.sort = String(item.sort);
      this.selected = Object.assign({}, item);
      this.editFlg = true;
    },
    editSave: function(item, formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.ajaxFun({}, item);
        } else {
          return false;
        }
      });
    },
    cancelFun: function() {
      this.editFlg = false;
      this.addFlg = false;
    }
  }
};
</script>
