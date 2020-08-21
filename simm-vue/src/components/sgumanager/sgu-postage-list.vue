<template>
  <sgu-list :page-mode="2"></sgu-list>
</template>
<script>
  import SguList from "./sgu-list.vue";
  export default {
    name: "sguPostageList",
    components: {
      SguList
    }
  };
</script>