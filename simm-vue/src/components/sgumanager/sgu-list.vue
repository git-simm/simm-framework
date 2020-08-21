<template>
  <section class="content-section prod-content">
    <el-row :gutter="20" class="search-form el-drawer__body">
      <el-form
        :model="request"
        label-width="120px"
        class="demo-ruleForm"
        @submit.native.prevent="searchFun"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="SKU编码">
              <el-input type="textarea" :rows="4" v-model="request.skuNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SGU编码">
              <el-input type="textarea" :rows="4" v-model="request.sguNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SGU名称">
              <el-input placeholder="请输入SGU名称" v-model.trim="request.sguName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称">
              <el-select v-model="request.supplyId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="(item, key) in supplyData"
                  :key="key"
                  :label="item.supply_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上架时间">
              <sxh-date
                v-model="request.timeArr"
                controlType="daterange"
                @change="
                  arr => {
                    request.beginDate = arr[0];
                    request.endDate = arr[1];
                  }
                "
              ></sxh-date>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="审核状态">
              <sxh-checkbox-group dic="prod_audit_status" v-model="request.processStatusList"></sxh-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="pull-right" style="padding-bottom:10px;">
              <!-- <sxh-help code="000002"></sxh-help> -->
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜索</el-button>
              <el-button
                v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_manager_export`,
                    2: `sgu_manager_export_2`,
                    3: `sgu_manager_export,sgu_manager_export_2`
                  })
                "
                type="primary"
                class="btn-default"
                icon="el-icon-download"
                @click="excelExport()"
              >导出</el-button>
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                style="margin-left: 10px;"
                @click="$refs.adviceSearch.showDrawer()"
              >高级搜索</el-button>
              <sgu-search-advice
                ref="adviceSearch"
                :baseData="{ supplyData }"
                @confirm="adviceSearchFunc"
              ></sgu-search-advice>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <div class="row">
        <div class="col-md-9">
          <span v-if="searchModel == 1">
            <el-button
              v-permission="
              $permission.getCode(modeValid, {
                1: `sguBatchAudit`,
                2: `sguBatchAudit_2`,
                3: `sguBatchAudit,sguBatchAudit_2`
              })
            "
              type="primary"
              @click="allAudit"
              class="btn-default"
            >批量审核</el-button>
            <el-button
              v-permission="
              $permission.getCode(modeValid, {
                1: `sgu_batch_sort`,
                2: `sgu_batch_sort_2`,
                3: `sgu_batch_sort,sgu_batch_sort_2`
              })
            "
              @click="allSort"
              class="btn-default"
            >
              <i class="el-icon-sort"></i>批量排序
            </el-button>
            <span v-if="userInfo.roleType===2 && userInfo.isAgent===1">
              <el-dropdown
                trigger="hover"
                v-permission="
              $permission.getCode(modeValid, {
                1: `sgu_batch_time_24`,
                2: `sgu_batch_time_24_2`,
                3: `sgu_batch_time_24,sgu_batch_time_24_2`
              })
            "
              >
                <el-button type="primary">
                  <i class="el-icon-alarm-clock"></i>
                  24小时售卖
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-top" @click.native="onSale(1,0)">
                    <sxh-popover
                      tooltip="本操作针对<b style='color:red;'>已下架、待上架</b>状态的SGU做批量上架信息设置"
                      :tooltip-width="300"
                    >上架设置</sxh-popover>
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-bottom" @click.native="takenOff(0,0)">
                    <sxh-popover
                      tooltip="本操作针对<b style='color:red;'>上架中、待上架</b>状态的SGU做批量上架信息设置"
                      :tooltip-width="300"
                    >下架设置</sxh-popover>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            <span v-if="userInfo.roleType===2 && userInfo.isAgent===1">
              <el-dropdown
                trigger="hover"
                v-permission="
              $permission.getCode(modeValid, {
                1: `sgu_batch_time_cycle`,
                2: `sgu_batch_time_cycle_2`,
                3: `sgu_batch_time_cycle,sgu_batch_time_cycle_2`
              })
            "
              >
                <el-button type="primary">
                  <i class="el-icon-timer"></i>
                  分时段售卖
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-top" @click.native="onSale(1,1)">
                    <sxh-popover
                      tooltip="本操作针对<b style='color:red;'>已下架、待上架</b>状态的SGU做批量上架信息设置"
                      :tooltip-width="300"
                    >上架设置</sxh-popover>
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-bottom" @click.native="takenOff(0,1)">
                    <sxh-popover
                      tooltip="本操作针对<b style='color:red;'>上架中、待上架</b>状态的SGU做批量上架信息设置"
                      :tooltip-width="300"
                    >下架设置</sxh-popover>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            <span style="margin-left:20px;">
              <el-link @click="showSummary" icon="el-icon-s-data">上架情况</el-link>
            </span>
          </span>
        </div>
        <div class="col-md-3">
          <div class="pull-right">
            <sxh-help code="030401"></sxh-help>
            <span v-if="this.$store.state.userInfo.roleType == 2">
              <el-button
                v-permission="
                  $permission.getCode(modeValid, {
                    1: `sgu_manager_changeSearchModel_1`,
                    2: `sgu_manager_changeSearchModel_2`,
                    3: `sgu_manager_changeSearchModel_1,sgu_manager_changeSearchModel_2`
                  })
                "
                @click="changeSearchModel()"
              >
                <span v-if="this.$store.state.userInfo.roleType == 2">
                  <span v-if="searchModel == 1">
                    <i class="el-icon el-icon-s-grid" />商品模式
                  </span>
                  <span v-if="searchModel == 2">
                    <i class="el-icon el-icon-menu" />SGU模式
                  </span>
                </span>
              </el-button>
            </span>
          </div>
        </div>
      </div>
      <sxh-table
        :dataSource="data"
        ref="multipleTable"
        :config="config"
        @selectedChange="handleSelectionChange"
        @expand-change="getProdList"
        v-if="searchModel == 1"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 未提交时，没有明细 -->
            <sgu-list-prod :sgu="scope.row" v-if="scope.row.processStatus!==0"></sgu-list-prod>
          </template>
        </el-table-column>
        <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
        <el-table-column label="SGU主图">
          <template slot-scope="scope">
            <img :src="scope.row.mainImageUrl" alt />
          </template>
        </el-table-column>
        <el-table-column prop="sguNumber,sguName" label="SGU信息" width="190">
          <template slot-scope="scope">
            <span>编码：{{ scope.row.sguNumber }}</span>
            <br />
            <span>名称：{{ scope.row.sguName }}</span>
            <br />
            <span v-if="scope.row.isAgent != 1">
              <el-tag size="mini" effect="plain" title="销售模式">
                {{
                $cacheUtil.getVal("sale_type", scope.row.saleType)
                }}
              </el-tag>
            </span>
            <span v-if="scope.row.isAgent === 1">
              <el-tag size="mini" effect="plain" title="上架模式">
                {{
                $cacheUtil.getVal("is_cycle_onsale", scope.row.isCycleOnSale)
                }}
              </el-tag>
            </span>
            <span v-if="scope.row.distributionType === 0">
              <el-tag size="mini" effect="plain" title="是否次日达">
                {{
                scope.row.isNextDay===1?"次日达":"非次日达"
                }}
              </el-tag>
              <el-tag
                size="mini"
                effect="plain"
                title="是否为换购专区商品"
                v-if="scope.row.exchange === 1"
              >换购专区商品</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="supplyNumber,supplyName" label="供应商信息" width="185">
          <template slot-scope="scope">
            <sxh-detail-view
              comp="supplyView"
              :view-param="{
                id: scope.row.supplyId,
                number: scope.row.supplyNumber,
                isLink: true,
                label: scope.row.supplyNumber
              }"
            ></sxh-detail-view>
            <br />
            <span>名称：{{ scope.row.supplyName }}</span>
            <br />
            <span v-if="scope.row.isAgent === 1">
              <el-tag size="mini" effect="plain" title="是否代理商">
                {{
                $cacheUtil.getVal("is_agent_show", scope.row.isAgent)
                }}
              </el-tag>
            </span>
            <span v-if="scope.row.isAgent != 1">
              <el-tag size="mini" effect="plain" title="业务类型">
                {{
                $cacheUtil.getVal("distribution_type", scope.row.distributionType)
                }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="prod_price" label="订货单价" width="80"></el-table-column>-->
        <!-- :render-header="renderHeader" -->
        <el-table-column prop="creatorName,creatorMobile" label="创建人信息" width="150">
          <template slot-scope="scope">
            <span>姓名：{{ scope.row.creatorName }}</span>
            <br />
            <span>手机号：{{ scope.row.creatorMobile }}</span>
            <br />
            <el-tag size="mini" effect="plain" title="数据归属">
              <span v-if="scope.row.creatorRole == 0">总部</span>
              <span v-if="scope.row.creatorRole == 3">直购</span>
              <span
                v-if="scope.row.creatorRole == 1 || scope.row.creatorRole == 2"
              >{{ scope.row.siteName }}</span>
              <span v-if="scope.row.creatorRole == 2">-{{ scope.row.cityName }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="onSaleTime,takenOffTime" label="上下架时间" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.isCycleOnSale === 0">
              <span>上架：{{ scope.row.onSaleTime }}</span>
              <br />
              <span>下架：{{ scope.row.takenOffTime }}</span>
            </span>
            <span v-if="scope.row.isCycleOnSale === 1">
              <span>开始：{{ scope.row.cycleStartDate }}</span>
              <br />
              <span>结束：{{ scope.row.cycleEndDate }}</span>
              <br />
              <span>售卖：{{ scope.row.cycleStartTime }} - {{ scope.row.cycleEndTime }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{
            scope.row.onSale == 1
            ? "上架"
            : scope.row.onSale == 0
            ? "下架"
            : "待上架"
            }}
          </template>
        </el-table-column>
        <!--<el-table-column label="是否显示小程序">
                        <template  slot-scope="scope">{{scope.row.importEs==1?"已导入":"未导入"}}</template>
        </el-table-column>-->
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <sxh-process
              process-enum="SGU_AUDIT"
              :key="`sgu_process_` + scope.row.id"
              :ref-id="scope.row.id"
              :process-status="scope.row.processStatus"
            ></sxh-process>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序码"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <sxh-detail-view
              comp="sguView"
              :view-param="{ id: scope.row.id, number: scope.row.sguNumber }"
            ></sxh-detail-view>
            <sgu-list-oper
              :scope="scope"
              :pageMode="pageMode"
              :baseData="{onSaleOpera:onSaleOpera}"
              @refresh="getListData"
              :key="Math.random()"
            ></sgu-list-oper>
          </template>
        </el-table-column>
      </sxh-table>
      <sgu-prod-mode-list ref="sguProdMode" v-else :getFilter="this.getFilter"></sgu-prod-mode-list>
    </div>
  </section>
</template>

<style>
.prod-content img {
  height: 60px;
  max-width: 60px;
}
</style>

<script>
import sguSearchAdvice from "./sgu-search-advice";
import sguListHandler from "./sgu-list-handler";
import sguListValid from "@/components/sgumanager/sgu-list-valid";
import sguListSaletimeHandler from "./sgu-list-saletime-handler";
import sguProdModeList from "./sgu-prod-mode-list";
import sguListOper from "@/components/sgumanager/sgu-list-oper";
import sguListProd from "@/components/sgumanager/sgu-list-prod";
import moment from "moment";
import sguEditBase from "@/components/sgumanager/sgu-edit-base";
export default {
  name: "SguList",
  components: {
    sguSearchAdvice,
    sguProdModeList,
    sguListOper,
    sguListProd
  },
  mixins: [sguListHandler, sguListValid, sguListSaletimeHandler, sguEditBase],
  props: {
    filter: {
      type: Object,
      required: false,
      default: null
    },
    prodId: {
      required: false,
      type: Number,
      default: null
    },
    onsaleStatus: {
      required: false,
      type: Array,
      default: null
    },
    dateClear: {
      required: false,
      type: Boolean,
      default: false
    },
    prodNumber: {
      required: false,
      type: String,
      default: ""
    },
    //页面模式 1：非团购包邮;2:团购包邮;3:从商品查看页过来，需要看到所有的商品;
    pageMode: {
      required: false,
      type: Number,
      default: 1 //默认非团购包邮
    }
  },
  data: function(router) {
    return {
      config: {
        getListData: this.getPagerListData,
        simplePager: true,
        multiple: true,
        showCheckbox: false,
        page: 1,
        pagesize: 10
      },
      selectedRows: [],
      supplyData: [],
      timedate: [],
      records: null,
      searchModel: 1,
      adviceRequest: null,
      request: {
        prodId: this.prodId,
        supplyId: "",
        supplyNumber: "",
        sguName: "",
        sguNumber: "",
        skuNumber: this.prodNumber,
        onSale: "",
        processStatus: "",
        timeArr: [],
        beginDate: null,
        endDate: null,
        distributionType: "",
        saleType: "",
        createRole: ""
      },
      data: {},
      userInfo: this.$store.state.userInfo,
      sguBaseProd: []
    };
  },
  created() {
    if (!this.dateClear) {
      var d = new Date();
      var start = new Date();
      var end = new Date();
      start.setDate(start.getDate() - 4);
      end.setDate(end.getDate() + 3);
      // start.setMonth(start.getMonth() - 2);
      // end.setMonth(end.getMonth() + 1);
      this.request.timeArr = [start, end];
      this.request.beginDate = moment(start).format("YYYY-MM-DD 00:00:00");
      this.request.endDate = moment(end).format("YYYY-MM-DD 23:59:59");
    }
  },
  mounted() {
    this.getData();
  },
  activated() {
    this.searchFun();
  },
  methods: {
    getData() {
      this.getListData();
      this.getCountData();
      this.getSupplyData();
    },

    /**
     * 处理选中项
     */
    handleSelectionChange: function(val) {
      this.selectedRows = val;
    },
    selectable(row, index) {
      if (
        this.userInfo.isAgent === 1 &&
        row.processStatus === 3 &&
        this.userInfo.roleType === row.creatorRole &&
        (row.addressProvinceId === this.userInfo.supply_site_id ||
          row.addressCityId === this.userInfo.cityId)
      ) {
        return true;
      }
      return null != row.sysAudit;
    },
    /*
     * 搜索
     * */
    search: function(data) {
      if (this.searchModel == 1) {
        //回到首页
        if (this.$refs.multipleTable) {
          this.config.page = 1;
          this.$refs.multipleTable.setPage(1);
        }
        this.getListData();
      } else {
        this.$refs.sguProdMode.search(data);
      }
    },
    /**
     * 高级搜索
     */
    adviceSearchFunc(param) {
      this.adviceRequest = param;
      this.search(this.adviceRequest);
    },
    searchFun: function() {
      this.adviceRequest = null;
      this.search(this.request);
    },
    changeSearchModel() {
      var self = this;
      if (self.$store.state.userInfo.roleType != 2) {
        this.$commonUtil.valid.throwEx("只有城市账号可查看商品模式");
      }
      if (self.searchModel == 1) {
        self.searchModel = 2;
      } else {
        self.searchModel = 1;
      }
      this.adviceRequest = null;
      this.$nextTick(() => {
        self.search(self.request);
      });
    }
  }
};
</script>
