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
        <h1>wallet.md</h1>
        <h2>Total balance</h2>
        <span>{satToUSD(totalBalance)}</span>
        {loading && <i className={styles.spinner} />}
        <a className={styles.github} href="https://github.com/mtdb/wallet.md" target="blank">
          <svg
            height="32"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            data-view-component="true"
          >
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
        </a>
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
