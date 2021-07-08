import Web3 from "web3";
import tokenABI from "../../lib/tokenABI";
import { useState } from "react";
import { Button } from "antd";
import { AccountType } from "../../interfaces";
import tokenAddresses from "../../assets/tokenAddresses";

import Account from "../Account";
//import Layout from './Layout'
import TradingData from "../Trading";
import Uniswap from "../Uniswap";

import "./style.less";

const EthLayer = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [web3Enabled, setWeb3Enabled] = useState(false);

  // Empty web3 instance
  let web3: Web3 = new Web3();

  const ethEnabled = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Instance web3 with the provided information from the MetaMask provider information
      web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.enable();

        return true;
      } catch (e) {
        // User denied access
        return false;
      }
    }

    return false;
  };

  const onClickConnect = async () => {
    if (await !ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }

    setWeb3Enabled(true);

    var accs = await web3.eth.getAccounts();

    const newAccounts = await Promise.all(
      accs.map(async (address: string) => {
        const balance = await web3.eth.getBalance(address);

        const tokenBalances = await Promise.all(
          tokenAddresses.map(async (token) => {
            const tokenInst = new web3.eth.Contract(tokenABI, token.address);

            const balance = await tokenInst.methods.balanceOf(address).call();

            return {
              token: token.token,
              balance: web3.utils.fromWei(balance, "ether")
            };
          })
        );

        return {
          address,
          balance: web3.utils.fromWei(balance, "ether"),
          tokens: tokenBalances
        };
      })
    );

    setAccounts(newAccounts);
  };

  return (
    <>
      <div className="actions">
        {!web3Enabled && (
          <Button className="connect-btn" onClick={onClickConnect}>
            Connect
          </Button>
        )}
      </div>

      {accounts && accounts.length > 0 && (
        <>
          <div className="accounts">
            {accounts.map((account) => {
              return (
                <div className="account" key={account.address}>
                  <Account account={account} />
                </div>
              );
            })}
          </div>
          <>
            <TradingData />
          </>
          <>
            <Uniswap web3={web3} accounts={accounts} />
          </>
        </>
      )}
    </>
  );
};

export default EthLayer;
