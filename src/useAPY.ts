import { reactive, ref } from "@vue/reactivity";
import Compound from "@compound-finance/compound-js";
import cTokenList from "./CTokenList";

const providerMainNet = ref("https://mainnet.infura.io/v3/decac4ee01104ec38f1b40e40d22b320");
const comptroller = reactive({ comptroller: Compound.util.getAddress(cTokenList.Comptroller) });
const opf = reactive({ opf: Compound.util.getAddress(cTokenList.PriceFeed) });
const cTokenDecimals = ref(8); // always 8
const blocksPerDay = ref(4 * 60 * 24); // 4 blocks in 1 minute
const daysPerYear = ref(365);
const ethMantissa = ref(Math.pow(10, 18)); // 1 * 10 ^ 18

(async () => {
  const token = cTokenList.COMP;
  const daiPrice = await Compound.eth.read(
    opf.opf,
    "function price(string memory symbol) external view returns (uint)",
    [token],
    { provider: providerMainNet.value }
  );
  console.log(token, daiPrice / 1e6);
})();

async function calculateSupplyApy(cToken: string) {
  const supplyRatePerBlock = await Compound.eth.read(cToken, "function supplyRatePerBlock() returns (uint)", [], {
    provider: providerMainNet.value,
  });

  return 100 * (Math.pow((supplyRatePerBlock / ethMantissa.value) * blocksPerDay.value + 1, daysPerYear.value - 1) - 1);
}

async function calculateCompApy(cToken: string, ticker: string, underlyingDecimals: number) {
  let compSpeed = await Compound.eth.read(
    comptroller.comptroller,
    "function compSpeeds(address cToken) public returns (uint)",
    [cToken],
    { provider: providerMainNet.value }
  );

  let compPrice = await Compound.eth.read(
    opf.opf,
    "function price(string memory symbol) external view returns (uint)",
    [cTokenList.COMP],
    { provider: providerMainNet.value }
  );

  let underlyingPrice = await Compound.eth.read(
    opf.opf,
    "function price(string memory symbol) external view returns (uint)",
    [ticker],
    { provider: providerMainNet.value }
  );

  let totalSupply = await Compound.eth.read(cToken, "function totalSupply() returns (uint)", [], {
    provider: providerMainNet.value,
  });

  let exchangeRate = await Compound.eth.read(cToken, "function exchangeRateCurrent() returns (uint)", [], {
    provider: providerMainNet.value,
  });

  exchangeRate = +exchangeRate.toString() / ethMantissa.value;
  compSpeed = compSpeed / 1e18; // COMP has 18 decimal places
  compPrice = compPrice / 1e6; // price feed is USD price with 6 decimal places
  underlyingPrice = underlyingPrice / 1e6;
  totalSupply = (+totalSupply.toString() * exchangeRate * underlyingPrice) / Math.pow(10, underlyingDecimals);

  const compPerDay = compSpeed * blocksPerDay.value;

  return 100 * ((compPrice * compPerDay) / totalSupply) * 365;
}

async function calculateApy(cToken: string, ticker: string) {
  const underlyingDecimals = (Compound.decimals as any)[cToken];
  const cTokenAddress = Compound.util.getAddress(cToken);
  const [supplyApy, compApy] = await Promise.all([
    calculateSupplyApy(cTokenAddress),
    calculateCompApy(cTokenAddress, ticker, underlyingDecimals),
  ]);
  return { ticker, supplyApy: Number.parseFloat(supplyApy.toFixed(2)), compApy: Number.parseFloat(compApy.toFixed(2)) };
}

export default {
  calculateApy,
};
