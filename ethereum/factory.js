import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x44C41Ca30cBa959f37350132D672495908d21d69'
);

export default instance;