import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
 
let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
  // We are in the browser and metamask is running
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum); 
} else {
  // We are on the server *OR* Metmask is not installed
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/880dd70ac5674bec97bd98af689fa47a'
  );
  web3 = new Web3(provider);
}

export default web3;