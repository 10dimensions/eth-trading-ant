import Web3 from "web3";
import Web3Modal from "web3modal";

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

let provider;
let web3;

const connectWallet = () => {
  provider = await web3Modal.connect();
  web3 = new Web3(provider);
}

const EthLayer = () => {
  return(
    
  )
}

export default EthLayer;