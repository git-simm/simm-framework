<template>
  <section class="help_doc_tree">
    <!-- <el-row>
          <el-col :span="24">
            <el-button icon="el-icon-back" @click="$back" style="margin-right: 10px;">返回</el-button>
          </el-col>
          <el-col :span="20">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          </el-col>
    </el-row>-->
    <el-row>
      <el-col :span="8">
        <h4 style="padding-left:10px;">帮助中心</h4>
      </el-col>
      <el-col :span="16">
        <div class="pull-right">
          <sxh-popover tooltip="新增一级文档目录">
            <el-button icon="el-icon-plus" size="mini" @click="addParent(0)" style>新增</el-button>
          </sxh-popover>
        </div>
      </el-col>
    </el-row>
    <el-tree
      ref="tree"
      class="filter-tree"
      node-key="item.value"
      highlight-current
      :filter-node-method="filterNode"
      :data="helpDocTreeOptions"
      :expand-on-click-node="false"
      @current-change="currentChange"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i class="el-icon-folder"></i>
          {{ node.label }}
        </span>
        <span v-permission:adjust_category>
          <el-dropdown trigger="click">
            <el-button size="mini" type="text" title="点击选择要执行的命令">
              <i class="el-icon-setting"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" @click.native="() => addChild(node,data)">
                <span>新增下级</span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit" @click.native="() => edit(node,data)">
                <span>编辑</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
    </el-tree>
  </section>
</template>
<script>
import baseMixin from "@/common/mixins/baseMixin";
import helpDocTreeHandler from "./help-doc-tree-handler";
export default {
  name: "helpDocTree",
  mixins: [helpDocTreeHandler, baseMixin],
  data() {
    return {
      currHelpDocTree:{},
      currHelpDocTreeId:"",
      treeIdList:[]
    };
  },
  created() {
    this.getHelpDocTreeList();
  },
  methods: {
       filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  }
};
</script>
<style lang="less">
</style>