import React from 'react';

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { Button } from 'antd';

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: 'kovan', // optional
  cacheProvider: true, // optional
  providerOptions // required
});

let provider;
let web3;

const connectWallet = async () => {
  provider = await web3Modal.connect();
  //web3 = new Web3(provider);
};

const EthLayer = () => {
  return (
    <Button type="primary" onClick={connectWallet}>
      Connect to Wallet
    </Button>
  );
};

export default EthLayer;
