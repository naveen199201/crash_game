// services/priceService.js
import axios from 'axios';

let cachedPrices = null;
let lastFetch = 0;

export async function getCryptoPrice(symbol) {
  const now = Date.now();
  if (!cachedPrices || now - lastFetch > 10000) {
    const response = await axios.get(
      `${process.env.COINGECKO_API}?ids=bitcoin,ethereum&vs_currencies=usd`
    );
    cachedPrices = {
      BTC: response.data.bitcoin.usd,
      ETH: response.data.ethereum.usd
    };
    lastFetch = now;
  }
  return cachedPrices[symbol];
}