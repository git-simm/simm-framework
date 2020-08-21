<template>
  <bill-list :page-mode="2"></bill-list>
</template>
<script>
import BillList from "./list.vue";
//直购商管理
export default {
  name: "agentList",
  components: {
    BillList
  }
};
</script>
