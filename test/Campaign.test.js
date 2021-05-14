const assert = require('assert');
const ganache =  require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '2000000'});

    await factory.methods.createCampaign('test', 'desc', '100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory & a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });

    it('accepts contributions and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]   
        });

        const approverExists = await campaign.methods.approvers(accounts[1]).call();
        assert(approverExists);
    });

    it('requires a minimum contribution', async () => {
        try{
            campaign.methods.contribute().send({
                value: '5',
                from: accounts[2]
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('allows manager to make a payment request', async () => {
        await campaign.methods.createRequest(
            'Buy batteries', '100', accounts[2]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual(request.description, 'Buy batteries');
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0], 
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
        .createRequest('Buy something', web3.utils.toWei('5','ether'), accounts[3])
        .send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0], 
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[3]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 104);

    });
});
