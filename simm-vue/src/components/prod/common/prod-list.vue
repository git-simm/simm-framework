<template>
  <section class="content-section layer-container">
    <div style="width:100%;height:100%;overflow:auto;">
      <el-form :model="addData" label-width="80px" ref="addData">
        <el-col :span="7">
          <el-form-item label="SKU编码">
            <el-input placeholder="请输入SKU编码" v-model.trim="addData.prod_number_like"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="商品名称">
            <el-input placeholder="请输入商品名称" v-model.trim="addData.prod_name_like"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <div style="margin-left: 10px;">
            <el-button type="primary" class="btn-default" @click="searchFun()">搜 索</el-button>
          </div>
        </el-col>
      </el-form>
      <div class="search-table">
        <el-table
          border
          ref="multipleTable"
          :data="prodInfo.data"
          class="word-break"
          @selection-change="handleSelectionChange"
          style="width: 100%;"
          height="330"
        >
          <el-table-column
            type="selection"
            :selectable="(row,index)=>row.can_sale==1"
            prop="id"
            width="60"
          ></el-table-column>
          <el-table-column prop="prod_number" width="140" label="SKU编码"></el-table-column>
          <el-table-column prop="date" label="SKU状态">
            <template slot-scope="scope">
              <span title="SKU状态">
                <span :style="{'color':(Number(scope.row.can_sale) === 0)?'crimson':null}">
                  {{
                  Number(scope.row.can_sale) == 1 ? "可销售" : "不可销售"
                  }}
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="prod_name" width="200" label="商品名称"></el-table-column>
          <el-table-column prop="category_name" width="120" label="一级品类"></el-table-column>
          <el-table-column prop="spec_desc" width="150" label="规格"></el-table-column>
          <el-table-column prop="creator_role" label="商品归属">
            <template slot-scope="scope">
              <span>
                {{
                $cacheUtil.getVal("user_role_type", scope.row.creator_role, "")
                }}
              </span>
              <br />
              <div v-if="scope.row.creator_role == 1">({{ scope.row.site_name }})</div>
              <div
                v-else-if="scope.row.creator_role == 2"
              >({{ scope.row.site_name }} - {{ scope.row.level_name }})</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="创建人信息" width="200">
            <template slot-scope="scope">
              姓名：{{scope.row.admin_user_name}}
              <br />
              手机：{{scope.row.admin_user_mobile}}
            </template>
          </el-table-column>
        </el-table>
        <el-row class="top-margin" style="margin-top:10px;">
          <el-pagination
            class="pull-right"
            @current-change="handleCurrentChange"
            :current-page="addData.page"
            :page-size="addData.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="prodInfo.records"
          ></el-pagination>
        </el-row>
      </div>
    </div>
    <div class="layer-footer" style="text-align:center;">
      <el-button type="primary" @click="addSave(addData,'addData')">确 定</el-button>
      <el-button @click="closeWin">取 消</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: "processList",
  data: function() {
    return {
      multipleSelection: [],
      prodInfo: {},
      callback: null,
      filter: {},
      addData: {
        page: 1,
        pagesize: 10,
        //supply_id: null, //供应商ID
        //spu_id: null, //SPU ID
        prod_number_like: "",
        prod_name_like: "",
        processStatus: 3,
        //显示审核通过,状态为1的数据 -1逻辑删除的数据不要
        status_list: [1],
        prod_list: []
      }
    };
  },
  created() {
    this.callback = this.$options.propsData.callback;
    this.filter = this.$options.propsData.filter;
    this.addData = {
      ...this.addData,
      ...this.filter
    };
    //加载数据
    this.getListData();
  },
  methods: {
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
    // 列表行数据
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },
    searchFun() {
      if (this.addData.page === 1) {
        this.getListData();
      } else {
        this.addData.page = 1;
      }
    },
    handleCurrentChange(val) {
      this.addData.page = val;
      this.getListData();
    },
    getListData() {
      var self = this;
      this.$httpUtil.post({
        url: "/prodInfo/prodlist.json",
        data: self.addData,
        succ: function(data) {
          self.prodInfo = data;
        }
      });
    },
    addSave() {
      var self = this;
      var skuArray = [];
      if (self.multipleSelection.length == 0) {
        self.$commonUtil.valid.throwEx("请选择商品");
      }
      //对返回结果进行一次验证
      if (self.filter.beforeCallback) {
        self.filter.beforeCallback(self.multipleSelection);
      }
      //回调关闭窗口
      if (self.callback) {
        self.callback(self.multipleSelection);
      }
      self.closeWin();
    }
  }
};
</script>
