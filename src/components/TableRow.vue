<template>
  <div class="text-2xl">{{ index + 1 }}</div>
  <div class="text-2xl grid grid-cols-2">
    <img :src="`${name}.png`" :alt="`APY of ${name}`" class="w-10 h-10" />
    <span>{{ name }}</span>
  </div>
  <div class="text-2xl">{{ supplyApy }}</div>
  <div class="text-2xl">{{ compApy }}</div>
  <div class="text-2xl">{{ apy }}</div>
  <hr class="col-span-full border-t-4" />
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    index: Number,
    name: String,
    supplyApy: Number,
    compApy: Number,
    apy: Number,
  },
  setup() {
    return {};
  },
});
</script>

<style></style>
