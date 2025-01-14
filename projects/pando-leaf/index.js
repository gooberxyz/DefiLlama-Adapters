const retry = require('async-retry');
const axios = require("axios");
const BigNumber = require("bignumber.js");
const { toUSDTBalances } = require('../helper/balances')

const APIs = {
  leaf: 'https://leaf-api.pando.im/api/cats'
}

async function tvl() {
  const resp = await retry(async bail => await axios.get(APIs.leaf))
  const collaterals = resp.data.data.collaterals;
  let sum = new BigNumber(0);
  for (let ix = 0; ix < collaterals.length; ix++) {
    const collateral = collaterals[ix];
    const colSum = new BigNumber(collateral.ink);
    sum = sum.plus(colSum.times(collateral.price));
  }
  return toUSDTBalances(sum);
}


module.exports = {
    misrepresentedTokens: true,
    timetravel: false,
    mixin: {
        tvl
    }
}