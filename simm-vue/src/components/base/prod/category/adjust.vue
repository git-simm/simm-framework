<template>
  <section class="content-section adjust_page">
    <el-container>
      <el-aside width="300px" style="overflow-y:hidden;">
        <section class="sidebar">
          <!-- <el-row>
          <el-col :span="24">
            <el-button icon="el-icon-back" @click="$back" style="margin-right: 10px;">返回</el-button>
          </el-col>
          <el-col :span="20">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="12">
              <h4 style="padding-left:10px;">商品类目</h4>
            </el-col>
            <el-col :span="12">
              <div class="pull-right">
                <el-button
                  icon="el-icon-back"
                  size="mini"
                  @click="$back"
                  style="margin-right: 10px;"
                >返回</el-button>
              </div>
            </el-col>
          </el-row>

          <el-tree
            ref="tree"
            class="filter-tree"
            node-key="value"
            highlight-current
            :filter-node-method="filterNode"
            :data="categoryOptions"
            :expand-on-click-node="false"
            @current-change="currentChange"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i class="el-icon-files" v-if="node.level<3"></i>
                <i class="el-icon-postcard" v-else></i>
                [{{data.value}}]{{ node.label }}
              </span>
              <span v-permission:adjust_category>
                <el-dropdown trigger="click">
                  <el-button size="mini" type="text" title="点击选择要执行的命令">
                    <i class="el-icon-setting"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-edit" @click.native="() => rename(node,data)" >
                      <span >重命名</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="data.category.categoryLevel>1"
                      icon="el-icon-position"
                      @click.native="() => move(node,data)"
                    >
                      <span >迁移</span>
                    </el-dropdown-item>
                     <el-dropdown-item
                             v-if="data.category.categoryLevel==3"
                             icon="el-icon-sell"
                     >
                       <sxh-excel-import
                           label="SPU导入"
                           :tooltip="tooltip"
                           :tooltip-width="400"
                           :post-data="postData"
                           :show-fields="requiredFields"
                           :row-valid="rowValid"
                       ><span >SPU导入</span></sxh-excel-import>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </section>
      </el-aside>
      <el-container>
        <el-main>
          <el-tabs v-model="activeName" type="border-card" ref="tabs">
            <el-tab-pane label="操作说明" name="remark">
              <adjust-remark ref="remark"></adjust-remark>
            </el-tab-pane>
            <el-tab-pane label="指令管理" name="sysCmd">
              <cmd-list ref="cmdList"></cmd-list>
            </el-tab-pane>
            <el-tab-pane label="SPU" name="spuList">
              <spu-list
                v-if="activeName==`spuList`"
                :filter="currCategory"
                ref="spuList"
                :key="`spu_${currCategoryId}`"
              ></spu-list>
            </el-tab-pane>
            <el-tab-pane label="SKU" name="skuList">
              <sku-list
                v-if="activeName==`skuList`"
                :filter="currCategory"
                ref="skuList"
                :key="`sku_${currCategoryId}`"
              ></sku-list>
            </el-tab-pane>
            <el-tab-pane label="商品" name="prodList">
              <prod-list
                v-if="activeName==`prodList`"
                :filter="currCategory"
                ref="prodList"
                :key="`prod_${currCategoryId}`"
              ></prod-list>
            </el-tab-pane>
            <el-tab-pane label="SGU" name="sguList">
              <sgu-list
                v-if="activeName==`sguList`"
                :filter="currCategory"
                ref="sguList"
                :key="`sgu_${currCategoryId}`"
              ></sgu-list>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>
<script>
import adjustHandler from "./adjust-handler.js";
import baseMixin from "@/common/mixins/baseMixin";
import adjustRemark from "./adjust-controls/adjust-remark";
import cmdList from "./adjust-controls/cmd-list";
import spuList from "@/components/spumanager/spu-list.vue";
import skuList from "@/components/base/prod/info/list.vue";
import sguList from "@/components/sgumanager/sgu-list";
import prodList from "@/components/prod/prodmanage/list.vue";
export default {
  name: "Category-Adjust",
  mixins: [adjustHandler, baseMixin],
  components: { adjustRemark, cmdList, spuList, skuList, sguList, prodList },
  data() {
    return {
      currCategoryId: "",
      filterText: "",
      activeName: "remark",
      categoryList: [],
      currCategory: {},
      requiredFields: [`SPU编码`],
      tooltip: `1、请先在SPU管理页面点击【导出】按钮，导出需要操作的的SPU列表；<br/>
      2、导出后上传时，"SPU编码"为必填信息；<br/>
      3、只能上传xlx/xlsx文件；<br/>
      4、一次导入SPU数量最多200条`,
      compObj:{
        comp:this,
        callback:(msg)=>{
          this.socketMsgHandler(msg);
        }
      }
    };
  },
  computed:{

  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getCategoryList();
    this.$socketUtil.addComponent(this.compObj);
  },
  destroyed(){
    this.$socketUtil.removeComponent(this.compObj);
  },
  methods: {
    // 消息处理  交互待优化
    socketMsgHandler(msg){
      var self = this;
      if(msg && msg.businessCode == "category_adjust"){
        if(msg.message.cmdType == "rename"
                || msg.message.cmdType == "change_parent"
                || msg.message.cmdType == "spu_import"){
          // 数据刷新
          self.endFunc();
        }

      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    postData(data){
      var self=this;
      var jsonList = this.wrapData(data);
      if((jsonList || []).length>200){
        self.$commonUtil.valid.throwEx(`一次导入SPU数量最多200条，请调整后重新上传`);
      }
      if((jsonList || []).length>0){
        this.$confirm('共导入'+jsonList.length + "条SPU到三级类目【"+self.currCategory.threeCategoryName+"】<br>操作将同步刷新业务数据的类目名称，确认继续执行SPU导入操作?", "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  dangerouslyUseHTMLString: true,
                  type: "warning"
                }
        ).then(() => {
          var param = {
            refId: self.currCategory.threeCategoryId,
            cmdType: "spu_import",
            cmdRemark:'共导入'+jsonList.length+'条SPU到【'+self.currCategory.threeCategoryName+'】类目',
            cmdJson: JSON.stringify({
              categoryId: self.currCategory.threeCategoryId,
              spuNumberList:jsonList
            })
          };
          self.invoke(param,null,null);
        }).catch(() => {
        });
      }
    },
    /**
     * 行数据校验
     */
    rowValid(row, index) {
      var errors = [];
      (this.requiredFields || []).forEach(f => {
        if (row[f] == null || row[f] == "") {
          errors.push(`[${f}]`);
        }
      });
      if (errors.length > 0) {
        return `${errors.join("、")} 为空`;
      }
      return null;
    },
    wrapData(data){
      let jsonArray=[];
      var fields = {
        spuNumber: { title: "SPU编码" }
      };
      for (let i = 0; i < data.length; i++) {
        let item = {};
        for (var f in fields) {
          var fieldInfo = fields[f];
          var title = fieldInfo.title;
          item[f] = data[i][title];
        }
        jsonArray.push(item.spuNumber);
      }
      return jsonArray;
    }
  }
};
</script>
<style lang="less">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.adjust_page {
  .sidebar {
    border: 1px solid #dcdfe6;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
      0 0 6px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  }
  .el-main {
    padding: 0 0 0 10px !important;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: inherit !important;
  }
}
</style>