<template>
  <router-view />
</template>

<script lang="ts">
import { cToken } from "@compound-finance/compound-js/dist/nodejs/api";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "App",

  setup() {
    onMounted(() => {});
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
