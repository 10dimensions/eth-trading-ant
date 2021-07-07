import React, { useState, useEffect } from "react";
import tokenAddresses from "../../assets/tokenAddresses";
import uniRouterAbi from "./uniRouterAbi";
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

const net = ChainId.RINKEBY;

const Uniswap = async (props) => {
  const web3 = props.web3;
  const accounts = props.accounts;

  const dai = await Fetcher.fetchTokenData(net, tokenAddresses[0]["address"]);
  const weth = WETH[net];
  const pair = await Fetcher.fetchPairData(dai, weth);
  const route = new Route([pair], weth);
  console.log(route.midPrice.toSignificant(6));
  console.log(route.midPrice.invert().toSignificant(6));

  const trade = new Trade(
    route,
    new TokenAmount(weth, "1000000000000000000"),
    TradeType.EXACT_INPUT
  );
  console.log(trade.executionPrice.toSignificant(6));
  console.log(trade.nextMidPrice.toSignificant(6));

  const slippageTollerance = new Percent("10", "10000");
  const amountOutMin = trade.minimumAmountOut(slippageTollerance);
  // const amountOutMin = web3.current.utils.toBN(amountOutMinRaw)
  const path = [weth.address, dai.address];

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const amountIn = trade.inputAmount.raw;
  const to = "";

  const uniSwapRouter = new web3.current.eth.Contract(
    uniRouterAbi,
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  );
  const tx = await uniSwapRouter.current.methods
    .swapExactETHForTokens(
      // amountIn,
      1,
      to,
      path,
      deadline
    )
    .send({
      from: accounts[0],
      gasLimit: 8000000,
      gasPrice: web3.current.utils.toWei("100", "Gwei"),
      value: web3.current.utils.toWei("1", "Ether")
    });
  console.log(tx.hash);
};

export default Uniswap;
