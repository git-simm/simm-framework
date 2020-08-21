<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form el-drawer__body">
      <el-form :model="request" label-width="120px" class="demo-ruleForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="规格单位">
              <el-input placeholder="请输入规格单位" v-model.trim="request.unitName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="request.status" clearable placeholder="请选择">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="10px">
              <el-button type="primary" class="btn-default" @click="searchFun()">搜 索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <span v-permission:prodmanage_unitlist_add>
        <el-button type="primary" @click="addShow()" class="btn-default">新 增</el-button>
      </span>
      <el-table border :data="infoData.data" style="width: 100%">
        <el-table-column prop="unitName" label="名称"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="salesModel" label="编号"></el-table-column>
        <el-table-column prop="createAt" label="创建时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.status == 1 ? "启用" : "禁用" }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              plain
              size="minier"
              @click="editShow(scope.row)"
              v-permission:prodmanage_unitlist_update
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="request.page"
        layout="total, prev, pager, next, jumper"
        :page-size="request.pagesize"
        :total="infoData.records"
      ></el-pagination>
    </div>
    <el-dialog title="新增规格单位" :visible.sync="addFlg">
      <el-form :model="addData" label-width="25%" :rules="rulesAdd" ref="addData">
        <el-form-item label="规格单位名称" prop="unitName">
          <el-input v-model.trim="addData.unitName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格单位编码" prop="code">
          <el-input v-model.trim="addData.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格单位编号" prop="salesModel">
          <el-input v-model.trim="addData.salesModel" auto-complete="off"></el-input>
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
    <el-dialog title="编辑规格单位" :visible.sync="editFlg">
      <el-form :model="selected" label-width="25%" :rules="rulesAdd" ref="selected">
        <el-form-item label="规格单位名称" prop="unitName">
          <el-input v-model.trim="selected.unitName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格单位编码">
          <el-input v-model.trim="selected.code" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="规格单位编号">
          <el-input v-model.trim="selected.salesModel" auto-complete="off" disabled></el-input>
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
  data: function() {
    return {
      menuBtnId: [],
      loading: true,
      editFlg: false,
      addFlg: false,
      selected: {},
      request: {
        page: 1,
        pagesize: 10,
        unitName: "",
        status: ""
      },
      addData: {
        code: "",
        salesModel: "",
        unitName: "",
        status: "1"
      },
      infoData: {},
      rulesAdd: {
        unitName: [
          { required: true, message: "请输入规格单位", trigger: "blur" },
          { max: 4, message: "规格单位长度不得超过4", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        code: [{ required: true, message: "请输入编码", trigger: "change" }],
        salesModel: [
          { required: true, message: "请输入编号", trigger: "change" },
          { pattern: /^\d+$/, message: "请输入正确的编号", trigger: "blur" }
        ]
      },
      rulesEdit: {
        unitName: [
          { required: true, message: "请输入规格单位", trigger: "blur" },
          { max: 4, message: "规格单位长度不得超过4", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        code: [{ required: true, message: "请输入编码", trigger: "change" }],
        salesModel: [
          { required: true, message: "请输入编号", trigger: "change" },
          { pattern: /^\d+$/, message: "请输入正确的编号", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {
    this.getListData();
  },
  methods: {
    handleCurrentChange(val) {
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
      this.$parent.callAPI2(
        "GET",
        "/base/prod/unit/list.json",
        jsondata,
        function(data) {
          if (data.resultCode === 1000) {
            self.infoData = data;
          }
        }
      );
    },
    searchFun: function() {
      if (this.request.page === 1) {
        this.getListData();
      } else {
        this.request.page = 1;
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
          unitName: item.unitName,
          status: item.status,
          code: item.code,
          salesModel: item.salesModel
        },
        json
      );
      this.$parent.callAPI(
        "POST",
        "/base/prod/unit/doUpdate.json",
        jsondata,
        function(data) {
          self.getListData();
          self.editFlg = false;
        }
      );
    },
    addShow: function() {
      this.addData = {
        code: "",
        salesModel: "",
        unitName: "",
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
            "/base/prod/unit/doadd.json",
            {
              token: store.state.token,
              tokenid: store.state.tokenid,
              unitName: item.unitName,
              status: item.status,
              code: item.code,
              salesModel: item.salesModel
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
    },
    editShow: function(item) {
      item.status = String(item.status);
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
