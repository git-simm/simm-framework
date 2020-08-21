<template>
  <suplier-list :page-mode="1"></suplier-list>
</template>
<script>
import SuplierList from "./list.vue";
export default {
  name: "agentSuplierList",
  components: {
    SuplierList
  }
};
</script>