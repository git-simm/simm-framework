<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form
        :model="request"
        label-width="130px"
        class="demo-ruleForm"
        @keyup.native.enter="searchFun"
      >
        <el-col :span="8">
          <el-form-item label="供应商名称">
            <el-input placeholder="请输入供应商名称" v-model.trim="request.supply_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人姓名">
            <el-input placeholder="请输入联系人姓名" v-model.trim="request.contact_person"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售模式">
            <el-select v-model="request.merchantModel" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in $cacheUtil.getDic('settltType')"
                :key="'settltType'+index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商类型">
            <el-select v-model="request.supply_identity" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in $cacheUtil.getDic('supply_identity')"
                :key="'supply_identity'+index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否为蔬果供应商">
            <el-select v-model="request.special_type" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in $cacheUtil.getDic('special_type')"
                :key="'special_type'+index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核状态">
            <el-select v-model="request.process_status" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in $cacheUtil.getDic('prod_audit_status')"
                :key="'supply_audit_status'+index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否直购">
            <el-select v-model="request.is_direct_purchasing" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in $cacheUtil.getDic('is_direct_purchasing')"
                :key="'is_direct_purchasing'+index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="10px">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              @click="searchFun()"
            >搜 索</el-button>
            <el-button
              v-permission:suplier_audit_export
              type="primary"
              class="btn-default"
              icon="el-icon-download"
              @click="excelExport()"
            >导 出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-table border size="mini" :data="data.data" style="width: 100%" :fit="true">
        <el-table-column label="供应商编码" prop="supply_number"></el-table-column>
        <el-table-column label="供应商名称" prop="supply_name"></el-table-column>
        <el-table-column label="供应商地址" width="150">
          <template
            slot-scope="scope"
          >{{scope.row.address_province + scope.row.address_city + scope.row.address_district + scope.row.address_detail}}</template>
        </el-table-column>
        <el-table-column label="供应商类型">
          <template
            slot-scope="scope"
          >{{ $cacheUtil.getVal('supply_identity',scope.row.supply_identity,'' ) }}</template>
        </el-table-column>
        <el-table-column label="销售模式">
          <template
            slot-scope="scope"
          >{{ $cacheUtil.getVal('settltType',scope.row.merchant_model,'' ) }}</template>
        </el-table-column>
        <el-table-column label="是否为蔬果供应商">
          <template
            slot-scope="scope"
          >{{ $cacheUtil.getVal('special_type',scope.row.special_type ) }}</template>
        </el-table-column>
        <el-table-column label="创建人信息">
          <template slot-scope="scope">姓名：{{scope.row.admin_user_name}}</template>
        </el-table-column>
        <el-table-column label="结算邮箱" prop="contact_email"></el-table-column>
        <el-table-column label="收货邮箱" prop="receive_email"></el-table-column>
        <el-table-column label="是否直购">
          <template
            slot-scope="scope"
          >{{ $cacheUtil.getVal('is_direct_purchasing',scope.row.is_direct_purchasing ) }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ $cacheUtil.getVal('so_status_type',scope.row.status ) }}</template>
        </el-table-column>

        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <a
              @click="openProcess(scope.row.id)"
            >{{ $cacheUtil.getVal('prod_audit_status',scope.row.process_status ) }}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <sxh-detail-view
              comp="supplyView"
              :view-param="{ id: scope.row.id,number:scope.row.supply_number }"
            ></sxh-detail-view>
            <!-- <span v-if="data.dataReserve1 == scope.row.group_id"> -->
            <span v-permission:suplier_manager_audit>
              <span v-if="scope.row.sysAudit != null">
                <el-button
                  plain
                  size="minier"
                  @click="ableFun(scope.row)"
                  v-if="scope.row.process_status == 1 || scope.row.process_status == 2 "
                >审核通过</el-button>
                <!--<a href="javascript:;" @click="disableFun(scope.row)" v-if="scope.row.process_status == 1 || scope.row.process_status == 2">审核不通过</a>-->
                <el-button
                  plain
                  size="minier"
                  @click="callBackFun(scope.row)"
                  v-if="scope.row.process_status == 1 || scope.row.process_status == 2 "
                >审核打回</el-button>
              </span>
            </span>
            <!-- </span> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pull-right"
        @current-change="handleCurrentChange"
        :current-page="request.page"
        :page-size="request.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="data.records"
      ></el-pagination>
    </div>
  </section>
</template>

<script>
import { doExcelExport } from "../../common/util.js";
export default {
  name: "SuplierAuditList",
  data: function(router) {
    return {
      menuBtnId: [],
      response: "",
      request: {
        page: 1,
        pagesize: 10,
        contact_person: "",
        process_status: "",
        supply_identity: "",
        merchantModel: null,
        special_type: "",
        supply_name: "",
        supply_type: "",
        group_id: "",
        is_direct_purchasing: null
      },
      data: {},
      // groupData: [],
      dataList: []
    };
  },
  created: function() {
    this.getListData();
    // this.getGroupData()
  },
  activated() {
    this.searchFun();
  },
  methods: {
    openProcess: function(bizId) {
      this.$commonUtil.win.showProcessList(this, "SUPPLY_AUDIT", bizId);
    },
    handleCurrentChange(val) {
      this.request.page = val;
      this.getListData();
    },
    getListData: function() {
      var self = this;
      var store = this.$store;
      var jsondata = self.request;
      jsondata.pager = {
        pageNo: self.request.page,
        pageSize: self.request.pagesize
      };
      this.$httpUtil.post({
        url: "/supplyInfo/groupList.json",
        data: jsondata,
        succ: function(data) {
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
    excelExport() {
      var self = this;
      this.$httpUtil.export({
        url: "/report/exportSupplyInfo.json",
        data: self.request
      });
    },
    handStatus(item) {
      var self = this;
      var store = this.$store;
      this.$parent.callAPI(
        "POST",
        "/supplyInfo/updateSupplyStatus.json",
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: item.id,
          status: item.status
        },
        function(data) {
          self.getListData();
        }
      );
    },
    ajaxFun(json, item, callback) {
      var self = this;
      var store = this.$store;
      var jsondata = Object.assign(
        {
          token: store.state.token,
          tokenid: store.state.tokenid,
          id: item.id,
          sysAudit: JSON.stringify(item.sysAudit)
        },
        json
      );
      this.$parent.callAPI2(
        "POST",
        "/supplyInfo/updateAuditStatus.json",
        jsondata,
        function(data) {
          if (data.resultCode == 1000) {
            self.$message({
              message: "操作成功！",
              type: "success"
            });
            self.getListData();
            if (callback) {
              callback();
            }
          }
        }
      );
    },
    // 审核通过
    ableFun(item) {
      var self = this;
      var store = this.$store;
      self
        .$confirm("确认审核通过？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.ajaxFun(
            {
              // audit_status: 1,
              audit_remark: "",
              process_status: 1
            },
            item,
            () => {
              // self.handStatus(item);
            }
          );
        })
        .catch(() => {});
    },
    disableFun(item) {
      var self = this;
      var store = this.$store;
      self
        .$prompt("确认审核不通过？请填写备注：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "请填写备注"
        })
        .then(({ value }) => {
          self.ajaxFun(
            {
              audit_remark: value,
              process_status: -1
            },
            item
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    callBackFun(item) {
      var self = this;
      var store = this.$store;
      self
        .$prompt("确认审核驳回？请填写备注：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "请填写备注"
        })
        .then(({ value }) => {
          self.ajaxFun(
            {
              audit_remark: value,
              process_status: -2
            },
            item
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    }
  }
};
</script>
