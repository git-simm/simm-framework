<template>
  <span ref="container">
    <el-dropdown v-if="isShow">
      <span class="el-dropdown-link">
        {{linkName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu class="dropdown-menu-cls" ref="menus" slot="dropdown">
        <slot></slot>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
export default {
  name: "sxh-dropdown",
  props: {
    linkName: {
      type: String,
      default: "更多"
    },
    minSize: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      isShow: true
    };
  },
  mounted() {
    var self = this;
    //挂载完成，需要看下挂载的节点数量(过滤掉隐藏的元素展示)
    var children = (self.$refs.menus.$children || []).filter(a => {
      if (!a.$el) return false;
      if (a.$children.length === 0 && a.$el.children.length === 0) return false;
      var b1 = !a.$el.hidden;
      var b2 = true;
      if (a.$children && a.$children.length > 0) {
        b2 = !a.$children[0].$el.hidden;
      }
      return b1 && b2;
    });
    self.isShow = children.length >= self.minSize;
    if (!self.isShow) {
      var container = this.$refs.container;
      const h = this.$createElement;
      children.forEach(comp => {
        for (let c of comp.$el.children) {
          var btn = document.createElement("button");
          btn.setAttribute("type", "button");
          btn.className =
            "el-button el-button--default el-button--minier is-plain";
          btn.innerText = c.innerText;
          c.innerText = "";
          c.appendChild(btn);
          container.appendChild(c);
        }
      });
    }
  },
  methods: {}
};
</script>

<style>
.dropdown-menu-cls .el-dropdown-menu__item > * {
  display: block;
  width: 100%;
}
</style>
