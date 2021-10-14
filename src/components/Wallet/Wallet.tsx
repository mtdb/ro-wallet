import { useContext, useEffect, useState } from "react";
import actions, { IParsedData } from "../../actions";
import { Context } from "../../App";
import Details from "../Details";
import Editor from "../Editor";
import Viewer from "../Viewer";

const parse = (data: string) => {
  // remove comments and split by lines
  const lines = data.split(/<!--[^(<!|>)]+-->/mg).join('').split("\n");
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
  const { data, wallets, setWallets, setPrice } = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parsedData = parse(data);
    setLoading(true);
    (async () => {
      const walletsData = await actions.wallets.retrieve(parsedData);
      const price = await actions.btcPrice.get();
      setPrice(price);
      if (JSON.stringify(wallets) !== JSON.stringify(walletsData))
        // preventing re-rendering
        setWallets(walletsData);
      setLoading(false);
    })();
  }, [data, wallets, slug, setWallets, setPrice]);

  return (
    <div id="Wallet">
      {slug ? <Details slug={slug} /> : <Viewer loading={loading} />}
      <Editor loading={loading} />
    </div>
  );
};

export { Wallet };
