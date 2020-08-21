<template>
  <section class="content-section prod-analysis">
    <split style="height: calc(100vh - 100px)">
      <split-area :size="50" :min-size="500">
        <analysis-sgu-list ref="analysisSguList" :prod-id="id"></analysis-sgu-list>
      </split-area>
      <split-area :size="50" :min-size="500">
        <analysis-so-list ref="analysisSoList" :prod-id="id"></analysis-so-list>
      </split-area>
    </split>
  </section>
</template>
<script>
import analysisSguList from "@/components/prod/analysis/analysis-sgu-list";
import analysisSoList from "@/components/prod/analysis/analysis-so-list";
export default {
  name: "prodAnalysis",
  components: { analysisSguList, analysisSoList },
  props: {
    prodId: {
      type: Number,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      id: this.prodId,
    };
  },
};
</script>
<style lang="less" scoped>
</style>