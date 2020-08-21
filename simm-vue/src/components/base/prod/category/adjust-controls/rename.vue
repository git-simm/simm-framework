<template>
  <section class="content-section layer-container">
    <el-form :model="category" :rules="rules" label-width="100px" ref="category">
      <el-form-item label="当前分类名称">
        <span>{{category.oldCategoryName}}</span>
      </el-form-item>
      <el-form-item label="新分类名称" prop="categoryName">
        <el-input placeholder="请输入分类名称" v-model.trim="category.categoryName"></el-input>
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
      category: {},
      invoke: null,
      rules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.category = this.$options.propsData.category || {};
    this.category.oldCategoryName = this.category.categoryName;
    this.invoke = this.$options.propsData.invoke;
  },
  methods: {
    save() {
      if (
        this.category.oldCategoryName === this.category.categoryName ||
        this.category.categoryName == ""
      ) {
        this.$commonUtil.message.alert(`请输入新的分类名称`);
        return;
      }
      var self = this;
      this.$confirm(
        "操作将同步刷新业务数据的类目名称，确认继续执行重命名操作?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self.checkCategoryName();
        })
        .catch(() => {});
    },
    /**
     * 执行处理逻辑
     */
    exec() {
      var param = {
        refId: this.category.id,
        cmdType: "rename",
        cmdRemark: `类目[${this.category.id}]原名为[${this.category.oldCategoryName}]，重命名为[${this.category.categoryName}]`,
        cmdJson: JSON.stringify({
          categoryId: this.category.id,
          level: this.category.categoryLevel,
          categoryName: this.category.oldCategoryName,
          newCategoryName: this.category.categoryName
        })
      };
      this.invoke(param, this.closeWin, this.closeWin);
    },
    closeWin: function() {
      this.$layerUtil.closeWin(this);
    },
      checkCategoryName() {
      var self = this;
      this.$httpUtil.post({
        url: "/base/prod/category/checkCategoryName.json",
        data: {
          id: self.category.id,
          categoryName: self.category.categoryName
        },
        contentType: "json", //json,form,multipart
          succ: function (data) {
          self.exec();
        }
      });
    }
  }
};
</script>