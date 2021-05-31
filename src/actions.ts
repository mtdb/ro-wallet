import { IWallet } from "./store";

const api = {
  blockstream: {
    address: (a: string) => `https://blockstream.info/api/address/${a}`,
  },
  mempool: {
    address: (a: string) => `https://mempool.space/api/address/${a}`,
  },
  binance: {
    avgPrice: (s: string) =>
      `https://api.binance.com/api/v3/avgPrice?symbol=${s}`,
  },
};

const getWalletsData = async (data: any) => {
  const promises = [] as Promise<void>[];
  const values = {} as { [key: string]: number };
  Object.keys(data).forEach((key) => {
    data[key].forEach((address: string) => {
      promises.push(
        (async () => {
          let response = await fetch(api.blockstream.address(address));
          let json = await response.json();
          values[address] = json.chain_stats.funded_txo_sum;
        })()
      );
    });
  });
  await Promise.all(promises);
  const walletsData = Object.keys(data).map((key) => {
    const addresses = data[key].map((address: string) => {
      return { address, value: values[address] };
    });
    return { title: key, addresses };
  });
  return walletsData as IWallet[];
};

const getBitcoinPrice = async () => {
  let response = await fetch(api.binance.avgPrice("BTCUSDT"));
  let json = await response.json();
  localStorage.setItem("btcPrice", json.price);
  return json.price;
};

const actions = {
  wallets: { retrieve: getWalletsData },
  btcPrice: { get: getBitcoinPrice },
};

export default actions;
