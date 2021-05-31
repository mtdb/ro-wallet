import { useEffect, useContext } from "react";
import { parse /*, stringify*/ } from "yaml";
import Editor from "../Editor";
import Viewer from "../Viewer";
import actions from "../../actions";
import { Context } from "../../App";

const Wallet = () => {
  const { data, setWallets, setPrice } = useContext(Context);

  useEffect(() => {
    const parsedData = parse(data);
    (async () => {
      const walletsData = await actions.wallets.retrieve(parsedData);
      const price = await actions.btcPrice.get();
      setPrice(price);
      setWallets(walletsData);
    })();
  }, [data, setWallets, setPrice]);

  return (
    <div id="Wallet">
      <Viewer />
      <Editor />
    </div>
  );
};

export { Wallet };
