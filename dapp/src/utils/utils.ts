import { AllData, Fruit, ShopItem } from "../types";
import Web3 from 'web3';
import { arrayBuffer } from "stream/consumers";

export const abbreAddress = (d: string) => {
    if (d?.length > 0) {
        let first = d.slice(0, 4);
        let last = d.slice(d.length - 4, d.length);
        return `${first}...${last}`;
    }
    return '';
}

export const calculateTotalPrice = (fruits: Fruit[] | undefined, allData: AllData) => {
    let total = 0;
    if (fruits) {
        fruits.forEach((value: Fruit) => {
            total += parseFloat(allData[value.fruit].amount) * parseFloat(value.price)
        })
    }
    return total;
}

export const shopItemsToFruits = (shopItems: ShopItem[]) => {
    const fruits: Fruit[] = shopItems.map((e: ShopItem) => {
        return (
            {
                fruit: e.fruitType,
                price: Web3.utils.fromWei(`${Number(e.price._hex)}`, 'ether'),
                qty: Number(e.amount._hex),
                imagUrl: e.uri,
                id: e.id._hex
            }
        )
    })
    return fruits;
}
