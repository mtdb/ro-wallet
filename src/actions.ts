import { IWallet, ITransaction, IHistoricalTransaction } from "./store";
export interface IParsedData {
  [title: string]: string[];
}

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

const getWalletsData = async (data: IParsedData) => {
  const promises = [] as Promise<void>[];
  const values = {} as { [key: string]: number };
  Object.keys(data).forEach((key) => {
    data[key].forEach((address: string) => {
      promises.push(
        (async () => {
          let response = await fetch(api.blockstream.address(address), {
            // cache: "force-cache", // uncomment for development
          });
          let json = await response.json();
          values[address] =
            json.chain_stats.funded_txo_sum - json.chain_stats.spent_txo_sum;
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
  const txs = [] as IHistoricalTransaction[];
  const myTxs = {} as { [key: string]: boolean };
  const myAddresses = {} as { [key: string]: boolean };
  let balance = 0;

  addresses.forEach((address) => {
    myAddresses[address] = true;
  });
  addresses.forEach((address) => {
    promises.push(
      (async () => {
        // returns up to 50 mempool transactions plus the first 25 confirmed transactions
        const response = await fetch(api.blockstream.txs(address), {
          cache: "force-cache",
        });
        const transactions = await response.json();

        transactions.forEach((transaction: ITransaction) => {
          if (!transaction.txid) return;

          let value = 0;
          for (let q = 0; q < transaction.vout.length; q += 1) {
            if (myAddresses[transaction.vout[q].scriptpubkey_address])
              value += transaction.vout[q].value;
          }
          for (let q = 0; q < transaction.vin.length; q += 1) {
            if (myAddresses[transaction.vin[q].prevout.scriptpubkey_address])
              value -= transaction.vin[q].prevout.value;
          }

          if (!myTxs[transaction.txid]) {
            myTxs[transaction.txid] = true;
            txs.push({
              txid: transaction.txid,
              confirmed: transaction.status.confirmed,
              blockTime:
                transaction.status.block_time || new Date().valueOf() / 1000, // !block_time => unconfirmed
              value,
              balance: 0,
            });
          }
        });
      })()
    );
  });
  await Promise.all(promises);

  return txs
    .sort((a: any, b: any) => a.blockTime - b.blockTime)
    .map((x: any) => {
      balance += x.value;
      return { ...x, balance };
    })
    .reverse();
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
