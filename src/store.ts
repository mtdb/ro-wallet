import { Dispatch, SetStateAction } from "react";

interface IAddress {
  address: string;
  value: number;
}

export interface IWallet {
  title: string;
  addresses: IAddress[];
}

const example = `# Hot Wallet
<!-- List of dummy addresses for a hot wallet -->
3KDDVr4qL8tuzPuJxWtK1H5s3YQYDChXCg
1E5vzYh9ct8VxByyejxvx7qmHh42G4q8j9
15r86iZ5pKUJ7CngxucwHYJsSffPgsPymL

# Paper Wallet
142cmpT8yFYg1YGRRgiCB37W4euinAWb21

# Ledger
<!--
All the addresses were chosen randomly just for
demonstration purposes
-->
3KDDVr4qL8tuzPuJxWtK1H5s3YQYDChXCg
1E5vzYh9ct8VxByyejxvx7qmHh42G4q8j9
15r86iZ5pKUJ7CngxucwHYJsSffPgsPymL

<!--
This markdown document is stored locally, if you open it on a different device you will need to copy the content from it to see the wallets.
-->`;

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
