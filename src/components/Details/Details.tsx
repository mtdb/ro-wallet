import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import actions from "../../actions";
import { Context } from "../../App";
import { ITransaction } from "../../store";
import { satToBTC, satToUSD as s2u, slugify } from "../../utils";
import styles from "./Details.module.css";

const sumValues = (x: { value: number }[]) =>
  x.reduce((accum, { value }) => accum + value, 0);

const Details = ({ slug }: { slug: string }) => {
  const { wallets, btcPrice } = useContext(Context);
  const [transactions, setTransactions] = useState([] as ITransaction[]);
  const [total, setTotal] = useState(0);

  const setLocation = useLocation()[1];

  useEffect(() => {
    const wallet = wallets.find(({ title }) => slugify(title) === slug);
    if (!wallet) {
      setLocation("/");
      return;
    }

    (async () => {
      const txs = await actions.wallets.getTxs(
        wallet.addresses.map((x) => x.address)
      );
      setTransactions(txs);
    })();
    setTotal(sumValues(wallet.addresses));
  }, [slug, wallets, setLocation]);

  const satToUSD = s2u(btcPrice);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <h1>plaintext-wallet</h1>
        </Link>
        <h2>Wallet balance</h2>
        <span>{satToBTC(total)}</span>
        <small>{satToUSD(total)}</small>
      </div>
      <div className={styles.transactions}>
        <h2>Activity</h2>
        <ul>
          {transactions.map(({ status, txid, value }) => (
            <li key={txid}>
              <div>
                <span>[received]</span>
                <br />
                <small title={moment(status.block_time * 1000).calendar()}>
                  {moment(status.block_time * 1000).calendar()}
                </small>
              </div>
              <div>{satToBTC(value)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { Details };
