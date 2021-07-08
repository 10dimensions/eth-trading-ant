import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";

import tokenAddresses from "../../assets/tokenAddresses";
import uniRouterAbi from "./uniRouterABI";
import {
  ChainId,
  Token,
  Fetcher,
  WETH,
  TokenAmount,
  Pair,
  TradeType,
  Route,
  Trade,
  Percent
} from "@uniswap/sdk";
import "./style.less";

const Uniswap = (props) => {
  const web3 = props.web3;
  const accounts = props.accounts;
  const net = ChainId.RINKEBY;

  const uniSwapRouter = new web3.eth.Contract(
    uniRouterAbi,
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  );

  let trade;
  let slippageTolerance;
  let amountOutMin;
  let tx;
  const to = "";

  const [dai, setDai] = useState(null);
  const [weth, setWeth] = useState(null);

  const [pair, setPair] = useState(null);
  const [route, setRoute] = useState(null);
  const [path, setPath] = useState(null);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  const [tradeAmount, setTradeAmout] = useState("0.0001");

  const [midPrice, setMidPrice] = useState("");
  const [midPriceInv, setMidPriceInv] = useState("");

  const [executionPrice, setExecutionPrice] = useState(0);
  const [nextMidPrice, setNextMidPrice] = useState(0);
  const [amountIn, setAmountIn] = useState(0);

  const initTrade = (_route, _weth) => {
    
    var _amt = web3.utils.toWei(tradeAmount, "ether");
    trade = new Trade(
      _route,
      new TokenAmount(_weth, _amt), //"1000000000000000000"),
      TradeType.EXACT_INPUT
    );

    setExecutionPrice(trade.executionPrice.toSignificant(6));
    setNextMidPrice(trade.nextMidPrice.toSignificant(6));

    console.log(trade.executionPrice.toSignificant(6));
    console.log(trade.nextMidPrice.toSignificant(6));

    slippageTolerance = new Percent("50", "10000");
    amountOutMin = trade.minimumAmountOut(slippageTolerance);
    // const amountOutMin = web3.current.utils.toBN(amountOutMinRaw)

    setAmountIn(trade.inputAmount.raw);
  };

  useEffect(() => {
    (async () => {
      var _dai = await Fetcher.fetchTokenData(
        net,
        tokenAddresses[0]["address"]
      );
      setDai(_dai);
      var _weth = WETH[net];
      setWeth(_weth);

      var _pair = await Fetcher.fetchPairData(_dai, _weth);
      setPair(_pair);

      var _route = new Route([_pair], _weth);
      setRoute(_route);

      setPath([_weth.address, _dai.address]);

      var _midPrice = _route.midPrice.toSignificant(6);
      var _midPriceInv = _route.midPrice.invert().toSignificant(6);

      setMidPrice(_midPrice);
      setMidPriceInv(_midPriceInv);

      initTrade(_route, _weth);
    })();
  }, []);

  const makeTransaction = async () => {
    //debugger;
    return;
    tx = await uniSwapRouter.current.methods
      .swapExactETHForTokens(
        amountIn,
        //1,
        to,
        path,
        deadline
      )
      .send({
        from: accounts[0],
        gasLimit: 8000000,
        gasPrice: web3.current.utils.toWei("100", "Gwei")
        //value: web3.current.utils.toWei("1", "Ether")
      });

    console.log(tx.hash);
  };

  return (
    <div className="swap-pane">
      <Input
        placeholder={tradeAmount + " ETH"}
        onChange={(e) => setTradeAmout(e.target.value)}
      />
      <br />
      <Button className="swap-btn" onClick={() => {makeTransaction()}}>
        Swap to DAI
      </Button>
      <br />
      <ul>
        <li>{"MidPrice . " + midPrice}</li>
        <li>{"Inverted MidPrice . " + midPriceInv}</li>
        <br />
        <br />
        <li>{"Execution Price . " + executionPrice}</li>
        <li>{"Next MidPrice . " + nextMidPrice}</li>
        <br />
        <br />
        <span>{"Note: Slippage @0.5%, Gas @100Gwei"}</span>
      </ul>
    </div>
  );
};

export default Uniswap;
