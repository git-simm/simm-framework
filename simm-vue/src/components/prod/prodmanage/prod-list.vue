<template>
  <sxh-table class="prod-content" :dataSource="data" ref="multipleTable" :config="config">
    <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
    <el-table-column prop="date" label="商品主图">
      <template slot-scope="scope">
        <img :src="scope.row.image_url" alt />
      </template>
    </el-table-column>
    <el-table-column prop="date" label="商品信息" width="220">
      <template slot-scope="scope">
        名称：{{ scope.row.prod_name }}
        <br />编码：
        <sxh-detail-view
          comp="skuView"
          :view-param="{
            number: scope.row.prod_number,
            isLink: true,
            label: scope.row.prod_number
          }"
        />
        <br />
        一级分类：{{ scope.row.category_name }}
        <br />
        二级分类：{{ scope.row.two_category_name }}
        <br />
        三级分类：{{ scope.row.three_category_name }}({{
        scope.row.threeAfterTime
        }}天)
        <el-tag
          size="mini"
          effect="plain"
          title="商品属性"
        >{{ $cacheUtil.getVal('storage_method',scope.row.storage_method )}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="unit_name" label="单位" width="60"></el-table-column>
    <el-table-column prop="date" label="供应商信息" width="180">
      <template slot-scope="scope">
        <span title="供应商名称">{{ scope.row.supply_name }}</span>
        <br />
        <sxh-detail-view
          title="供应商编码"
          comp="supplyView"
          :view-param="{
            id: scope.row.purchase_supply_id,
            number: scope.row.supply_number,
            isLink: true,
            label: scope.row.supply_number
          }"
        ></sxh-detail-view>
        <br />
        <el-tag size="mini" effect="plain" title="销售模式">
          {{
          $cacheUtil.getVal("settltType", scope.row.merchant_model, "")
          }}
        </el-tag>/
        <el-tag size="mini" effect="plain" title="是否分账">
          {{
          scope.row.is_sub_account == 1 ? "分账" : "不分账"
          }}
        </el-tag>/
        <el-tag size="mini" effect="plain" title="供应商归属">
          {{
          scope.row.is_direct_purchasing == 0 ? "团购" : "直购"
          }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="单价/售后时效" :render-header="renderPriceHeader" width="120">
      <template slot-scope="scope">
        <div v-if="scope.row.is_sub_account === 1">销售单价：{{ scope.row.prod_sub_account_prod_price }}</div>
        <div v-else>订货单价：{{ scope.row.prod_price }}</div>
        <div v-if="scope.row.is_afterTime_change == 1">
          <span style=" color: red;">售后时效：{{ scope.row.afterTime }}天</span>
        </div>
        <div v-else>
          <span style=" color: black;">售后时效：{{ scope.row.afterTime }}天</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="创建人信息" width="150">
      <template slot-scope="scope">
        姓名：{{ scope.row.admin_user_name }}
        <br />
        手机：{{ scope.row.admin_user_mobile }}
        <br />
        <el-tag size="mini" effect="plain" title="商品归属">
          <div v-if="scope.row.creator_role == 1">{{ scope.row.site_name }}</div>
          <div
            v-else-if="scope.row.creator_role == 2"
          >{{ scope.row.site_name }} - {{ scope.row.level_name }}</div>
          <div v-else>{{ $cacheUtil.getVal("user_role_type", scope.row.creator_role, "") }}</div>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="状态" width="120">
      <template slot="header">
        <span>状态</span>
        <sxh-popover tooltip="商品可以上架售卖控制条件<br/>1、SKU允许销售<br/>2、商品允许订货"></sxh-popover>
      </template>
      <template slot-scope="scope">
        <span title="SKU状态">
          <span>SKU:</span>
          <span
            :style="{
              color: Number(scope.row.can_buy) === 0 ? 'crimson' : null
            }"
            :title="`SKU下的商品是否允许采购`"
          >{{ Number(scope.row.can_buy) == 1 ? "可订货" : "不可订货" }}</span>
          <br />
          <span
            :style="{
              color: Number(scope.row.can_sale) === 0 ? 'crimson' : null,
              marginLeft: '34px'
            }"
            :title="`SKU下的商品是否允许销售`"
          >{{ Number(scope.row.can_sale) == 1 ? "可销售" : "不可销售" }}</span>
        </span>
        <br />
        <span title="商品状态">
          <span>商品:</span>
          <span
            :style="{color: Number(scope.row.is_onsale) === 0 ? 'crimson' : null}"
          >{{ scope.row.is_onsale == 1 ? "可订货" : "不可订货" }}</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="初始审核">
      <template slot-scope="scope">
        <sxh-process
          process-enum="PRODUCT_AUDIT"
          :key="`prod_process_` + scope.row.id"
          :ref-id="scope.row.id"
          :process-status="scope.row.process_status"
        >
          <span>{{ $cacheUtil.getVal("init_audit_status",scope.row.init_audit_status,"")}}</span>
        </sxh-process>
      </template>
    </el-table-column>
    <el-table-column label="调价审核" :render-header="renderHeader1">
      <template slot-scope="scope">
        <div
          v-if="scope.row.is_sub_account == 1"
        >{{$cacheUtil.getVal("update_audit_status",scope.row.update_audit_status,"")}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="操作" min-width="100">
      <template slot="header">
        <span>操作</span>
      </template>
      <template slot-scope="scope">
        <sxh-detail-view
          comp="prodView"
          :ref="`view${scope.row.id}`"
          :view-param="{
            id: scope.row.id,
            number: scope.row.id + `-` + scope.row.prod_number
          }"
        ></sxh-detail-view>
        <span v-if="getCanSaleState(scope.row)">
          <el-button plain size="minier" @click="onSaleOperation(scope.row)">上架</el-button>
        </span>
        <span v-if="checkDelete(scope.row)">
          <el-button plain size="minier" @click="deleteProd(scope.row.id)">删除</el-button>
        </span>
        <router-link
          v-if="checkEdit(scope.row)"
          :to="'/prod/prodmanage/editarea/' + scope.row.id + '/0'"
        >
          <el-button plain size="minier">编辑</el-button>
        </router-link>
        <!-- 目前要求只有城市账号才有审批流，商品管理员也必须是城市账号 -->
        <router-link
          v-if="null != scope.row.sysAudit && $store.state.userInfo.roleType == scope.row.creator_role"
          :to="'/prod/prodmanage/auditprod/' + scope.row.id + '/' + scope.row.sysAudit.id"
        >
          <el-button plain size="minier">审核</el-button>
        </router-link>
        <el-button
          plain
          size="minier"
          v-if="getCancelCheckState(scope.row)"
          @click="cancelAudit(scope.row.id)"
        >取消审核</el-button>
        <sxh-dropdown :key="`${scope.row.id}-${Math.random()}`">
          <el-dropdown-item v-if="getCanCopyState(scope.row)">
            <router-link v-permission:addProd :to="'/prod/prodmanage/copy/' + scope.row.id">
              <div>复制</div>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item
            v-if="
              scope.row.process_status == 3 &&
                ($store.state.userInfo.roleType == scope.row.creator_role ||
                  $store.state.userInfo.id == scope.row.admin_user_id)
            "
          >
            <!-- 审核完成修改 -->
            <router-link
              v-permission:prodEdit
              :to="'/prod/prodmanage/editarea/' + scope.row.id + '/1'"
            >
              <div>修改</div>
            </router-link>
          </el-dropdown-item>

          <!--审核完成  省中心经理修改-->
          <el-dropdown-item
            v-if="
              scope.row.process_status == 3 &&
                ($store.state.userInfo.roleType == scope.row.creator_role ||
                  $store.state.userInfo.id == scope.row.admin_user_id)
            "
          >
            <router-link
              v-permission:prod_SZXZJL_Edit
              :to="'/prod/prodmanage/editarea/' + scope.row.id + '/2'"
            >
              <div>修改</div>
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item v-if="scope.row.process_status == 3">
            <!-- 商品解绑 代销供应商(直购供应商不用解绑)  -->
            <router-link
              v-permission:prod_List_unbind
              v-if="
                scope.row.merchant_model == 1 &&
                  ($store.state.userInfo.roleType == scope.row.creator_role ||
                    $store.state.userInfo.id == scope.row.admin_user_id) &&
                  scope.row.is_direct_purchasing === 0
              "
              :to="'/prod/prodmanage/editarea/' + scope.row.id + '/3'"
            >供应商解绑</router-link>
          </el-dropdown-item>

          <el-dropdown-item v-if="scope.row.status == 1 && scope.row.process_status == 3">
            <div
              v-permission:prod_onsale
              @click="setOnSale(scope.row)"
            >{{ scope.row.is_onsale == 0 ? "可订货" : "不可订货" }}</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div
              v-permission:prod_payByBalance
              @click="setPayByBalance(scope.row)"
            >{{ scope.row.is_pay_by_balance == 0 ? "可余额支付" : "不可余额支付" }}</div>
          </el-dropdown-item>
        </sxh-dropdown>
      </template>
    </el-table-column>
  </sxh-table>
</template>

<script>
import sxhTabHandler from "@/components/shixh/view/sxh-tab-handler.js";
import prodListHandler from "@/components/prod/prodmanage/prod-list-handler";
export default {
  name: "prodList",
  mixins: [sxhTabHandler, prodListHandler],
  props: {
    filter: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      initAuditStatusList: [],
      updateAuditStatusList: [],
      selectedRows: [],
      supply_type: (this.$store.state.userInfo || {}).supply_type,
      menuBtnId: [],
      data: {},
      records: null,
      config: {
        getListData: this.getPagerListData,
        multiple: true,
        showCheckbox: false,
        simplePager: true,
        page: 1,
        pagesize: 10
      },
      request: {
        page: 1,
        initAuditStatus: [],
        updateAuditStatus: [],
        prod_number_like: "",
        prod_name_like: "",
        prod_number: "",
        search_type: 0,
        purchase_supply_id: "",
        key_word: "",
        is_onsale: "",
        prod_out_type: "",
        processStatus: "",
        categoryId: "",
        twoCategoryId: "",
        barCode: "",
        city: null,
        create_name: ""
      }
    };
  },
  mounted() {
    this.getData();
  },
  activated() {
    //keep-alive模式，激活时执行一次查询
    this.getData();
  },
  methods: {
    getData() {
      this.getListData();
      this.getCountData();
    },
    /**
     * 获取可上架的状态
     */
    getCanCopyState(row) {
      // 如果既不能采购，也不能销售，则不允许商品启用复制功能
      return Number(row.can_sale) == 1 || Number(row.can_buy) == 1;
    },
    /**
     * 获取可上架的状态
     */
    getCanSaleState(row) {
      // sku得允许销售（商品不可订货，则不能再上架了）
      return (
        null != row.spuId &&
        row.is_onsale == 1 &&
        Number(row.can_sale) == 1 &&
        row.status == 1 &&
        row.process_status == 3 &&
        (row.is_sub_account != 1 || row.sub_status == 1)
      );
    },
    /**
     * 获取可取消审核的状态
     */
    getCancelCheckState(row) {
      var initAuditStatus = [1, 4, 5];
      var updateAuditStatus = [1, 4, 5, 6];
      return (
        row.process_status == 3 &&
        (this.$store.state.userInfo.roleType == row.creator_role ||
          this.$store.state.userInfo.id == row.admin_user_id) &&
        row.is_sub_account == 1 &&
        (initAuditStatus.includes(row.init_audit_status) == 1 ||
          updateAuditStatus.includes(row.update_audit_status))
      );
    },

    //====================================================
    /**
     * 对外查询方法
     */
    search: function(filter) {
      this.request = filter;
      //回到首页
      this.config.page = 1;
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.setPage(1);
      }
      this.getListData();
      //异步获取总数量
      this.getCountData();
    },
    /**
     * 导出商品
     */
    export: function(filter) {
      var jsondata = {
        ...{},
        ...filter
      };
      jsondata = { ...jsondata, ...(this.filter || {}) };
      for (var p in jsondata) {
        if (this.$commonUtil.valid.isEmpty(jsondata)) {
          jsondata = null;
        }
      }
      this.$httpUtil.export({
        url: "/report/exportProdlist.json",
        data: jsondata,
        succ: function(result) {}
      });
    },
    getSelectedRows: function() {
      return this.$refs.multipleTable.getSelectedRows();
    },
    //====================================================
    selectable(row, index) {
      return row.sub_status == 1;
    },
    // openProcess: function(bizId) {
    //   this.$commonUtil.win.showProcessList(this, "PRODUCT_AUDIT", bizId);
    // },
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size, callback, count) {
      var self = this;
      var jsondata = {
        ...{},
        ...this.request
      };
      jsondata = { ...jsondata, ...(this.filter || {}) };
      for (var p in jsondata) {
        if (this.$commonUtil.valid.isEmpty(jsondata[p])) {
          jsondata[p] = null;
        }
      }
      this.config.page = page;
      this.config.pagesize = size;
      //是否简单分页
      if (count) {
        jsondata.pager = {
          pageNo: 1,
          pageSize: 1
        };
        this.$httpUtil.post({
          url: "/prodInfo/prodlist.json",
          data: jsondata,
          loading: false, //不显示遮罩
          succ: function(data) {
            if (callback) {
              callback(data);
            }
          }
        });
      } else {
        jsondata.pager = {
          pageNo: page,
          pageSize: size,
          simple: this.config.simplePager ? 1 : 0
        };
        this.$httpUtil.post({
          url: "/prodInfo/prodlist.json",
          data: jsondata,
          succ: function(data) {
            self.data = data;
            self.data.records = self.records;
            if (callback) {
              callback(data);
            }
          }
        });
      }
    },
    getListData: function() {
      this.getPagerListData(this.config.page, this.config.pagesize);
    },
    /**
     * 获取总数
     */
    getCountData: function() {
      var self = this;
      this.getPagerListData(
        this.config.page,
        this.config.pagesize,
        data => {
          self.records = data.total;
          self.data.records = data.total;
          self.$emit("countChange", self.records);
        },
        true
      );
    },
    checkEdit: function(item) {
      var id = this.$store.state.userInfo.id;
      return (
        (0 == item.process_status || -2 == item.process_status) &&
        item.admin_user_id == id
      );
    },
    checkDelete: function(item) {
      var id = this.$store.state.userInfo.id;
      return (
        (item.process_status == -2 || item.process_status == 0) &&
        item.admin_user_id == id
      );
    }
  }
};
</script>

<style>
.prod-content img {
  height: 60px;
  max-width: 60px;
}
</style>
