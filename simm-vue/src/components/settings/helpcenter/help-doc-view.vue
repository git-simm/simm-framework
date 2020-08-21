<template>
  <section class="content-section spu-edit">
    <el-row>
      <el-col :span="24" style="padding:0 50px">
        <el-card style="padding:0 20px">
          <el-button icon="el-icon-back" @click="$back" style="margin-right: 10px;">返回</el-button>
          <h2 class="text-center">{{entity.title}}</h2>
          <sxh-view-container :item-span="6" :label-width="150" style="padding:10px;">
            <sxh-view-item title="编码">{{entity.code}}</sxh-view-item>
            <sxh-view-item title="排序码">{{entity.sort}}</sxh-view-item>
            <sxh-view-item title="类型">{{ $cacheUtil.getVal('doc_type',entity.docType) }}</sxh-view-item>
            <sxh-view-item title="目录ID">{{entity.treeId}}</sxh-view-item>
          </sxh-view-container>
          <el-divider></el-divider>
          <div v-viewer v-html="entity.content"></div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import helpDocEditHandler from "@/components/settings/helpcenter/help-doc-edit-handler";
export default {
  name: "helpDocView",
  mixins: [helpDocEditHandler],
  data() {
    return {
      entity: {}
    };
  },
  created() {
    var self = this;
    this.getDoc(this.$route.params.id, entity => {
      self.entity = entity;
    });
  },
  methods: {}
};
</script>