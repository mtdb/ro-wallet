import React, { useState } from "react";
import { Route } from "wouter";
import "./App.css";
import Wallet from "./components/Wallet";
import { initialStore } from "./store";

export const Context = React.createContext(initialStore);

const App = () => {
  const [wallets, setWallets] = useState(initialStore.wallets);
  const [data, setData] = useState(initialStore.data);
  const [btcPrice, setPrice] = useState(initialStore.btcPrice);

  return (
    <Context.Provider
      value={{ wallets, setWallets, data, setData, btcPrice, setPrice }}
    >
      <Route path="/" component={Wallet} />
    </Context.Provider>
  );
};

export default App;
