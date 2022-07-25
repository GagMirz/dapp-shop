import { contracts } from './contract';
import { Notification, MessageType } from '../utils/notification';
import SHOP_ABI from "../abi/Shop.json";
import { ethers } from 'ethers';
import Web3 from 'web3';

const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f93e1c2c1b904979b8606e3703f1db9c')
const shopReadContract = new ethers.Contract(process.env.REACT_APP_SHOP_ADDRESS || "", SHOP_ABI, provider);

export type BuyItemType = {
    FruitIds: string[],
    FruitsAmounts: string[],
    totalPrice: number,
    account: string | undefined | null
};

export const getShopItems = async () => {
    return shopReadContract.getShopItems();
}

export const buyItem = ({ FruitIds, FruitsAmounts, totalPrice, account }: BuyItemType) => {
    try {
        if (FruitIds.length > 1) {
            contracts.getContract().methods.buyFruitBunch(FruitIds, FruitsAmounts).send({
                from: account,
                value: Web3.utils.toWei(`${totalPrice}`)
            }).then(() => {
                Notification(MessageType.SUCCESS, 'You have bought FRUITS!!!');
            })
        }
        else if (FruitIds.length === 1) {
            contracts.getContract().methods.buyFruit(FruitIds[0], FruitsAmounts[0]).send({
                from: account,
                value: Web3.utils.toWei(`${totalPrice}`)
            }).then(() => {
                Notification(MessageType.SUCCESS, 'You have bought FRUIT!!!');
            })
        }
        else {
            throw new Error("Wrong buy action");
        }
    } catch (err) {
        Notification(MessageType.ERROR, err);
        console.log(err);
    }
}
