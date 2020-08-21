<template>
  <section class="content-section">
    <el-row :gutter="20" class="search-form">
      <el-form :model="request" label-width="120px" class="demo-ruleForm">
        <el-col :span="6">
          <el-form-item label="城市">
            <el-select v-model="request.adminShopId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in cities"
                :key="item.admin_shop_id"
                :label="item.level_name"
                :value="item.admin_shop_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="改价申请编号">
            <el-input placeholder="改价申请编号" v-model.trim="request.id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="10px">
            <el-button
              type="primary"
              class="btn-default"
              icon="el-icon-search"
              @click="getPagerListData()"
            >搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <sxh-table :dataSource="data" ref="multipleTable" :config="config">
      <el-table-column prop="admin_shop_name" label="城市"></el-table-column>
      <el-table-column prop="id" label="申请编号"></el-table-column>
      <el-table-column prop="create_by" label="操作人"></el-table-column>
      <el-table-column prop="create_at" label="操作时间"></el-table-column>
      <el-table-column prop="prod_name" label="商品名称"></el-table-column>
      <el-table-column prop="prod_number" label="SKU编码"></el-table-column>
      <el-table-column prop="sub_account_prod_price" label="销售单价(元)"></el-table-column>
      <el-table-column prop="sub_account_proportion" label="平台比例(%)"></el-table-column>
      <el-table-column prop="oper_type" label="状态"></el-table-column>
      <el-table-column prop="oper_remark" label="操作说明"></el-table-column>
    </sxh-table>
  </section>
</template>

<script>
import baseMixin from "@/common/mixins/baseMixin";
export default {
  name: "priceAuditList",
  mixins: [baseMixin],
  props: {
    prodId: {
      type: Number,
      required: true,
      default: null
    }
  },
  data: function() {
    return {
      data: {},
      request: {
        prodId: this.prodId,
        adminShopId: null,
        id: null
      },
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      cities: []
    };
  },
  created() {
    this.getListData();
    this.getUserLevelData();
  },
  methods: {
    /**
     * 查询城市
     */
    getUserLevelData() {
      var self = this;
      this.$httpUtil.post({
        url: "/supplyUserLevel/listByProdId.json",
        data: { id: self.request.prodId },
        contentType: "form", //json,form,multipart
        succ: function(data) {
          self.cities = data.data;
        }
      });
    },
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = self.request;
      this.config.page = page;
      this.config.pagesize = size;
      jsondata.pager = {
        pageNo: page,
        pageSize: size
      };
      this.$httpUtil.post({
        url: "/supplyProd/priceOperaList.json",
        data: jsondata,
        succ: function(data) {
          self.data = data;
        }
      });
    },
    getListData: function() {
      this.getPagerListData(this.config.page, this.config.pagesize);
    }
  }
};
</script>
