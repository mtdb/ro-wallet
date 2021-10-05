import { useContext, useEffect, useState } from "react";
import actions, { IParsedData } from "../../actions";
import { Context } from "../../App";
import Details from "../Details";
import Editor from "../Editor";
import Viewer from "../Viewer";

const parse = (data: string) => {
  const lines = data.split("\n");
  const titlePrefix = /^#\s+/;
  const btcAddress = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const emptyLine = /^\s*$/;
  const o = {} as IParsedData;
  let pool = [];

  lines.forEach((line: string) => {
    if (line.match(titlePrefix)) {
      pool = [] as string[];
      o[line.replace(titlePrefix, "")] = pool;
    } else if (line.match(btcAddress)) pool.push(line);
    else if (!line.match(emptyLine)) console.warn(`malformed line: ${line}`);
  });
  return o;
};

const Wallet = ({ params: { slug } }: { params: { slug?: string } }) => {
  const { data, setWallets, setPrice } = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) return;
    const parsedData = parse(data);
    setLoading(true);
    (async () => {
      const walletsData = await actions.wallets.retrieve(parsedData);
      const price = await actions.btcPrice.get();
      setPrice(price);
      setWallets(walletsData);
      setLoading(false);
    })();
  }, [data, slug, setWallets, setPrice]);

  return (
    <div id="Wallet">
      {slug ? <Details slug={slug} /> : <Viewer loading={loading} />}
      <Editor />
    </div>
  );
};

export { Wallet };
