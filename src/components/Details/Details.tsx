import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import actions from "../../actions";
import { Context } from "../../App";
import { IHistoricalTransaction as ITransaction } from "../../store";
import { satToBTC, satToUSD as s2u, slugify } from "../../utils";
import styles from "./Details.module.css";

const sumValues = (x: { value: number }[]) =>
  x.reduce((accum, { value }) => accum + value, 0);

const Loading = () => (
  <div className={styles.ldsEllipsis}>
    <div />
    <div />
    <div />
    <div />
  </div>
);

const Details = ({ slug }: { slug: string }) => {
  const { wallets, btcPrice } = useContext(Context);
  const [transactions, setTransactions] = useState([] as ITransaction[]);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const setLocation = useLocation()[1];

  useEffect(() => {
    const wallet = wallets.find(({ title }) => slugify(title) === slug);
    if (!wallet) {
      setLocation("/");
      return;
    }

    setTitle(wallet.title);
    (async () => {
      const txs = await actions.wallets.getTxs(
        wallet.addresses.map((x) => x.address)
      );
      setTransactions(txs);
      setLoading(false);
    })();
    setTotal(sumValues(wallet.addresses));
  }, [slug, wallets, setLocation]);

  const satToUSD = s2u(btcPrice);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/">
          <h1>wallet.md</h1>
        </Link>
        <h2>{title}</h2>
        <span>{satToBTC(total)}</span>
        <small className={styles.usdAmount}>{satToUSD(total)}</small>
        <Link href="/" className={styles.close}>
          +
        </Link>
      </div>
      <div className={styles.transactions}>
        <h2>Activity</h2>
        {loading ? (
          <Loading />
        ) : (
          <ul className={styles.activityList}>
            {transactions.map(({ blockTime, txid, value, balance }) => (
              <li key={txid}>
                <div>
                  <span className={value > 0 ? styles.boxGreen : styles.boxRed}>
                    {value > 0 ? "received" : "sent"}
                  </span>
                  <br />
                  <small title={moment(blockTime * 1000).format("L")}>
                    {moment(blockTime * 1000).format("L")}
                  </small>
                </div>
                <div>{satToBTC(value)}</div>
                <div>{satToBTC(balance)}</div>
              </li>
            ))}
            {transactions.length === 0 && (
              <li className={styles.noTxsTxt}>No transactions to show.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export { Details };
