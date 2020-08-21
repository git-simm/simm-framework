<template>
  <section class="content-section">
    <el-form :model="request" label-width="120px" class="demo-ruleForm">
      <el-row class="search-form el-drawer__body">
        <el-col v-if="showReturn" :span="2">
          <el-button icon="el-icon-back" @click="$back">返回</el-button>
        </el-col>
        <el-col :span="6" v-if="showSearch">
          <el-form-item label="请选择城市">
            <sxh-city v-model="request.cityIdList" :check-strictly="false" :select-first="true"
                      @first-selected="firstSelected" @change="cityChange"></sxh-city>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类目">
            <sxh-category v-model="request.categoryArr" @change="categoryChange"></sxh-category>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="10px">
            <el-button type="primary" class="btn-default" icon="el-icon-search" @click="searchFun()">搜索</el-button>
            <el-button v-if="showEdit" type="primary" class="btn-default" icon="el-icon-search"
                       @click="exportCategory()">导出
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" style="width: 100%" :max-height="550" row-key="id" border
              :tree-props="{children: 'children'}">

      <el-table-column label="类目名称" prop="categoryName"></el-table-column>
      <el-table-column label="类目等级" prop="categoryLevel">
        <template slot-scope="scope">
          <div>
            <span  v-if="scope.row.categoryLevel ===1" style=" color: #000000;">{{ scope.row.categoryLevel }}</span>
            <span  v-if="scope.row.categoryLevel ===2" style=" color: #66FF00;">{{ scope.row.categoryLevel }}</span>
            <span  v-if="scope.row.categoryLevel ===3" style=" color: #FF0000;">{{ scope.row.categoryLevel }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="城市" prop="cityName"></el-table-column>
      <el-table-column label="毛利率" prop="grossProfitRate">
        <template slot-scope="scope">
          <div>
            <span style=" color: #000000;">{{ scope.row.grossProfitRate }}%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="showEdit">
        <template slot-scope="scope" v-if="scope.row.categoryLevel !=3">
                <span v-permission:grossProfit_edit>
                    <el-button plain size="minier" @click="edit(scope.row)">修改毛利率
                    </el-button>
                </span>
          <sxh-detail-view comp="categoryDetail" :view-param="{ id: scope.row.id}"></sxh-detail-view>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import editComp from "@/components/client/level/category-city-edit";
import exportUtil from "../../../common/utils/ExportUtil";

export default {
  name: "LevelGrossProfitList",
  props: {
    showEdit: {
      type: Boolean,
      required: false,
      default: true
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    showReturn: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      tableData: [],
      request: {
        cityIdList: [],
        cityId: this.$route.params.id || null,
        categoryArr: [],
        categoryId: "",
        twoCategoryId: "",
        threeCategoryId: "",
      },
      entity: {},
      user: this.$store.state.userInfo,
    };
  },
  created() {
    //毛利率编辑页面跳转时，取当前选择的城市，
    //我的账号页面跳转时，取用户城市资源权限默认值
    if (this.$route.params.id != null) {
      var cityId = this.$route.params.id;
      this.getListData(cityId);
    }
  },
  methods: {
    getListData: function (val) {
      var jsondata = {}
      var self = this
      if (val != null) {
        jsondata.cityId = val
      }
      this.$httpUtil.post({
        url: "/base/prod/categoryCity/getCategoryListByLevel.json",
        data: jsondata,
        contentType: "form",
        loading: false, //不显示遮罩层
        succ: function (data) {
          self.tableData = data.data;
        }
      });
    },
    edit: function (data) {
      this.$layerUtil.openWin(this, {
        title: `【${data.categoryName}】修改毛利率`,
        area: ["500px", "400px"],
        data: {
          category: data,
          invoke: this.invoke,
        },
        component: editComp,
      });
    },
    searchFun: function () {
      var jsondata = this.request
      var self = this
      this.$httpUtil.post({
        url: "/base/prod/categoryCity/getCategoryListByLevel.json",
        data: jsondata,
        contentType: "form",
        loading: false, //不显示遮罩层
        succ: function (data) {
          self.tableData = data.data;
        }
      });
    },
    firstSelected(val) {
      this.cityChange(val);
      this.searchFun();
    },
    cityChange(val) {
      if (val.cityId > 0) {
        this.request.cityId = val.cityId;
        return;
      } else if (val.provinceId > 0) {
        this.request.cityId = null;
        return;
      }
      this.request.cityId = null;
    },

    /**
     * excel导出
     */
    exportCategory() {
      var self = this;
      var jsondata = self.request;
      this.$httpUtil.post({
        url: "/base/prod/categoryCity/export.json",
        data: jsondata,
        contentType: "form", //json,form,multipart
        succ: function (data) {
          var config = self.$metadata.categoryCityExport;
          exportUtil.exportByConfig(self, data.data, config);
        }
      });
    },
    /**
     * 类目信息获取
     */
    categoryChange(val) {
      this.request.categoryId = val.categoryId;
      this.request.twoCategoryId = val.twoCategoryId;
      this.request.threeCategoryId = val.threeCategoryId;
    },
  }
};
</script>
