import { BigNumber } from "ethers"

export interface Fruit {
    fruit: string,
    imagUrl: string,
    price: string,
    qty: number,
    id: string
}

export interface ShopItem {
    fruitType: string,
    uri: string,
    price: BigNumber,
    amount: BigNumber,
    id: BigNumber
}

export interface Data {
    amount: string, 
    id: string
}

export interface AllData {
    [key: string]: Data
}