<template>
  <section class="content-section">
    <el-form :model="request" label-width="120px" class="demo-ruleForm">
      <span v-if="showMode">
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplyName">
            <el-input placeholder="请输入供应商名称" v-model.trim="request.supplyName"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="8">
          <el-form-item label="供应商编码" prop="supplyNumber">
            <el-input placeholder="请输入供应商编码" v-model.trim="request.supplyNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="请选择城市">
            <sxh-city v-model="request.cityIdList" :check-strictly="false" @change="cityChange"></sxh-city>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额">
            <el-input placeholder="请输入金额" type="number" v-model.trim="request.billAmount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="费用单号">
            <el-input placeholder="请输入费用单号" v-model.trim="request.billNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <sxh-date
                v-model="request.timeArr"
                controlType="daterange"
                @change="
                  arr => {
                    request.startTime = arr[0];
                    request.endTime = arr[1];
                  }
                "
            ></sxh-date>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="状态">
            <sxh-checkbox-group dic="bill_process_status" v-model="request.processStatusList"></sxh-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="扣款状态">
            <sxh-checkbox-group dic="is_deducted" v-model="request.deductedStatusList"></sxh-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <div class="pull-right">
            <el-form-item label-width="10px">
              <el-button type="primary" class="btn-default" icon="el-icon-search" @click="searchFun()">搜索</el-button>
              <el-button type="primary" class="btn-default" icon="el-icon-search"
                         @click="exportBillInfo()">导出
              </el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div v-permission="$permission.getCode(modeValid, {
                      1: `bill_create_1`,
                      2: `bill_create_2`})">
        <router-link :to="'/bill/add/'+ pageMode">
          <el-button
              type="primary"
              class="btn-default row-button"
              icon="el-icon-plus"
          >创建费用单
          </el-button>
        </router-link>
      </div>
      </span>
    </el-form>
    <sxh-table :dataSource="tableData" ref="multipleTable" :config="billConfig">
      <el-table-column label="单号" prop="billNumber"></el-table-column>
      <el-table-column label="城市" prop="cityName"></el-table-column>
      <el-table-column label="费用单名称" prop="billName"></el-table-column>
      <el-table-column label="供应商信息" prop="supplyId">
        <template slot-scope="scope">
          <span>编码：{{ scope.row.supplyNumber }}</span>
          <br/>
          <span>名称：{{ scope.row.supplyName }}</span>
          <br/>
          <span>销售模式：
            {{ $cacheUtil.getVal("merchant_model", scope.row.merchantModel) }}</span>
          <br/>
          <br>
          <span>是否分账：{{ $cacheUtil.getVal('is_sub_account', scope.row.isSubAccount, '') }}</span>
          <br/>
        </template>
      </el-table-column>
      <el-table-column label="费用类型" prop="billModel">
        <template slot-scope="scope">{{ $cacheUtil.getVal('bill_model', scope.row.billModel, '') }}
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="billAmount">
        <template slot-scope="scope">{{ parseFloat(scope.row.billAmount || 0).toFixed(2) }}元</template>
      </el-table-column>
      <el-table-column label="状态" prop="processStatus">
        <template slot-scope="scope">
          <span>{{ $cacheUtil.getVal('bill_process_status', scope.row.processStatus, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扣款状态" prop="isDeducted">
        <template slot-scope="scope">
          <span>{{ $cacheUtil.getVal('is_deducted', scope.row.isDeducted, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">·
        <template slot-scope="scope">
          <sxh-detail-view comp="billDetail" :view-param="{ id: scope.row.id}"></sxh-detail-view>
          <div v-permission="$permission.getCode(modeValid, {
                      1: `bill_cancel_1`,
                      2: `bill_cancel_2`})">
              <span v-if="scope.row.processStatus===0 || scope.row.processStatus===1">
              <el-button
                  plain
                  size="minier"
                  @click="cancel(scope.row)"
              >取消</el-button>
            </span>
          </div>
          <div
              v-permission="
                    $permission.getCode(modeValid, {
                      1: `bill_edit_1`,
                      2: `bill_edit_2`
                    })
                  ">
              <span v-if="scope.row.processStatus===0">
             <router-link
                 :to="`/bill/edit/${pageMode}/${scope.row.id}`">
            <el-button plain size="minier">编辑</el-button>
          </router-link>
          </span>
          </div>
        </template>
      </el-table-column>
    </sxh-table>
  </section>
</template>

<script>
import exportUtil from "../../../common/utils/ExportUtil";

export default {
  name: "billList",
  props: {
    //页面模式 1:团购;2:代理
    pageMode: {
      required: false,
      type: Number,
      default: 1 //默认为团购模式
    },
    showMode: {
      required: false,
      type: Boolean,
      default: true //默认为列表
    }
  },
  data() {
    return {
      tableData: {},
      billConfig: {
        getListData: this.getListData,
        multiple: false,
        page: 1,
        pagesize: 10
      },
      request: {
        supplyNumber: "",
        supplyName: "",
        supplyId: null,
        billType: this.pageMode,
        billCityId: null,
        billNumber: '',
        billAmount: null,
        deductedStatusList: [],
        processStatusList: [],
        timeArr: [],
        startTime: null,
        endTime: null,
        cityIdList: []
      },
    };
  },
  created() {
    this.searchFun();
  },
  activated() {
    this.searchFun();
  },
  methods: {
    /**
     * 分页查询
     * */
    getListData: function (page, size) {
      var jsondata = this.request;
      jsondata.pageNo = page;
      jsondata.pageSize = size;
      var self = this;
      this.$httpUtil.post({
        url: "/billInfo/searchByPage.json",
        data: jsondata,
        contentType: "form",
        loading: false, //不显示遮罩层
        succ: function (data) {
          self.tableData = {
            data: data.data.records,
            records: data.data.total
          };
        }
      });
    },
    searchFun: function (supplyId) {
      if (supplyId != null && supplyId != "") {
        this.request.supplyId = supplyId;
      }
      this.getListData(this.billConfig.page, this.billConfig.pagesize);
    },
    cityChange(val) {
      if (val.cityId > 0) {
        this.request.billCityId = val.cityId;
        return;
      } else if (val.provinceId > 0) {
        this.request.billCityId = null;
        return;
      }
      this.request.billCityId = null;
    },
    /**
     * excel导出
     */
    exportBillInfo() {
      var self = this;
      var jsondata = self.request;
      this.$httpUtil.post({
        url: "/billInfo/searchList.json",
        data: jsondata,
        contentType: "json", //json,form,multipart
        succ: function (data) {
          var config = self.$metadata.billInfoExport;
          exportUtil.exportByConfig(self, data.data, config);
        }
      });
    },
    /**
     * 取消
     * */
    cancel(row) {
      var self = this;
      this.$confirm("确认取消费用单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            this.$httpUtil.post({
              contentType: "form",
              url: "/billInfo/auditReject.json",
              data: {
                id: row.id
              },
              succ: function (data) {
                self.success("取消成功", self.getListData);
              }
            });
          });
    },
    modeValid(mode) {
      return this.pageMode === Number(mode);
    },
  }
};
</script>
