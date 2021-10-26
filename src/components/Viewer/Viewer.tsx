import { useContext, useEffect, useState } from "react";
import { Link } from "wouter";
import { Context } from "../../App";
import { satToBTC, satToUSD as s2u, slugify } from "../../utils";
import EditIcon from "../props/EditIcon";
import GithubIcon from "../props/GithubIcon";
import Spinner from "../props/Spinner";
import cs from "./Viewer.module.css";

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
    <div className={cs.container}>
      <div className={cs.header}>
        <div className={cs.title}>
          <h1>My Wallet</h1>
          <a
            className={cs.github}
            href="https://github.com/mtdb/wallet.md"
            target="blank"
          >
            <GithubIcon />
          </a>
        </div>
        <div className={cs.balanceBox}>
          <h2>Total balance</h2>
          <span>{satToUSD(totalBalance)}</span>
          {loading && <Spinner />}
        </div>
        <div className={cs.headerFooter} />
      </div>
      <div className={cs.wallets}>
        <div className={cs.actions}>
          <h2>Wallets</h2>
          <EditIcon />
        </div>
        <div className={cs.walletList}>
          {wallets.map(({ title }) => (
            <Link key={title} href={`/${slugify(title)}`}>
              <div className={cs.walletItem}>
                <div className={cs.badge}>{title[0]}</div>
                <div className={cs.title}>
                  <h3>{title}</h3>
                  <small>≈ {satToUSD(walletBalance[title])}</small>
                </div>
                <div className={cs.value}>{satToBTC(walletBalance[title])}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Viewer };
