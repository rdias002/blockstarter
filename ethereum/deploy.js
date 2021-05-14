const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'inspire maid deputy stand scatter hurt wish post adapt rent claim alter',
  'https://rinkeby.infura.io/v3/880dd70ac5674bec97bd98af689fa47a'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from ac ', accounts[0]);

  const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    ).deploy({ data: compiledFactory.bytecode})
    .send({gas: '2000000', from: accounts[0]});

  console.log('Contract deployed to ', result.options.address);
};
deploy();