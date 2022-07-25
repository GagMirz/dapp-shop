import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
const SHOP_ABI = require('../abi/Shop.json');

export class contracts {
    static shop: Contract;
    static getContract() {
        if(this.shop == null) {
            throw (new Error("Contract was not initiated"));
        }
        return contracts.shop;
    }

    static setContract(web3: Web3) {
        contracts.shop = new web3.eth.Contract(SHOP_ABI, process.env.REACT_APP_SHOP_ADDRESS);
    }
}
