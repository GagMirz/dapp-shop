import Web3 from 'web3';
const SHOP_ABI = require('./abi/Shop.json');

export class contracts {
    static getContract(web3: Web3) {
        const fruitDress = process.env.REACT_APP_SHOP_ADDRESS;
        return new web3.eth.Contract(SHOP_ABI, fruitDress);
    }
}