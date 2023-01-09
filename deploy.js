const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const {abi, evm} = require('./compile');

const provider = new HDWalletProvider(
    'crane insect roast crucial surge refuse job pipe kid angry beef pyramid',
    'https://goerli.infura.io/v3/2422d29a99864e4fa2383df16804414a'
);

const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Trying to deploy from account -- ", accounts[0])
        const result = await new web3.eth.Contract(abi) // Teaches web3 about what methods does the contract contains via the abi created
                .deploy({data: evm.bytecode.object, arguments:['Hi There!']}) // Creates an javascript object - tells web3 that we want to deploy a new copy of the contact defined ny the interface
                .send({from:accounts[0], gas:'1000000'}) // instructs web3 to send out a transaction that creates this contract
        console.log("Contract deployed to --", result.options.address);
        provider.engine.stop(); //to prevent a hanging deployment
    } catch (error) {
        console.log("error deploying", error)
    }
}
deploy();