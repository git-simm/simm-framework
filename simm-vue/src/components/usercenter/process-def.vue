<template>
  <section class="content-section">
    <h4 class="text-theme">{{$flows.spu.name}}</h4>
    <sxh-process-def :process-def="$flows.spu"></sxh-process-def>
    <h4 class="text-theme">{{$flows.sku.name}}</h4>
    <sxh-process-def :process-def="$flows.sku"></sxh-process-def>
    <h4 class="text-theme">{{$flows.supply.name}}</h4>
    <sxh-process-def :process-def="$flows.supply"></sxh-process-def>
    <h4 class="text-theme">{{$flows.prod.name}}</h4>
    <sxh-process-def :process-def="$flows.prod"></sxh-process-def>
    <h4 class="text-theme">{{$flows.sgu.name}}</h4>
    <sxh-process-def :process-def="$flows.sgu"></sxh-process-def>
    <h4 class="text-theme">{{$flows.order.name}}</h4>
    <sxh-process-def :process-def="$flows.order"></sxh-process-def>
    <h4 class="text-theme">{{$flows.returnOrder.name}}</h4>
    <sxh-process-def :process-def="$flows.returnOrder"></sxh-process-def>
  </section>
</template>
<script>
export default {
  name: "processDef",
  methods: {}
};
</script>
