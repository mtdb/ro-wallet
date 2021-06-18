import { IWallet, ITransaction } from "./store";

const api = {
  blockstream: {
    address: (a: string) => `https://blockstream.info/api/address/${a}`,
    txs: (a: string) => `https://blockstream.info/api/address/${a}/txs`,
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

const getTransactionHistory = async (addresses: string[]) => {
  const promises = [] as Promise<void>[];
  let txs = [] as ITransaction[];
  addresses.forEach((address) => {
    promises.push(
      (async () => {
        // returns up to 50 mempool transactions plus the first 25 confirmed transactions
        let response = await fetch(api.blockstream.txs(address));
        const transactions = await response.json();
        const t = transactions.map((transaction: ITransaction) => {
          for (let q = 0; q < transaction.vout.length; q += 1) {
            if (transaction.vout[q].scriptpubkey_address === address) {
              return { ...transaction, value: transaction.vout[q].value };
            }
          }
          return transaction;
        });
        txs = txs.concat(t);
      })()
    );
  });
  await Promise.all(promises);
  return txs.sort(
    (a: ITransaction, b: ITransaction) =>
      a.status.block_time - b.status.block_time
  );
};

const getBitcoinPrice = async () => {
  let response = await fetch(api.binance.avgPrice("BTCUSDT"));
  let json = await response.json();
  localStorage.setItem("btcPrice", json.price);
  return json.price;
};

const actions = {
  wallets: { retrieve: getWalletsData, getTxs: getTransactionHistory },
  btcPrice: { get: getBitcoinPrice },
};

export default actions;
