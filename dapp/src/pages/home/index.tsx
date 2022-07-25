import { useEffect, useMemo, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import ABI from "../../abi/interfaseABI.json";
import { contracts } from '../../blockchain/contract';
import Loader from '../../loading';
import { changeChainId } from '../../changeChain';
import { Notification, MessageType } from '../../utils/notification';
import { abbreAddress, calculateTotalPrice, shopItemsToFruits } from '../../utils/utils';
import { Fruit, AllData, ShopItem } from '../../types';
import { buyItem, getShopItems } from '../../blockchain/shop';
import { getUsfPriceForEth } from '../../blockchain/chainList';
import 'react-notifications/lib/notifications.css';
import './Home.css';
import { Row } from '../../components/row';
import { HeaderRow } from '../../components/headerRow';

const { NotificationContainer } = require('react-notifications');
const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
});



export default function Home() {
    const { activate, active, account, deactivate, library, chainId } = useWeb3React();
    const [balance, setBalance] = useState<number>(0);
    const [usdBalance, setUsdBalance] = useState<number>(0);
    const [usdPrice, setUsdPrice] = useState<number>(0);
    const [allData, setallData] = useState<AllData>({});
    const [fruits, setFruits] = useState<Fruit[]>();
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const provider = window?.ethereum || (window?.web3 && window.web3.currentProvider);

    const web3 = new Web3(provider)
    contracts.setContract(web3);

    useEffect(() => {
        (async () => {
            const price = await getUsfPriceForEth();
            setUsdPrice(price);
        })();
    }, [balance])

    useEffect(() => {
        (async () => {
            try {
                const shopItems: ShopItem[] = await getShopItems();
                const Arr: Fruit[] = shopItemsToFruits(shopItems);
                setallData(Object.assign({}, ...Arr.map((x) => ({
                    [x.fruit]: {
                        amount: 0,
                        id: '0x0'
                    }
                }))));
                setFruits(Arr);
            } catch (err) {

                Notification(MessageType.ERROR, err)
                console.log(err);
            }
        })()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    useEffect(() => {
        library?.eth.getBalance(account).then((result: number) => {
            setBalance(result / 1e18)
        })
        setUsdBalance(Number((balance * usdPrice).toFixed(2)));
    }, [active, account, library, usdPrice, balance])

    useEffect(() => {
            setTotalPrice(calculateTotalPrice(fruits, allData));
    }, [fruits, allData])

    const connectWallet = () => {
        activate(injected, (err) => {
            console.log(err);
        })
    }

    const handleChange = async (fruit: Fruit, e: any) => {
        let value = parseFloat(e.target.value);
        if (value > fruit.qty) { value = fruit.qty; }
        else if (isNaN(value)) {
            value = 0;
        }
        else {
            value = e.target.value;
        }
        setallData({
            ...allData, [fruit.fruit]: {
                amount: value.toString(),
                id: fruit.id,
            }
        });
    }

    const buyFruit = () => {
        if (balance > 0 && totalPrice <= balance) {
            const FruitIds = [];
            const FruitsAmounts = [];

            for (const i in allData) {
                if (parseFloat(allData[i].amount) !== 0) {
                    FruitIds.push(allData[i].id)
                    FruitsAmounts.push(allData[i].amount)
                }
            }
            buyItem({FruitIds, FruitsAmounts, totalPrice, account});
        }
    }

    return (
        <>
            <NotificationContainer />
            <div className='body'>
                <h1>Buy your first FRUIT !!!!!</h1>
                <div className='cart'>
                    <div className='items'>
                        <table className='table'>
                            <HeaderRow/>
                            <tbody>
                                {(fruits && fruits.length > 0) ?
                                    (fruits.map((value: Fruit) => (
                                        <Row item={value} allData={allData} handleChange={handleChange}/>
                                    )
                                    ))
                                    : (
                                        <Loader />
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='checkout'>
                        <div className='line' />
                        <div>
                            <div className='total-amount'>
                                Total price: {totalPrice} ETH ($ {Number((totalPrice * usdPrice).toFixed(2))})
                            </div>

                            <div className='button-container'>
                                {active ?
                                    (chainId !== 4 ?
                                        <button className='walletConnect' onClick={() => changeChainId(provider, '0x4')}>
                                            Switch to Rinkeby
                                        </button>
                                        :
                                        <>
                                            <button className='walletConnect' onClick={deactivate} title='disconnect'>
                                                {abbreAddress(account || "")}
                                            </button>
                                            <button className={`walletConnect ${(balance === 0 || balance < totalPrice || totalPrice === 0) ? 'disabled' : ""}`} onClick={buyFruit} title='disconnect' >
                                                Buy fruit
                                            </button>
                                        </>
                                    )
                                    :
                                    <button className='walletConnect' onClick={connectWallet}>Connect Wallet</button>
                                }
                            </div>
                            {active && chainId === 4 &&
                                <div className='user-balance'>
                                    Your Current balance: {balance} ETH ($ {usdBalance})
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
