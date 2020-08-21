<template>
  <suplier-list :page-mode="3"></suplier-list>
</template>
<script>
import SuplierList from "./list.vue";
//直购商管理
export default {
  name: "directSuplierList",
  components: {
    SuplierList
  }
};
</script>