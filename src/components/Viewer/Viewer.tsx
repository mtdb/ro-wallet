import { useContext, useEffect, useState } from "react";
import styles from "./Viewer.module.css";
import { Context } from "../../App";

interface IBalance {
  [key: string]: number;
}

const satToBTC = (x: number) => x / 100000000 + " BTC";

const Viewer = () => {
  const { wallets, btcPrice } = useContext(Context);
  const [totalBalance, setTotal] = useState(0);
  const [walletBalance, setBalances] = useState({} as IBalance);

  useEffect(() => {
    let total = 0;
    const balances = {} as IBalance;

    wallets.forEach(({ title, addresses }) => {
      const value = addresses.reduce((accum, { value }) => accum + value, 0);
      balances[title] = value;
      total += value;
    });
    setTotal(total);
    setBalances(balances);
  }, [wallets]);

  const satToUSD = (x: number) =>
    ((x / 100000000) * btcPrice).toLocaleString() + " USD";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>code-wallet</h1>
        <h2>Total balance</h2>
        <span>{satToUSD(totalBalance)}</span>
      </div>
      <div className={styles.wallets}>
        <h2>Wallets</h2>
        <div className={styles["box-container"]}>
          {wallets.map(({ title }) => (
            <div key={title} className={styles.box}>
              <h3>{title}</h3>
              <span>{satToBTC(walletBalance[title])}</span>
              <small>≈ {satToUSD(walletBalance[title])}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Viewer };
