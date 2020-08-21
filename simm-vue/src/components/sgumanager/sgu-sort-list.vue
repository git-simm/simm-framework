<template>
  <section class="content-section prod-content">
    <el-row :gutter="20" class="search-form el-drawer__body">
      <el-form
              :model="request"
              label-width="120px"
              class="demo-ruleForm"
              @submit.native.prevent="locationRow"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="SGU编码">
              <el-input
                      v-model.trim="request.sguNumber"
                      placeholder="SGU编码精确查找"
                      @keyup.enter.native="locationRow"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SGU名称">
              <el-input
                      placeholder="SGU名称模糊查找"
                      v-model.trim="request.sguName"
                      @keyup.enter.native="locationRow"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button
                    type="primary"
                    class="btn-default"
                    style="margin-left:20px;"
                    title="快速查找定位SGU"
                    @click="locationRow()"
            >定位</el-button>&nbsp;&nbsp;
            <span style="color:crimson;">(当前为【{{account}}】SGU池)</span>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button icon="el-icon-back" @click="$back" style="margin-right: 10px;">返回</el-button>
          </el-col>
          <el-col :span="20">
            <div class="pull-right" style="padding-bottom:10px;">
              <span>
                <sxh-popover :tooltip="description()" :tooltip-width="300">
                  <img src="/static/img/sys/remark.png" style="width:30px;height:30px;margin-right: 13px"/>
                </sxh-popover>
              </span>
              <el-button icon="el-icon-refresh" @click="getAndCalculateSguList()">刷新列表</el-button>
              <span>
            <el-dropdown trigger="hover">
              <el-button>
                <i class="el-icon-view"></i>
                <span v-if="previewSguStatus ==1">预览展示上架SGU</span>
                <span v-else-if="previewSguStatus ==2">预览展示待上架SGU</span>
                <span v-else>预览展示全部SGU</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-view" @click.native="switchPreviewSguStatus(0)">
                  <sxh-popover
                          tooltip="预览展示全部SGU"
                          :tooltip-width="200"
                  >全部</sxh-popover>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-view" @click.native="switchPreviewSguStatus(1)">
                  <sxh-popover
                          tooltip="预览展示上架状态SGU"
                          :tooltip-width="200"
                  >上架</sxh-popover>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-view" @click.native="switchPreviewSguStatus(2)">
                  <sxh-popover
                          tooltip="预览展示待上架状态SGU"
                          :tooltip-width="200"
                  >待上架</sxh-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
           </span>
              <el-button icon="el-icon-sort" title="根据录入行号调整SGU排序" @click="switchSortType()">
                <span v-if="diySgu == 1">关闭自定义排序</span>
                <span v-else>启用自定义排序</span>
              </el-button>
           <span>
            <el-dropdown trigger="hover">
              <el-button>
                <i class="el-icon-sort"></i>
                快捷排序
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-top" @click.native="sortBySecondCategory('1')">
                  <sxh-popover
                          tooltip="按采购类目升序"
                          :tooltip-width="300"
                  >按类目升序</sxh-popover>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-bottom" @click.native="sortBySecondCategory('0')">
                  <sxh-popover
                          tooltip="按采购类目降序"
                          :tooltip-width="300"
                  >按类目降序</sxh-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
           </span>
              <el-button
                      type="primary"
                      icon="el-icon-setting"
                      class="btn-default"
                      @click="saveSortInfo()"
              >保存排序设置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="search-table">
      <el-row>
        <el-col :span="22">
          <h4>
            <span>SGU可以通过拖拽调整顺序</span>
            <span style="color:crimson;">(1、仅支持对待上架或上架中的SGU进行排序；2、调整完成后，请点击【保存排序设置】按钮进行保存)</span>
          </h4>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" type="card" class="sgu-sort-tabs">
        <el-tab-pane
                v-for="(item, index) in categoryTabs"
                :key="item.id"
                :label="item.name"
                :name="categoryIdToTabName(item.id)"
        >
          <span v-if="item.iconUrl" slot="label">
              <img style="height: 32px;width: 32px;border-radius:50%;overflow:hidden;" :src="item.iconUrl"/>
              {{item.name}}
          </span>
          <el-table
                  border
                  :data="item.sguList"
                  highlight-current-row
                  :ref="categoryIdToTabName(item.id)"
                  size="mini"
                  max-height="600"
                  :class="categoryIdToTabName(item.id)"
          >
            <el-table-column type="index" align="center" :index="i=>i+1" label="序号" width="50"></el-table-column>
            <el-table-column label="SGU主图" width="80">
              <template slot-scope="scope">
                <img :src="scope.row.mainImageUrl" alt />
              </template>
            </el-table-column>
            <el-table-column prop="sguNumber,sguName" label="SGU信息" width="260">
              <template slot-scope="scope">
                <div class="undraggable">
              <span>
                编码：{{ scope.row.sguNumber }}
                <el-tag size="mini" effect="plain" title="售卖类型">
                  {{
                  $cacheUtil.getVal("sale_type", scope.row.saleType)
                  }}
                </el-tag>
              </span>
                  <br />
                  <span>名称：{{ scope.row.sguName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="supplyNumber,supplyName" label="供应商信息" width="200">
              <template slot-scope="scope">
                <div class="undraggable">
              <span>
                <sxh-detail-view
                        comp="supplyView"
                        :view-param="{ id: scope.row.supplyId,number:scope.row.supplyNumber,isLink:true,label:scope.row.supplyNumber }"
                ></sxh-detail-view>
                <el-tag size="mini" effect="plain">
                  {{
                  $cacheUtil.getVal("distribution_type", scope.row.distributionType)
                  }}
                </el-tag>
              </span>
                  <br />
                  <span>名称：{{ scope.row.supplyName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="类目" width="130">
              <template slot-scope="scope">
                <span>一级：{{ scope.row.categoryName }}</span>
                <br />
                <span>二级：{{ scope.row.twoCategoryName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName,creatorMobile" label="创建人信息" width="150">
              <template slot-scope="scope">
                <span>姓名：{{ scope.row.creatorName }}</span>
                <br />
                <span>手机号：{{ scope.row.creatorMobile }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="onSaleTime,takenOffTime" label="上下架时间" width="170">
              <template slot-scope="scope">
                <span>上架：{{ scope.row.onSaleTime }}</span>
                <br />
                <span>下架：{{ scope.row.takenOffTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="70">
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
            <!--取消排序码展示-->
            <!--<el-table-column prop="sort" label="排序码" width="70"></el-table-column>-->
            <el-table-column prop="diySgu" label="自定义行" width="120" v-if="item.id !== specialTabEnum.previewSortedSgu && diySgu === 1">
              <template slot-scope="scope">
                <div class="undraggable">
                <el-input
                        :min="0"
                        :controls="false"
                        v-model.number="scope.row.sortNumber"
                        placeholder="输入行号"
                        @change="diySguSort(scope.row)"
                ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <sxh-detail-view
                        comp="sguView"
                        :view-param="{id:scope.row.id,number:scope.row.sguNumber,isDrawer:true}"
                ></sxh-detail-view>
                <span v-if="item.id !== specialTabEnum.previewSortedSgu">
                    <el-button plain size="minier" @click="setTop(scope.row, item.sguList)" title="将SGU放到第一位">置顶</el-button>
                    <el-button plain size="minier" @click="setBottom(scope.row, item.sguList)" title="将SGU放到最后一位">置底</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
  import sguSortHandler from "./sgu-sort-handler";
  import sguCommonHandler from "./controls/sgu-common-handler";
  import SxhInputNumber from "../shixh/form/sxh-input-number";
  export default {
    name: "SguSortList",
    components: {SxhInputNumber},
    mixins: [sguSortHandler,sguCommonHandler],
    props: {},
    data: function(router) {
      return {
        data: {},
        list: [],
        previewList:[],
        activeTab:"",
        activeSguList:{},
        categoryTabs:[],
        config: {
          getListData: this.getListData,
          pagable: false
        },
        // 控制自定义排序
        diySgu:0,
        // 控制预览 数据展示
        previewSguStatus:0,
        otherCategorySgu:{
          id:1000001,
          name:"其它",
          iconUrl:"",
          sguList:[]
        },
        allCategorySgu:{
          id:1000000,
          name:"全部",
          iconUrl:""
        },
        previewSortedSgu:{
          id:1000010,
          name:"排序预览",
          iconUrl:""
        },
        // 拼接tab id枚举
        specialTabEnum:{
            otherCategorySgu:1000001,
            allCategorySgu:1000000,
            previewSortedSgu:1000010,
        },
        adviceRequest: null,
        request: {
          sguName: "",
          sguNumber: ""
        }
      };
    },
    mounted() {
      this.getAndCalculateSguList();
    },
    computed: {
      account: function() {
        //商品池
        var user = this.$store.state.userInfo;
        var type = this.$cacheUtil.getVal("user_role_type", user.roleType, "");
        if (user.cityName > "") {
          return `${user.provinceName}-${user.cityName}`;
        } else if (user.provinceName > "") {
          return `${user.provinceName}`;
        }
        return type;
      }
    },
    watch: {
      // 状态改变 如果当前页签为预览 则刷新列表数据
      "previewSguStatus":{
        handler: function (val,oldVal) {
          var self = this;
          let currentTab = self.getActiviSguList(Number(String(self.activeTab).replace("_", "")));
          if(currentTab.id === self.specialTabEnum.previewSortedSgu){ // 当前页签为预览 计算预览列表数据
            self.calculatePreviewList(currentTab);
          }
        }
      },
      "activeTab": {
        //激活的tab发生改变
        handler: function (val,oldVal) {
          var self = this;
          if(val !=="0" && val !== oldVal){
            // 涉及dom操作 当前被激活tab 值改变 table未渲染 会出现异常
            self.$nextTick(()=>{
              let currentTab = self.getActiviSguList(val);
              // 预览 不做初始化
              if(currentTab.id === self.specialTabEnum.previewSortedSgu){ // 预览
                self.calculatePreviewList(currentTab);
                return;
              }
              // 非预览tab 做可拖拽table初始化
              self.initSortable(val, currentTab);
            });
          }
        }
      }
    },

  };
</script>
<style>
  .sgu-sort-tabs .el-tabs__item.is-active {
    border-bottom-color: #fff;
    font-weight: bolder;
  }
</style>