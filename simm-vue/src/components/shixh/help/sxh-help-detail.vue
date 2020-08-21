<template>
  <div>
    <div v-if="showTitle">
      <h3 style="color:maroon;">{{entity.title}}</h3>
      <p style="color:gray;">更新时间：{{entity.updateAt}}</p>
    </div>
    <div v-viewer v-html="entity.content>''?entity.content:'暂无操作手册'"></div>
  </div>
</template>
<script>
import helpDocEditHandler from "@/components/settings/helpcenter/help-doc-edit-handler";
export default {
  name: "sxhHelpDetail",
  mixins: [helpDocEditHandler],
  props: {
    code: {
      type: String,
      default: null
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      entity: {}
    };
  },
  created() {
    var self = this;
    this.getDoc(this.code, entity => {
      self.entity = entity;
    });
  },
  methods: {
    getDoc(code, callback) {
      this.$httpUtil.post({
        url: "/helpdoc/list.json",
        data: { code: code, pageNo: 1, pageSize: 100 },
        contentType: "form",
        succ: function(data) {
          var page = data.data || {};
          if ((page.records || []).length > 0 && callback) {
            callback(page.records[0]);
          }
        }
      });
    }
  }
};
</script>