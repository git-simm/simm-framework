<template>
  <section class="content-section">
    <SuplierAccount @getListData="getListData" ref="SuplierAccount"></SuplierAccount>
    <PlatformRatio @getListData="getListData" ref="PlatformRatio"></PlatformRatio>
    <el-row class="search-form">
      <el-form
        :model="request"
        label-width="150px"
        class="demo-ruleForm el-drawer__body mini"
        @keyup.native.enter="searchFun"
      >
        <el-row>
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
              <el-select v-model="request.merchantModel" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in $cacheUtil.getDic('settltType')"
                  :key="'settltType' + index"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="pageMode !== 4">
            <el-form-item label="审核状态">
              <sxh-checkbox-group dic="biz_status" v-model="request.bizStatusList"></sxh-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="是否分账">
              <sxh-checkbox-group dic="is_sub_account" v-model="request.accountTypeList"></sxh-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="pull-right" style="padding-bottom:10px;">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜 索</el-button>
              <el-button
                v-permission="
                  $permission.getCode(modeValid, {
                    1: `supply_export_1`,
                    2: `supply_export`,
                    3: `supply_export_3`,
                    4: `supply_export_4`,
                  })
                "
                type="primary"
                class="btn-default"
                icon="el-icon-download"
                @click="excelExport()"
              >导 出</el-button>
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                style="margin-left: 10px;"
                @click="$refs.adviceSearch.showDrawer()"
              >高级搜索</el-button>
              <supply-search-advice
                ref="adviceSearch"
                :baseData="{ supplyData }"
                @confirm="adviceSearchFunc"
              ></supply-search-advice>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-row>
        <el-col :span="24">
          <span
            v-permission="
              $permission.getCode(modeValid, {
                1: `supply_add_1`,
                2: `supply_add`,
                3: `supply_add_3`,
              })
            "
          >
            <router-link to="/suplier/add">
              <el-button type="primary" class="btn-default" icon="el-icon-plus">新增供应商</el-button>
            </router-link>
          </span>
          <span
            v-permission="
              $permission.getCode(modeValid, {
                1: `batch_generate_subaccount_1`,
                2: `batch_generate_subaccount`,
                3: `batch_generate_subaccount_3`,
              })
            "
          >
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-s-check"
              @click="batchGenerateSubAccount()"
            >批量生成交行子账户</el-button>
          </span>
          <div class="pull-right">
            <sxh-help code="060201"></sxh-help>
          </div>
        </el-col>
      </el-row>
      <sxh-table ref="supplyTable" :dataSource="data" :config="config">
        <el-table-column label="供应商信息" width="220" prop="date">
          <template slot-scope="scope">
            编码:{{ scope.row.supply_number }}
            <br />
            名称:{{ scope.row.supply_name }}
            <br />销售模式:
            <el-tag
              size="mini"
              effect="plain"
              title="销售模式"
            >{{ $cacheUtil.getVal("settltType", scope.row.merchant_model) }}</el-tag>
            <br />类型:
            <el-tag size="mini" effect="plain" title="类型">
              {{
              $cacheUtil.getVal("supply_identity", scope.row.supply_identity)
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="contact_email" width="200">
          <template slot-scope="scope">
            结算邮箱：{{ scope.row.contact_email }}
            <br />
            收货邮箱：{{ scope.row.receive_email }}
          </template>
        </el-table-column>
        <el-table-column label="供应商归属" width="80">
          <template slot-scope="scope">
            {{
            $cacheUtil.getVal(
            "supply_direct_purchasing",
            scope.row.is_direct_purchasing
            )
            }}
          </template>
        </el-table-column>
        <el-table-column label="是否分账" width="80">
          <template
            slot-scope="scope"
          >{{ $cacheUtil.getVal("is_sub_account", scope.row.is_sub_account) }}</template>
        </el-table-column>
        <el-table-column label="结算状态" width="100">
          <template slot="header">
            <span>结算状态</span>
            <sxh-popover
              tooltip="<span style='color: #ff0000'>挂起</span>：供应商有结算单被挂起<br/>正常：供应商所有结算均正常"
              :tooltip-width="260"
            ></sxh-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.settleStatus == true" style="color: #ff0000">挂起</span>
            <span v-if="scope.row.settleStatus == false">正常</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人信息" width="150">
          <template slot-scope="scope">
            姓名：{{ scope.row.contact_person }}
            <br />
            电话：{{ scope.row.contact_phone }}
          </template>
        </el-table-column>
        <el-table-column label="创建人信息" width="150">
          <template slot-scope="scope">
            姓名：{{ scope.row.admin_user_name }}
            <br />
            电话：{{ scope.row.admin_user_mobile }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template
            slot-scope="scope"
          >{{ $cacheUtil.getVal("account_status_type", scope.row.status) }}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="120">
          <template slot-scope="scope">
            <sxh-process
              process-enum="SUPPLY_AUDIT"
              :key="`supply_process_` + scope.row.id"
              :ref-id="scope.row.id"
              :process-status="scope.row.process_status"
            >
              <span v-if="scope.row.biz_status">
                {{
                $cacheUtil.getVal("biz_status", scope.row.biz_status)
                }}
              </span>
            </sxh-process>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <sxh-detail-view
              comp="supplyView"
              :view-param="{
                id: scope.row.id,
                number: scope.row.supply_number,
              }"
            ></sxh-detail-view>

            <span
              v-permission="
                $permission.getCode(modeValid, {
                  4: `contract_detail_4`,
                })
              "
            >
              <el-button
                plain
                size="minier"
                @click="contractDetail(scope.row, 'view')"
                v-if="scope.row.biz_status == 11"
              >续签查看</el-button>
            </span>
            <span
              v-permission="
                $permission.getCode(modeValid, {
                  4: `contract_audit_4`,
                })
              "
            >
              <el-button
                plain
                size="minier"
                @click="contractDetail(scope.row, 'audit')"
                v-if="scope.row.sysReNewAudit != null && scope.row.biz_status == 11"
              >续签审核</el-button>
            </span>
            <span
              v-permission="
                $permission.getCode(modeValid, {
                  1: `supply_platform_1`,
                  2: `supply_platform_2`,
                  3: `supply_platform_3`,
                })
              "
            >
              <el-button
                plain
                size="minier"
                @click="toSupplyPlatForm(scope.row)"
                v-if="
                  scope.row.is_sub_account == 1 && scope.row.process_status == 3
                "
              >供应商平台</el-button>
            </span>
            <span>
              <el-button
                plain
                size="minier"
                @click="uploadBail(scope.row)"
                v-if="
                  scope.row.biz_status === 5 &&
                    userInfo.id == scope.row.admin_user_id
                "
              >上传保证金</el-button>
            </span>
            <span
              v-permission="
                $permission.getCode(modeValid, {
                  1: `suplier_manager_audit_1`,
                  2: `suplier_manager_audit`,
                  3: `suplier_manager_audit_3`,
                })
              "
            >
              <span v-if="scope.row.sysAudit != null">
                <el-button
                  plain
                  size="minier"
                  @click="ableFun(scope.row)"
                  v-if="
                    scope.row.process_status == 1 ||
                      scope.row.process_status == 2
                  "
                >审核通过</el-button>
                <el-button
                  plain
                  size="minier"
                  @click="callBackFun(scope.row)"
                  v-if="
                    scope.row.process_status == 1 ||
                      scope.row.process_status == 2
                  "
                >审核打回</el-button>
              </span>
            </span>
            <el-button
              plain
              size="minier"
              @click="cancelAudit(scope.row.id)"
              v-if="scope.row.process_status == 1 && checkCreator(scope.row)"
            >取消审核</el-button>
            <el-button
              plain
              size="minier"
              @click="deleteSupply(scope.row.id)"
              v-if="
                (scope.row.process_status == -2 ||
                  scope.row.process_status === 0) &&
                  checkCreator(scope.row)
              "
            >删除</el-button>
            <span v-if="scope.row.process_status == 3">
              <span
                v-permission="
                  $permission.getCode(modeValid, {
                    1: `supply_disable_purchase_1`,
                    2: `supply_disable_purchase`,
                    3: `supply_disable_purchase_3`,
                  })
                "
              >
                <el-button
                  plain
                  size="minier"
                  @click="handStatus(scope.row, 4)"
                  v-if="scope.row.status == 1"
                >禁用采购</el-button>
              </span>
            </span>
            <sxh-dropdown :key="`${scope.row.id}-${Math.random()}`">
              <el-dropdown-item
                v-if="
                  scope.row.process_status == -2 ||
                    scope.row.process_status == 0
                "
              >
                <router-link
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `suplier_manager_list_edit_1`,
                      2: `suplier_manager_list_edit`,
                      3: `suplier_manager_list_edit_3`,
                    })
                  "
                  :to="'/suplier/edit/' + scope.row.id"
                >
                  <span>编辑</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.process_status == 3">
                <router-link
                  :to="'/suplier/edit/' + scope.row.id"
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `suplier_manager_list_modify_1`,
                      2: `suplier_manager_list_modify`,
                      3: `suplier_manager_list_modify_3`,
                    })
                  "
                >
                  <span>修改</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status == 1 || scope.row.status == -1">
                <div
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `supply_change_settle_day_1`,
                      2: `supply_change_settle_day`,
                      3: `supply_change_settle_day_3`,
                    })
                  "
                  @click="changeSettleDay(scope.row)"
                >修改账期</div>
              </el-dropdown-item>
              <el-dropdown-item
                v-permission="
                  $permission.getCode(modeValid, {
                    1: `supply_change_balance_1`,
                    2: `supply_change_balance`,
                    3: `supply_change_balance_3`,
                  })
                "
              >
                <div @click="changeSupplyBalance(scope.row)">修改余额</div>
              </el-dropdown-item>
              <!-- 启用供应商 -->
              <el-dropdown-item
                v-if="
                  scope.row.process_status == 3 &&
                    (scope.row.status == -1 ||
                      scope.row.status == 0 ||
                      scope.row.status == 4)
                "
              >
                <div
                  @click="handStatus(scope.row, 1)"
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `supply_enable_1`,
                      2: `supply_enable`,
                      3: `supply_enable_3`,
                    })
                  "
                >启用</div>
              </el-dropdown-item>
              <!-- 禁用供应商 -->
              <el-dropdown-item v-if="scope.row.status == 1">
                <span
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `supply_disable_1`,
                      2: `supply_disable`,
                      3: `supply_disable_3`,
                    })
                  "
                  @click="handStatus(scope.row, -1)"
                >禁用</span>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  scope.row.process_status == 3 && scope.row.merchant_model == 1
                "
              >
                <div
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `supply_change_subinfo_1`,
                      2: `supply_change_subinfo`,
                      3: `supply_change_subinfo_3`,
                    })
                  "
                  @click="changeSubInfo(scope.row.id, scope.row.is_sub_account)"
                >分账管理</div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  scope.row.account_create_status == 0 &&
                    scope.row.status == 1 &&
                    scope.row.process_status == 3 &&
                    scope.row.is_sub_account == 1
                "
              >
                <div
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `supply_creat_accout_1`,
                      2: `supply_creat_accout`,
                      3: `supply_creat_accout_3`,
                    })
                  "
                  @click="
                    creatAccout(
                      scope.row.id,
                      scope.row.platform_account,
                      scope.row.account_status_update_at
                    )
                  "
                >生成账号</div>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  scope.row.comm_account_status == 0 &&
                    scope.row.status == 1 &&
                    scope.row.process_status == 3 &&
                    scope.row.is_sub_account == 1
                "
              >
                <div
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `comm_creat_accout_1`,
                      2: `comm_creat_accout`,
                      3: `comm_creat_accout_3`,
                    })
                  "
                  @click="creatCOMMAccount(scope.row.id)"
                >生成交行账号</div>
              </el-dropdown-item>
              <!-- TODO 按钮权限 -->
              <el-dropdown-item
                v-if="
                  scope.row.status == 1 &&
                    scope.row.process_status == 3 &&
                    scope.row.biz_status == 10
                "
              >
                <div
                  v-permission="
                    $permission.getCode(modeValid, {
                      1: `contract_extension_1`,
                      2: `contract_extension`,
                      3: `contract_extension_3`,
                      4: `contract_extension_4`,
                    })
                  "
                  @click="contractExtension(scope.row)"
                >合同续签</div>
              </el-dropdown-item>
            </sxh-dropdown>
          </template>
        </el-table-column>
      </sxh-table>
    </div>
  </section>
</template>

<script>
import { doExcelExport } from "../../common/util.js";
import SuplierAccount from "./controls/suplier-account";
import PlatformRatio from "./controls/platform-ratio";
import supplySearchAdvice from "./supply-search-advice";
import AuditHandler from "./list-audit";

export default {
  name: "suplierList",
  components: {
    supplySearchAdvice,
    SuplierAccount: SuplierAccount,
    PlatformRatio: PlatformRatio
  },
  mixins: [AuditHandler],
  props: {
    //页面模式 1：代理;2:团购;3:直购
    pageMode: {
      required: false,
      type: Number,
      default: 2 //默认为团购模式
    }
  },
  data: function(router) {
    return {
      response: "",
      dataReserve1: 0,
      request: {
        supply_name: "",
        supply_number: "",
        contact_person: "",
        contact_phone: "",
        merchantModel: "",
        accountTypeList: [],
        processStatusList: [],
        bizStatusList: [],
        supply_identity: "",
        special_type: "",
        supply_type: "",
        group_id: "",
        process_status: "",
        is_direct_purchasing: null
      },
      data: {},
      adviceRequest: null,
      supplyData: [],
      dataList: [],
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      userInfo: this.$store.state.userInfo,
      // 区分模式
      contractOpeModel: {
        VIEW: "view",
        EDIT: "edit"
      }
    };
  },
  created: function() {
    this.getSupplyData();
    this.getData();
  },
  activated() {
    this.getData();
  },
  methods: {
    /**
     * 合同续签
     */
    contractExtension(row) {
      var self = this;
      this.$commonUtil.win.contractExtension(
        self, // 当前VUE对象
        row, // 供应商信息
        // 成功后回调
        () => {
          self.getListData();
          self.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      );
    },
    /**
     * 查看&审核
     */
    contractDetail(row, opeModel) {
      var self = this;
      this.$commonUtil.win.contractDetail(
        self, // 当前VUE对象
        row, // 供应商信息
        opeModel,
        // 提交 更新列表
        () => {
          self.getListData();
          self.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      );
    },

    creatCOMMAccount(supplyId) {
      var self = this;
      self
        .$confirm("确认生成交行子账户?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 请求
          var self = this;
          this.$httpUtil.post({
            url: "/supplyInfo/intiSupplyCOMMAccount.json",
            data: {
              id: supplyId
            },
            contentType: "form", //json,form,multipart
            succ: function(data) {
              self.$message({
                type: "success",
                message: "操作成功!"
              });
            }
          });
        })
        .catch();
    },
    getData() {
      this.getListData();
    },
    /**
     * 页面校验
     */
    modeValid(mode) {
      return this.pageMode === Number(mode);
    },
    //获取供应商信息
    getSupplyData: function(key_word) {
      var self = this;
      var store = this.$store;
      this.$httpUtil.post({
        url: "/supplyInfo/addlist.json",
        data: {
          key_word: key_word
        },
        contentType: "form", //json,form,multipart
        succ: function(data) {
          self.supplyData = data.data;
        }
      });
    },
    /**
     * operaType  1-启用 -1-禁用  4-仅禁用采购
     */
    handStatus(item, operaType) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/updateSupplyStatus.json",
        data: {
          id: item.id,
          status: operaType
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
    },
    handleCurrentChange(val) {
      if (this.adviceRequest) {
        this.adviceRequest.page = val;
      }
      this.request.page = val;
      sessionStorage.setItem("suplier_list_current_page", val);
      this.getListData();
    },
    /**
     * 获取过滤条件
     */
    getFilter() {
      var filter = this.adviceRequest || this.request;
      //代理，团购，直购的数据分离开
      filter.pageMode = this.pageMode;
      if (this.pageMode == 4) {
        filter.bizStatus = 11;
      }
      return filter;
    },
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = self.getFilter();
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.pager = {
        pageNo: page,
        pageSize: size
      };
      this.$httpUtil.post({
        url: "/supplyInfo/groupList.json",
        data: jsondata,
        succ: function(data) {
          self.data = data;
        }
      });
    },

    checkCreator: function(item) {
      var id = this.$store.state.userInfo.id;
      return item.admin_user_id == id;
    },

    getListData: function() {
      if (this.$refs.supplyTable) {
        this.$refs.supplyTable.setPage(1);
      }
      this.getPagerListData(1, this.config.pagesize);
    },
    searchFun: function() {
      //清空高级搜索条件
      this.adviceRequest = null;
      sessionStorage.setItem("suplier_request", JSON.stringify(this.request));
      this.getListData();
    },
    adviceSearchFunc(param) {
      this.adviceRequest = param;
      this.getListData();
    },
    excelExport() {
      var self = this;
      var jsonData = self.getFilter();
      this.$httpUtil.export({
        url: "/report/exportSupplyInfo.json",
        data: jsonData
        // contentType: 'form', //json,form,multipart
      });
    },
    changeSubInfo(id, isSubAccount) {
      this.$refs.PlatformRatio.setVisible(
        true,
        id,
        isSubAccount
        //platformRatio
      );
    },
    deleteSupply(id) {
      var self = this;
      this.$commonUtil.message.confirm("确定删除供应商?", () => {
        self.$httpUtil.post({
          url: "/supplyInfo/deleteSupply.json",
          data: {
            id: id
          },
          contentType: "form",
          succ: function(data) {
            self.$message({
              message: "删除成功",
              type: "success"
            });
            self.getListData();
          }
        });
      });
    }
  }
};
</script>
