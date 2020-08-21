<template>
  <section class="content-section help_center">
    <!-- @on-drag-end="onDragEnd"
      @on-drag-start="onDragStart"
    @ondrag="onDrag"-->
    <split style="height: calc(100vh)">
      <split-area :size="20" :min-size="300">
        <help-doc-tree @onChange="getTreeIdList"></help-doc-tree>
      </split-area>
      <split-area :size="80" :min-size="900">
        <help-doc-list ref="helpDocList"></help-doc-list>
      </split-area>
    </split>
    <!-- <el-container>
      <el-aside width="300px" style="overflow-y:hidden;">
        <help-doc-tree @onChange="getTreeIdList"></help-doc-tree>
      </el-aside>
      <el-container>
        <el-main>
          <help-doc-list ref="helpDocList"></help-doc-list>
        </el-main>
      </el-container>
    </el-container>-->
  </section>
</template>
<script>
import helpDocTree from "@/components/settings/helpcenter/help-doc-tree";
import helpDocList from "@/components/settings/helpcenter/help-doc-list";
export default {
  name: "helpCenter",
  //   mixins: [adjustHandler, baseMixin],
  components: { helpDocTree, helpDocList },
  data() {
    return {};
  },
  methods: {
    getTreeIdList(data) {
      this.$refs.helpDocList.seachByTreeIds(data);
    }
  }
};
</script>
<style lang="less" scoped>
</style>