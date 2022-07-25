import { contracts } from './contract';
import { Notification, MessageType } from '../utils/notification';
import ABI from "../abi/interfaseABI.json";
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f93e1c2c1b904979b8606e3703f1db9c')
const priceFeed = new ethers.Contract(process.env.REACT_APP_PROVIDE_ADDRESS || "", ABI, provider);

export const getUsfPriceForEth = async () => {
    const roundData = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();

    return Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));
};