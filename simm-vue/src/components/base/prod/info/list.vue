<template>
  <section class="content-section sku-import">
    <div class="search-form el-drawer__body">
      <el-form
        :model="request"
        :rules="rules"
        ref="request"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="SKU编码">
              <el-input
                type="textarea"
                placeholder="请输入SKU编码"
                :rows="4"
                v-model="request.prod_number"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SPU编码">
              <el-input
                type="textarea"
                placeholder="请输入SPU编码"
                :rows="4"
                v-model="request.spuNumber"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input placeholder="请输入商品名称" v-model.trim="request.product_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-input placeholder="请输入创建人姓名" v-model.trim="request.creatorName"></el-input>
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
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜 索</el-button>
              <el-button
                v-permission:sku_export
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
              <sku-search-advice
                ref="adviceSearch"
                @confirm="adviceSearchFunc"
                :append-to-body="appendToBody"
              ></sku-search-advice>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="search-table">
      <!-- 拆分码管理 -->
      <router-link to="/assemble/apply" v-permission:sku_wrap_req>
        <el-button type="primary" class="btn-default">组合申请</el-button>
      </router-link>
      <el-button
        v-permission:skuBatchAudit
        type="primary"
        @click="allAudit"
        class="btn-default"
      >批量审核</el-button>
      <sxh-excel-import
        v-permission:skuBatchCanBuy
        label="批量设置采销状态"
        :tooltip="tooltip"
        :tooltip-width="400"
        :post-data="postData"
        :show-fields="requiredFields"
        :row-valid="rowValid"
      />
      <div class="search-table">
        <sxh-table
          ref="skuList"
          :config="config"
          :dataSource="infoData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
          <el-table-column prop="categoryName" label="类目" width="120">
            <template slot-scope="scope">
              <span>一级：{{ scope.row.categoryName }}</span>
              <div v-if="scope.row.twoCategoryName > ''">二级：{{ scope.row.twoCategoryName }}</div>
              <div v-if="scope.row.threeCategoryName > ''">三级：{{ scope.row.threeCategoryName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="prodNumber" label="SKU信息" width="200">
            <template slot-scope="scope">
              <span>
                {{ scope.row.prodNumber }}
                <el-tag
                  size="mini"
                  effect="plain"
                  title="商品属性"
                >{{ $cacheUtil.getVal('storage_method',scope.row.storageMethod )}}</el-tag>
              </span>
              <br />
              <span>{{ scope.row.productName }}</span>
              <div v-if="scope.row.barCode > ''">条形码：{{ scope.row.barCode }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="spuNumber" label="SPU信息" width="180">
            <template slot-scope="scope">
              <sxh-detail-view
                comp="spuView"
                :view-param="{
                  id: scope.row.spuId,
                  number: scope.row.spuNumber,
                  isLink: true,
                  label: scope.row.spuNumber
                }"
              />
              <br />
              <span>{{ scope.row.jointName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" label="品牌"></el-table-column>
          <el-table-column prop="placeName" label="产地"></el-table-column>
          <el-table-column prop="stock" label="库存" :key="Math.random()" v-if="canQueryStock">
            <template slot-scope="scope">
              <sxh-sku-stock
                :key="`sku_stock_` + scope.row.id"
                :sku-number="scope.row.prodNumber"
                :stock-list="scope.row.baseProdStocks"
              ></sxh-sku-stock>
            </template>
          </el-table-column>
          <el-table-column label="单位" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="saleTypeNameList"
            label="上架方式"
            :key="Math.random()"
            v-if="canQueryStock"
          >
            <template slot-scope="scope">
              <sxh-detail-view
                comp="skuViewTab"
                v-if="scope.row.saleTypeNameList > ''"
                :view-param="{
                  number: scope.row.prodNumber,
                  tab: `onsaleSguList`,
                  isLink: true,
                  label: scope.row.saleTypeNameList
                }"
              />
              <span v-else>未上架</span>
            </template>
          </el-table-column>
          <el-table-column label="采销状态" width="100">
            <template slot-scope="scope">
              <!-- 审批通过后显示状态 -->
              <span v-if="scope.row.processStatus == 3">
                <span>
                  {{
                  scope.row.canBuy === 1 ? "可订货" : "不可订货"
                  }}
                </span>
                <br />
                <span>
                  {{
                  scope.row.canSale === 1 ? "可销售" : "不可销售"
                  }}
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建人信息" width="150">
            <template slot-scope="scope">
              <span>名称：{{ scope.row.adminUserName }}</span>
              <br />
              <span>手机：{{ scope.row.adminUserMobile }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="tax" label="税率"></el-table-column> -->
          <el-table-column prop="processStatus" label="审核状态" width="80">
            <template slot-scope="scope">
              <sxh-process
                process-enum="SKU_AUDIT"
                :key="`sku_process_` + scope.row.id"
                :ref-id="scope.row.id"
                :process-status="scope.row.processStatus"
              ></sxh-process>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- SKU编码按钮 -->
              <sxh-detail-view comp="skuView" :view-param="{ number: scope.row.prodNumber }"></sxh-detail-view>
              <!-- 审核通过，且允许采购 或 允许销售，才能显示使用按钮 -->
              <span v-permission:sku_use>
                <el-button
                  plain
                  size="minier"
                  class="page"
                  @click="handUse(scope.row)"
                  v-if="
                    (scope.row.categoryId != null || '') &&
                      scope.row.spuNumber > '' &&
                      addProdPage &&
                      scope.row.processStatus == 3 &&
                      (scope.row.canBuy === 1 || scope.row.canSale === 1)
                  "
                >使用</el-button>
              </span>
              <span v-permission:skuAudit>
                <span v-if="null != scope.row.sysAudit">
                  <el-button
                    plain
                    size="minier"
                    @click="auditSku(scope.row)"
                    v-if="scope.row.categoryId != null || ''"
                  >审核通过</el-button>
                  <el-button
                    plain
                    size="minier"
                    @click="rejectSku(scope.row)"
                    v-if="scope.row.categoryId != null || ''"
                  >打回</el-button>
                </span>
              </span>
              <span v-if="null != scope.row.sysCommit && scope.row.sysCommit == 1">
                <el-button
                  plain
                  size="minier"
                  @click="commitSku(scope.row)"
                  v-if="scope.row.categoryId != null || ''"
                >提交</el-button>
              </span>
              <span v-if="checkDelete(scope.row)">
                <el-button plain size="minier" @click="logicDelete(scope.row.id)">删除</el-button>
              </span>
              <!-- 创建商品界面跳转过来的，不加载更多操作面板 -->
              <sxh-dropdown
                :key="`${scope.row.id}-${Math.random()}`"
                v-if="!addProdPage && scope.row.processStatus == 3"
              >
                <!-- 可订货控制 -->
                <el-dropdown-item v-permission:prod_updateBuyStatus>
                  <div
                    v-if="!checkCanBuy(scope.row) && scope.row.canBuy === 1"
                    @click="updateBuyStatus(scope.row.id, 0)"
                  >不可订货</div>
                </el-dropdown-item>
                <el-dropdown-item v-permission:prod_updateBuyStatus>
                  <div v-if="scope.row.canBuy !== 1" @click="updateBuyStatus(scope.row.id, 1)">可订货</div>
                </el-dropdown-item>
                <!-- 可销售控制 -->
                <el-dropdown-item v-permission:prod_updateSaleStatus>
                  <div
                    v-if="!checkCanSale(scope.row) && scope.row.canSale === 1"
                    @click="updateSaleStatus(scope.row.id, 0)"
                  >不可销售</div>
                </el-dropdown-item>
                <el-dropdown-item v-permission:prod_updateSaleStatus>
                  <div v-if="scope.row.canSale !== 1" @click="updateSaleStatus(scope.row.id, 1)">可销售</div>
                </el-dropdown-item>
                <!-- 不可买卖时，才允许删除 -->
                <el-dropdown-item v-if="scope.row.canBuy !== 1 && scope.row.canSale !== 1">
                  <div v-permission:prod_logic_delete @click="logicDelete(scope.row.id)">删除</div>
                </el-dropdown-item>
              </sxh-dropdown>
            </template>
          </el-table-column>
        </sxh-table>
      </div>
    </div>
  </section>
</template>

<script>
import skuSearchAdvice from "./sku-search-advice";
import skuListHandler from "./sku-list-handler";
export default {
  name: "SkuList",
  components: { skuSearchAdvice },
  mixins: [skuListHandler],
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Object,
      required: false,
      default: null
    },
    searchParam: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: function() {
    return {
      infoData: {},
      requiredFields: [`SKU编码`, `商品名称`, `可订货`, `可销售`],
      adviceRequest: null,
      selectedRows: [],
      canQueryStock: false,
      addProdPage:
        this.$route.params.fromAddProdPage || this.searchParam.fromAddProdPage,
      config: {
        getListData: this.getPagerListData,
        simplePager: true,
        multiple: true,
        showCheckbox: false,
        page: 1,
        pagesize: 10
      },
      request: {
        prod_number: "",
        spuNumber: "",
        product_name: "",
        creatorName: "",
        processStatusList: [],
        fromAddProdPage: this.addProdPage
      },
      rules: {},
      tooltip: `1、请先点击【导出】按钮导出需要修改的SKU列表；<br/>
      2、导出后上传时，"SKU编码""SKU名称""可订货""可销售"为必填信息；<br/>
      3、只能上传xlx/xlsx文件；`
    };
  },
  created() {
    this.canQueryStock = this.canQueryStockFunc();
    if (this.searchParam.fromAddProdPage) {
      //按spu进行查询
      let spuNumber = this.searchParam.spuNumber;
      if (!spuNumber) {
        this.request.spuNumber = "";
        //spu为空的时候，传入sku
        this.request.prod_number = this.searchParam.prod_number;
      } else {
        this.request.spuNumber = spuNumber;
      }
    } else {
      let id = this.$route.params.id;
      if (!id) {
        this.request.prod_number = "";
      } else {
        this.request.prod_number = id;
      }
    }
    this.getListData();
  },
  activated() {
    this.searchFun();
  },
  methods: {
    checkCanSale: function(item) {
      var summary = 0;
      if ((item.baseProdStocks || []).length > 0) {
        summary = item.baseProdStocks.sum(a => a.inventory);
      }
      if ((item.saleTypeNameList || "").includes("库存")) {
        return true;
      }
      return summary > 0;
    },

    checkCanBuy: function(item) {
      return (item.saleTypeNameList || "").includes("预售");
    },
    /**
     * 是否可以查询库存信息
     */
    canQueryStockFunc() {
      if (this.addProdPage) {
        //新增商品界面跳转过来，不需要查询库存信息
        return false;
      }
      //有控制采销状态，或者有删除SKU权限，则允许查询库存和SGU上架相关信息
      var permissions = [
        "prod_updateBuyStatus",
        "prod_updateSaleStatus",
        "prod_logic_delete"
      ];
      for (var i = 0; i < permissions.length; i++) {
        if (this.$permission.hasPermission(permissions[i])) {
          return true;
        }
      }
      return false;
    },
    handleSelectionChange: function(val) {
      this.selectedRows = val;
    },
    selectable(row, index) {
      return null != row.sysAudit;
    },
    /**
     * 获取SKU列表
     */
    getListData: function() {
      if (this.$refs.skuList) {
        this.$refs.skuList.setPage(1);
      }
      this.getPagerListData(1, this.config.pagesize, null, false);
      this.getCountData();
    },
    /*
     * 获取分页数据
     * */
    getPagerListData: function(page, size, callback, count) {
      var self = this;
      var jsondata = Object.assign({}, self.adviceRequest || self.request);
      jsondata = { ...jsondata, ...(this.filter || []) };
      jsondata.fromAddProdPage = this.request.fromAddProdPage;
      jsondata.canQueryStock = this.canQueryStock;
      this.config.page = page;
      this.config.pagesize = size;
      var url = "/base/prod/info/list.json";
      //取分页总数
      if (count) {
        jsondata.page = 1;
        jsondata.pagesize = 1;
        this.$httpUtil.post({
          url: url,
          data: jsondata,
          contentType: "form", //json,form,multipart
          loading: false, //不显示遮罩
          succ: function(data) {
            if (callback) {
              callback(data);
            }
          }
        });
      } else {
        jsondata.page = page;
        jsondata.pagesize = size;
        jsondata.simple = 1;
        this.$httpUtil.post({
          url: url,
          data: jsondata,
          contentType: "form", //json,form,multipart
          succ: function(data) {
            data.records = self.infoData.records;
            self.infoData = data;
            if (callback) {
              callback(data);
            }
          }
        });
      }
    },
    /*
     * 获取总数
     * */
    getCountData: function() {
      var self = this;
      this.getPagerListData(
        this.config.page,
        this.config.pagesize,
        data => {
          self.infoData.records = data.total;
        },
        true
      );
    },
    searchFun() {
      //高级搜索条件清空
      this.adviceRequest = null;
      this.request.page = 1;
      this.getListData();
    },
    /**
     * 高级搜索
     */
    adviceSearchFunc(param) {
      this.adviceRequest = param;
      this.adviceRequest.page = 1;
      this.request.page = 1;
      this.getListData();
    },
    checkCreator: function(item) {
      var id = this.$store.state.userInfo.id;
      return item.adminUserId == id;
    },
    checkDelete: function(item) {
      return (
        (item.processStatus === -2 || item.processStatus === 0) &&
        this.checkCreator(item)
      );
    }
  }
};
</script>
