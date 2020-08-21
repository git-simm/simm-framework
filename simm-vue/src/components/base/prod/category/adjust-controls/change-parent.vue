<template>
  <section class="content-section layer-container">
    <h4 class="text-theme">提示：类目只支持平级迁移</h4>
    <el-form :model="category" :rules="rules" label-width="100px" ref="category">
      <el-form-item label="当前分类">
        <span>{{ parentLevel.join(" / ")}}{{" / "+ category.categoryName}}</span>
        <el-tag
          size="mini"
          effect="plain"
        >{{category.categoryLevel==1?"一级类目":category.categoryLevel==2?"二级类目":category.categoryLevel==3?"三级类目":""}}</el-tag>
      </el-form-item>
      <el-form-item label="新父级类目">
        <sxh-category
          :level="showLevel"
          :fix-level="true"
          :check-strictly="false"
          @change="parentChange"
        ></sxh-category>
      </el-form-item>
    </el-form>
    <div class="layer-footer" style="text-align:center;">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="closeWin">取 消</el-button>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      parentLevel: [],
      newParentId: null,
      category: {},
      invoke: null,
      rules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    showLevel() {
      return this.category.categoryLevel - 1;
    }
  },
  created() {
    this.category = this.$options.propsData.category || {};
    this.invoke = this.$options.propsData.invoke;
    if (this.category.parent != null) {
      this.parentLevel.unshift(this.category.parent.categoryName);
      if (this.category.parent.parent != null) {
        this.parentLevel.unshift(this.category.parent.parent.categoryName);
      }
    }
  },
  methods: {
    parentChange(val) {
      if ((val.categoryList || []).length > 0) {
        this.newParentId = val.categoryList[val.categoryList.length - 1];
      } else {
        this.newParentId = null;
      }
    },
    save() {
      if (
        this.category.parentId === this.newParentId ||
        this.newParentId == null
      ) {
        this.$commonUtil.message.alert(`请切换新的父级类目`);
        return;
      }
      var self = this;
      this.$confirm(
        "操作将同步刷新业务数据的类目信息，确认继续执行迁移操作?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self.exec();
        })
        .catch(() => {});
    },
    /**
     * 执行方法
     */
    exec() {
      var param = {
        refId: this.category.id,
        cmdType: "change_parent",
        cmdRemark: `类目[${this.category.categoryName}(${this.category.id})]原父级为[${this.category.parentId}]，调整父级为[${this.newParentId}]`,
        cmdJson: JSON.stringify({
          categoryId: this.category.id,
          categoryName: this.category.categoryName,
          level: this.category.categoryLevel,
          parentId: this.category.parentId,
          newParentId: this.newParentId
        })
      };
      this.invoke(param, this.closeWin, this.closeWin);
    },
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    }
  }
};
</script>