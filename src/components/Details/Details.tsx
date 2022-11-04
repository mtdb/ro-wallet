import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import actions from "../../actions";
import { Context } from "../../App";
import { IHistoricalTransaction as ITransaction } from "../../store";
import { satToBTC, satToUSD as s2u, slugify } from "../../utils";
import arrow from "./arrow.svg";
import cs from "./Details.module.css";

const sumValues = (x: { value: number }[]) =>
  x.reduce((accum, { value }) => accum + value, 0);

const Loading = () => (
  <div className={cs.ldsEllipsis}>
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
    <div className={cs.container}>
      <div className={cs.header}>
        <div>
          <Link href="/">
            <div className={cs.backButton}>
              <img src={arrow} alt="back" />
            </div>
          </Link>
        </div>
        <div className={cs.balanceBox}>
          <h2>{title}</h2>
          <div className={cs.balance}>{satToBTC(total)}</div>
          <small className={cs.usdAmount}>{satToUSD(total)}</small>
        </div>
        <div className={cs.headerFooter} />
      </div>
      <div className={cs.transactions}>
        <h2>Activity</h2>
        {loading ? (
          <Loading />
        ) : (
          <ul className={cs.activityList}>
            {transactions.map(({ blockTime, txid, value, balance }) => (
              <li key={txid}>
                <div>
                  {satToBTC(value)}
                  <br />
                  <small
                    className={cs.date}
                    title={moment(blockTime * 1000).format("L")}
                  >
                    {moment(blockTime * 1000).format("L")}
                  </small>
                </div>
                <div className={cs.itemBalance}>
                  <span>{satToBTC(balance)}</span>
                  <span className={value > 0 ? cs.boxGreen : cs.boxRed}>
                    {value > 0 ? "Received" : "Sent"}
                  </span>
                </div>
              </li>
            ))}
            {transactions.length === 0 && (
              <li className={cs.noTxsTxt}>No transactions to show.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export { Details };
