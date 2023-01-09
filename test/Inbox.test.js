const assert = require('assert');
const ganache = require('ganache-cli'); // instantly helps us to connect with the local test network and unlocks accounts without need of mneumonics or keys for testing
const { beforeEach } = require('mocha');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {abi, evm} = require("../compile");

let accounts, inbox;

beforeEach(async ()=>{
    //Get list of all accounts created by the Ganache provider on its local network (When using ganache provider for local, would change for testnet and mainnet)
    accounts = await web3.eth.getAccounts();

    //deploy the contract using one of the accounts
    //inbox variable would be an instance of a successfully created contract, used later to access its properties
    inbox = await new web3.eth.Contract(abi) // Teaches web3 about what methods does the contract contains via the abi created
            .deploy({data:evm.bytecode.object, arguments:['Hi There!']}) // Creates an javascript object - tells web3 that we want to deploy a new copy of the contact defined ny the interface
            .send({from:accounts[0], gas:'1000000'}) // instructs web3 to send out a transaction that creates this contract
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address); // test if an address has been assigned. ails In case of null or undefined value.
        console.log("created address", inbox.options.address)
    })

    it('Has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi There!');
    })

    it('Updates message', async () => {
        await inbox.methods.setMessage('Bye!').send({from:accounts[0]})
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye!');
    })
})