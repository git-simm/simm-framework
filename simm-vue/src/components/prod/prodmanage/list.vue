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
              <el-input
                placeholder="请输入SKU编码"
                type="textarea"
                :rows="4"
                v-model="request.prod_number"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input placeholder="商品名称" v-model.trim="request.prod_name_like"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称">
              <el-select
                v-model="request.purchase_supply_id"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, key) in supplyData"
                  :key="key"
                  :label="item.supply_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市/省级">
              <sxh-city v-model="request.cityList" :check-strictly="false" @change="cityChanged"></sxh-city>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类目">
              <sxh-category v-model="request.categoryList" @change="categoryChange"></sxh-category>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="初始审核">
              <sxh-checkbox-group dic="init_audit_status" v-model="request.initAuditStatus"></sxh-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="pull-right" style="padding-bottom:10px;">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="searchFun()"
              >搜索</el-button>
              <el-button
                v-permission:exportProdlist
                type="primary"
                icon="el-icon-download"
                class="btn-default"
                @click="excelExport()"
              >导出</el-button>
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="$refs.adviceSearch.showDrawer()"
              >高级搜索</el-button>
              <prod-search-advice
                ref="adviceSearch"
                @confirm="adviceSearchFunc"
                :baseData="{ citys, supplyData }"
              ></prod-search-advice>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-row>
        <el-col :span="22">
          <router-link to="/prod/prodmanage/addareagoods" v-permission:addProd>
            <el-button type="primary" class="btn-default" icon="el-icon-plus">新增商品</el-button>
          </router-link>
          <el-button
            v-permission:prodBatchAudit
            type="primary"
            @click="allSupplyProdAudit"
            class="btn-default"
          >批量取消审核</el-button>
        </el-col>
        <el-col :span="2">
          <div class="pull-right">
            <sxh-help code="030301"></sxh-help>
            <!-- <sxh-help code="000002"></sxh-help> -->
          </div>
        </el-col>
      </el-row>
      <prod-list ref="detailList" :filter="filter" @countChange="val => (total = val)"></prod-list>
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
import { setTimeout } from "timers";
import prodList from "./prod-list";
import prodSearchAdvice from "./prod-search-advice";
import requestMixin from "@/common/mixins/requestMixin";
export default {
  name: "prodListMain",
  components: {
    prodList,
    prodSearchAdvice
  },
  mixins: [requestMixin],
  props: {
    filter: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function(router) {
    var checkmobile = (rule, value, callback) => {
      if (!/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      selectedRows: [],
      supply_type: this.$store.state.userInfo.supply_type,
      supplyData: [],
      citys: [],
      request: {
        initAuditStatus: [],
        categoryList: [],
        categoryId: "",
        twoCategoryId: "",
        threeCategoryId: "",
        prod_name_like: "",
        prod_number: "",
        purchase_supply_id: "",
        city: {},
        cityList: []
      },
      data: {}
    };
  },
  created() {
    this.getSupplyData();
  },
  methods: {
    cityChanged(val) {
      if (val.cityId > 0) {
        this.request.city = {
          id: val.cityId,
          city_level: 2
        };
        return;
      } else if (val.provinceId > 0) {
        this.request.city = {
          id: val.provinceId,
          city_level: 1
        };
        return;
      }
      this.request.city = {};
    },
    /**
     * 类目信息获取
     */
    categoryChange(val) {
      this.request.categoryId = val.categoryId;
      this.request.twoCategoryId = val.twoCategoryId;
      this.request.threeCategoryId = val.threeCategoryId;
    },
    selectable(row, index) {
      if (null != row.sysAudit) {
        return true;
      } else {
        return false;
      }
    },
    allAudit: function() {
      var arr = this.$refs.detailList.getSelectedRows();
      var ids = [];
      (arr || []).forEach((data, index) => {
        if (data.sysAudit) {
          ids.push(data.sysAudit.id);
        }
      });
      if (ids.length <= 0) {
        alert("未选取行信息");
      } else {
        var self = this;
        var store = this.$store;
        var url = "/prodInfo/batchApproveSuccess.json";
        this.$httpUtil.post({
          url: url,
          data: {
            ids: JSON.stringify(ids)
          },
          contentType: "form",
          succ: function(data) {
            self.$message({
              message: "操作成功!",
              type: "success"
            });
            setTimeout(function() {
              self.$router.go(0);
            }, 1500);
            self.getListData();
          }
        });
      }
    },
    getSupplyData: function(key_word) {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyInfo/addlist.json",
        data: {
          key_word: key_word
        },
        contentType: "form", //json,form,multipart
        loading: false,
        succ: function(data) {
          self.supplyData = data.data;
        }
      });
    },
    checkEdit: function(item) {
      var id = this.$store.state.userInfo.id;
      return (
        (0 == item.process_status || -2 == item.process_status) &&
        item.admin_user_id == id
      );
    },
    searchFun: function() {
      this.adviceRequest = null;
      //高级搜索改造
      this.$refs.detailList.search(this.request);
    },
    /**
     * 高级搜索
     */
    adviceSearchFunc(param) {
      this.adviceRequest = param;
      this.$refs.detailList.search(this.adviceRequest);
    },
    excelExport() {
      if (this.request.city == "") {
        this.request.city = null;
      }
      this.$refs.detailList.export(this.adviceRequest || this.request);
    },
    allSupplyProdAudit: function() {
      var arr = this.$refs.detailList.getSelectedRows();
      var ids = [];
      (arr || []).forEach((data, index) => {
        if (null != data.sub_status && data.sub_status.indexOf("01") != -1) {
          ids.push(data.id);
        }
      });
      if (ids.length <= 0) {
        alert("未选取行信息");
      } else {
        var self = this;
        var store = this.$store;
        var url = "/supplyProd/batchApproveCancel.json";
        this.$httpUtil.post({
          url: url,
          data: {
            ids: JSON.stringify(ids)
          },
          contentType: "form",
          succ: function(data) {
            self.$message({
              message: "操作成功!",
              type: "success"
            });
            setTimeout(function() {
              self.$router.go(0);
            }, 1500);
            self.getListData();
          }
        });
      }
    },
    showSearch() {
      this.$commonUtil.win.showProdInfoSearch(this);
    }
  }
};
</script>
