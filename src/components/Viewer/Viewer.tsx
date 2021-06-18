import { useContext, useEffect, useState } from "react";
import { Link } from "wouter";
import { Context } from "../../App";
import { slugify, satToBTC, satToUSD as s2u } from "../../utils";
import styles from "./Viewer.module.css";

interface IBalance {
  [key: string]: number;
}

const Viewer = ({ loading }: { loading: boolean }) => {
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

  const satToUSD = s2u(btcPrice);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>plaintext-wallet</h1>
        <h2>Total balance</h2>
        <span>{satToUSD(totalBalance)}</span>
        {loading && <i className={styles.spinner} />}
      </div>
      <div className={styles.wallets}>
        <h2>Wallets</h2>
        <div className={styles["box-container"]}>
          {wallets.map(({ title }) => (
            <Link key={title} href={`/${slugify(title)}`}>
              <div className={styles.box}>
                <h3>{title}</h3>
                <span>{satToBTC(walletBalance[title])}</span>
                <small>≈ {satToUSD(walletBalance[title])}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Viewer };
