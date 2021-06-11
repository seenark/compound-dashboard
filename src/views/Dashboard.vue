<template>
  <h1 class="text-3xl py-8">Compound Dashboard</h1>
  <div class="container mx-auto">
    <div class="grid grid-cols-5 grid-flow-row items-center gap-4">
      <div class="text-2xl">#</div>
      <div class="text-2xl">Name</div>
      <div class="text-2xl">Supply APY</div>
      <div class="text-2xl">Comp APY</div>
      <div class="text-2xl">APY</div>
      <hr class="col-span-full border-t-4" />
      <!-- data -->
      <TableRow
        v-for="(data, index) in dataList.datas"
        :key="index"
        :index="index"
        :name="data.ticker"
        :supplyApy="data.supplyApy"
        :compApy="data.compApy"
        :apy="data.supplyApy + data.compApy"
      />
      <!-- data end -->
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import useAPY from "../useAPY";
import cTokenList from "../CTokenList";
import TableRow from "../components/TableRow.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    TableRow,
  },
  setup() {
    const { calculateApy } = useAPY;
    const dataList = reactive({ datas: [] });
    const coinList = [
      cTokenList.ETH,
      cTokenList.DAI,
      cTokenList.USDC,
      cTokenList.USDT,
      cTokenList.UNI,
      cTokenList.LINK,
    ];
    onMounted(async () => {
      const promiseList = [];
      coinList.forEach((e) => {
        const cToken = `c${e}`;
        const token = e;
        // const d = await calculateApy(cToken, token);
        // dataList.push(d);
        promiseList.push(calculateApy(cToken, token));
      });
      // console.log("🚀 ~ file: Dashboard.vue ~ line 49 ~ onMounted ~ dataList", dataList);
      dataList.datas = await Promise.all(promiseList);
      console.log("🚀 ~ file: Dashboard.vue ~ line 51 ~ onMounted ~ dataList", dataList.datas);

      // console.log(await calculateApy(cTokenList.cDAI, cTokenList.DAI));
    });

    return { dataList };
  },
});
</script>

<style></style>
