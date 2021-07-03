import React, { useState } from "react";

import Web3 from "web3";
import evmChains from "evm-chains";
import Web3Modal from "web3modal";
import { Button } from "antd";

/**
 * Setup the orchestra
 */
function init() {
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log(
    "window.web3 is",
    window.web3,
    "window.ethereum is",
    window.ethereum
  );

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if (location.protocol !== "https:") {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
    return;
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0"
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
}

/**
 * Disconnect wallet button pressed.
 */

const EthLayer = () => {
  const [connected, setConnected] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [selectedAcc, setSelectedAcc] = useState("");

  const providerOptions = {
    /* See Provider Options Section */
  };

  const web3Modal = new Web3Modal({
    network: "kovan", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });

  let provider;
  let web3;
  let selectedAccount; //// Address of the selected account

  const fetchAccountData = async () => {
    web3 = new Web3(provider);
    console.log("Web3 instance is", web3);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    const chainData = evmChains.getChain(chainId);
    setNetworkName(chainData.name);

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    setSelectedAcc(accounts[0]);

    /*
  // Get a handl
  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    // Fill in the templated row and put in the document
    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".balance").textContent = humanFriendlyBalance;
    accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);
  */

    setConnected(true);
  };

  /**
   * Fetch account data for UI for account changes
   */
  async function refreshAccountData() {
    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    setConnected(false);

    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    //document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    await fetchAccountData();
    //document.querySelector("#btn-connect").removeAttribute("disabled")
  }

  const connectWallet = async () => {
    try {
      provider = await web3Modal.connect();
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });

    await refreshAccountData();
  };

  async function onDisconnect() {
    console.log("Killing the wallet connection", provider);

    // TODO: Which providers have close method?
    if (provider.close) {
      await provider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await web3Modal.clearCachedProvider();
      provider = null;
    }

    setSelectedAcc(null);

    // Set the UI back to the initial state
    setConnected(false);
  }

  return (
    <>
      {!connected ? (
        <Button type="primary" onClick={connectWallet}>
          Connect to Wallet
        </Button>
      ) : (
        <>
          <button className="btn btn-primary" id="btn-disconnect">
            Disconnect wallet
          </button>

          <hr />

          <div id="network">
            <p>
              <strong>Connected blockchain:</strong> <span>{networkName}</span>
            </p>

            <p>
              <strong>Selected account:</strong> <span>{selectedAcc}</span>
            </p>
          </div>

          <hr />

          <h3>All account balances</h3>

          <table className="table table-listing">
            <thead>
              <th>Address</th>
              <th>ETH balance</th>
            </thead>

            <tbody id="accounts"></tbody>
          </table>

          <p>
            Please try to switch between different accounts in your wallet if
            your wallet supports this functonality.
          </p>
        </>
      )}
    </>
  );
};

export default EthLayer;
