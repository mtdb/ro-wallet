import { Dispatch, SetStateAction } from "react";

interface IAddress {
  address: string;
  value: number;
}

export interface IWallet {
  title: string;
  addresses: IAddress[];
}

const example = `# Test account:
1AJ3AzFCusdG7dyCX2H1fsCVfmA5bPs1fe
1MQN9MFhg7rLFrw9anbEwTBY6PatVydzDi

# Account 2:
13HwKWsEpcQy9PAbcpzDqARfm2wEG7Lnfs`;

export interface ITransaction {
  status: {
    confirmed: boolean;
    block_time: number;
  };
  vin: {
    prevout: {
      value: number;
      scriptpubkey_address: string;
    };
  }[];
  vout: {
    scriptpubkey_address: string;
    value: number;
  }[];
  txid: string;
}

export interface IHistoricalTransaction {
  txid: string;
  balance: number;
  blockTime: number;
  confirmed: boolean;
  value: number;
}

export const initialStore = {
  wallets: [] as IWallet[],
  setWallets: (() => {}) as Dispatch<SetStateAction<IWallet[]>>,
  data: localStorage.getItem("mdFile") || example,
  setData: (() => {}) as Dispatch<SetStateAction<string>>,
  btcPrice: localStorage.getItem("btcPrice")
    ? Number(localStorage.getItem("btcPrice"))
    : 0,
  setPrice: (() => {}) as Dispatch<SetStateAction<number>>,
};
