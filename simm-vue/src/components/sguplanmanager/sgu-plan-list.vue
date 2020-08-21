<template>
  <section class="content-section sgu-plan">
    <el-row class="search-form el-drawer__body">
      <el-form
        :model="request"
        ref="request"
        label-width="100px"
        class="demo-ruleForm"
        @keyup.enter.native="getListData"
      >
        <el-row>
          <el-col :span="2">
            <el-button icon="el-icon-back" @click="$back(null,'/sguplanmanager/fileList')">返回</el-button>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商编码">
              <el-input placeholder="请输入供应商编码" v-model.trim="request.supplyNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU编码">
              <el-input placeholder="请输入SKU编码" v-model.trim="request.skuNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <label></label>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计划状态">
              <sxh-checkbox-group dic="base_status" v-model="request.baseStatusList"></sxh-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <div style="padding-left:10px;">
              <el-button
                type="primary"
                class="btn-default"
                icon="el-icon-search"
                @click="getListData()"
              >搜 索</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <div class="search-table">
        <sxh-table
          ref="sguPlanTable"
          :config="config"
          :dataSource="infoData"
          @expand-change="getPlanProdList"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 未提交时，没有明细 -->
              <sgu-plan-prod-list :baseData="scope.row"></sgu-plan-prod-list>
            </template>
          </el-table-column>
          <el-table-column width="100" label="SGU类型">
            <template slot-scope="scope">
              <el-tag>{{ $cacheUtil.getVal("sgu_type", scope.row.sguType)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="150" prop="supplyNumber" label="供应商编码"></el-table-column>
          <el-table-column label="配送方式">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                effect="plain"
              >{{ $cacheUtil.getVal("delivery_type", scope.row.deliveryType)}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column width="140" label="SGU控制设置">
            <template slot-scope="scope">
              <div>
                <span class="sub-title">仅团长购买：</span>
                <b>
                  <el-tag
                    size="mini"
                    effect="plain"
                  >{{ $cacheUtil.getVal("only_partner", scope.row.onlyPartner)}}</el-tag>
                </b>
              </div>
              <div v-if="scope.row.deliveryType==2">
                <span class="sub-title">是否次日达：</span>
                <b>
                  <el-tag
                    size="mini"
                    effect="plain"
                  >{{ $cacheUtil.getVal("is_nextDay", scope.row.isNextDay)}}</el-tag>
                </b>
              </div>
              <div>
                <span class="sub-title">是否换购品：</span>
                <b>
                  <el-tag
                    size="mini"
                    effect="plain"
                  >{{ $cacheUtil.getVal("exchange_type", scope.row.exchange)}}</el-tag>
                </b>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="190" label="上/下架时间">
            <template slot-scope="scope">
              上架：{{scope.row.onSaleTime}}
              <br />
              下架：{{scope.row.takenOffTime}}
            </template>
          </el-table-column>
          <el-table-column prop="distributionTemplateId" label="配送模板ID"></el-table-column>
          <el-table-column prop="prefixName" label="销售信息" min-width="100">
            <template slot-scope="scope">
              前缀：{{scope.row.prefixName}}
              <br />
              标签：{{scope.row.tag}}
            </template>
          </el-table-column>
          <el-table-column label="SGU信息" min-width="200">
            <template slot-scope="scope">
              <div>
                <span class="sub-title">排序码:</span>
                <b>{{ scope.row.sort }}</b>
              </div>
              <div v-if="scope.row.sguNumber">
                <span class="sub-title">编码:</span>
                <sxh-detail-view
                  comp="sguView"
                  :view-param="{ id: scope.row.sguId, number: scope.row.sguNumber,label:scope.row.sguNumber,isLink:true }"
                ></sxh-detail-view>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="计划状态" min-width="100">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                effect="plain"
              >{{$cacheUtil.getVal("base_status",scope.row.baseStatus)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="100"></el-table-column>
          <!--<el-table-column width="170" label="创建信息">
            <template slot-scope="scope">
              姓名：{{scope.row.creatorName}}
              <br />
              时间：{{scope.row.createTime}}
            </template>
          </el-table-column>-->
          <el-table-column label="是否作废">
            <template slot-scope="scope">
              <el-tag size="mini" effect="plain" v-if="scope.row.deleteFlag===1">已作废</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
            <template slot-scope="scope">
              <span v-permission:imported_onsale_plan_edit>
                <router-link
                  :to="'/sguplanmanager/sguPlanBase/'+scope.row.id"
                  v-if="scope.row.baseStatus < 2 && scope.row.deleteFlag ===0"
                >
                  <el-button plain size="minier">修改计划</el-button>
                </router-link>
              </span>
              <span v-permission:plan_sgu_draft_edit>
                <router-link
                  :to="'/sgumanager/edit/'+scope.row.sguId"
                  v-if="scope.row.baseStatus === 1 && scope.row.deleteFlag ===0"
                >
                  <el-button type="primary" plain size="minier">SGU编辑</el-button>
                </router-link>
              </span>
            </template>
          </el-table-column>
        </sxh-table>
      </div>
    </div>
  </section>
</template>

<script>
import sguPlanProdList from "@/components/sguplanmanager/sgu_plan_prod_list";
export default {
  name: "sgu-plan-list",
  components: { sguPlanProdList },
  data: function() {
    return {
      infoData: {},
      config: {
        getListData: this.getPagerListData,
        page: 1,
        pagesize: 10
      },
      request: {
        supplyNumber: null,
        planNumber: null,
        skuNumber: null,
        fileId: this.$route.params.fileId,
        baseStatusList: []
      }
    };
  },
  created() {
    this.getListData();
  },
  activated() {
    //A页归来，则需要重置参数
    if (this.$store.state.from.name == "SguFileList") {
      this.request = {
        supplyNumber: null,
        planNumber: null,
        skuNumber: null,
        fileId: this.$route.params.fileId,
        baseStatusList: []
      };
    }
    this.getListData();
  },
  methods: {
    /**
     * 根据base.id获取sku列表
     */
    getPlanProdList(row, event, column) {
      if (event) {
        this.$httpUtil.post({
          url: "/sguPlanProdInfo/searchList.json",
          data: {
            planBaseId: row.id
          },
          contentType: "form", //json,form,multipart
          succ: function(data) {
            row.sguPlanProdInfoList = data.data || [];
          }
        });
      }
    },
    /**
     * 获取计划列表
     */
    getListData: function() {
      if (this.$refs.sguPlanTable) {
        this.$refs.sguPlanTable.setPage(1);
      }
      this.getPagerListData(this.config.page, this.config.pagesize);
    },
    /**
     * 获取分页数据
     */
    getPagerListData: function(page, size) {
      var self = this;
      var jsondata = Object.assign({}, self.request);
      var url = "/sguPlanBaseInfo/searchByPage.json";
      jsondata.page = page;
      jsondata.size = size;
      this.$httpUtil.post({
        url: url,
        data: jsondata,
        contentType: "form", //json,form,multipart
        isShowLoading: false, //不显示遮罩
        succ: function(data) {
          var page = data.data || {};
          self.infoData = {
            data: page.records,
            records: page.total
          };
        }
      });
    }
  }
};
</script>

<style scoped>
</style>