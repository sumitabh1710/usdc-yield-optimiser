const axios = require("axios");

const AAVE = "aave-v3";
const COMPOUND = "compound-v3";
let currentPreferred = null;
const THRESHOLD_DIFF = 0.1; // minimum % difference to consider switching

async function fetchUSDCPrice() {
  try {
    const res = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        params: { symbol: "USDC" },
        headers: {
          "X-CMC_PRO_API_KEY": "c39be1ce-67d4-4d12-a740-fa85ca2a997c",
        },
      }
    );
    const price = res.data.data.USDC.quote.USD.price;
    console.log(`🟡 USDC Price: ${price.toFixed(4)}`);
  } catch (e) {
    console.log("Price fetch failed:", e?.response?.data || e.message);
  }
}

async function fetchYields() {
  try {
    const res = await axios.get("https://yields.llama.fi/pools");
    const data = res.data.data;

    const filtered = data.filter(
      (pool) =>
        pool.symbol === "USDC" &&
        [AAVE, COMPOUND].includes(pool.project.toLowerCase()) &&
        typeof pool.apy === "number"
    );

    const result = {};
    filtered.forEach((pool) => {
      result[pool.project.toLowerCase()] = pool.apy;
    });

    return result;
  } catch (e) {
    console.log("Yield fetch failed:", e?.response?.data || e.message);
    return {};
  }
}

async function evaluate() {
  console.log("\n⏳ Evaluating yields...");

  await fetchUSDCPrice();

  const yields = await fetchYields();
  const aaveAPY = yields[AAVE] || 0;
  const compoundAPY = yields[COMPOUND] || 0;

  console.log(`🔵 Aave APY: ${aaveAPY.toFixed(2)}%`);
  console.log(`🟣 Compound APY: ${compoundAPY.toFixed(2)}%`);

  if (aaveAPY === 0 && compoundAPY === 0) {
    console.log("❌ No valid APY data found.");
    return;
  }

  const diff = Math.abs(aaveAPY - compoundAPY);

  let newPreferred = aaveAPY > compoundAPY ? AAVE : COMPOUND;

  if (!currentPreferred) {
    currentPreferred = newPreferred;
    console.log(`✅ Initial recommendation: Use ${currentPreferred}`);
  } else if (newPreferred !== currentPreferred && diff >= THRESHOLD_DIFF) {
    console.log(
      `🔁 Suggest switching to ${newPreferred} (APY diff: ${diff.toFixed(2)}%)`
    );
    currentPreferred = newPreferred;
  } else {
    console.log(`✅ Stay on ${currentPreferred}`);
  }

  console.log("🕒 Waiting 30 seconds for next evaluation...");
}

console.log("🚀 Starting USDC Yield Optimiser Bot...");
evaluate(); // run once immediately
setInterval(evaluate, 30 * 1000); // repeat every 30 seconds
