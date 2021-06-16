import { useContext, useEffect, useState } from "react";
import { parse /*, stringify*/ } from "yaml";
import actions from "../../actions";
import { Context } from "../../App";
import Editor from "../Editor";
import Viewer from "../Viewer";

const Wallet = () => {
  const { data, setWallets, setPrice } = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parsedData = parse(data);
    setLoading(true);
    (async () => {
      const walletsData = await actions.wallets.retrieve(parsedData);
      const price = await actions.btcPrice.get();
      setPrice(price);
      setWallets(walletsData);
      setLoading(false)
  })();
  }, [data, setWallets, setPrice]);

  return (
    <div id="Wallet">
      <Viewer loading={loading} />
      <Editor />
    </div>
  );
};

export { Wallet };
