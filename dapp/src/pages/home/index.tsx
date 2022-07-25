import { useEffect, useMemo, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import ABI from "../../abi/interfaseABI.json";
import SHOP_ABI from "../../abi/Shop.json";
import { contracts } from '../../contract';
import Loader from '../../loading';
import { changeChainId } from '../../changeChain';
import Notification from '../../utils/notification';

import 'react-notifications/lib/notifications.css';
import './Home.css';

const { NotificationContainer } = require('react-notifications');
const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
});

export default function Home() {
    const { activate, active, account, deactivate, library, chainId } = useWeb3React();
    const [balance, setBalance] = useState<number>(0);
    const [usdBalance, setUsdBalance] = useState<number>(0);
    const [usdPrice, setUsdPrice] = useState<number>(0);
    const [allData, setallData] = useState<any>({});
    const [fruits, setFruits] = useState<any>();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const provider = useMemo(() => new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f93e1c2c1b904979b8606e3703f1db9c'), []);
    
    const priceFeed = new ethers.Contract(process.env.REACT_APP_PROVIDE_ADDRESS || "", ABI, provider);
    const contract = new ethers.Contract(process.env.REACT_APP_SHOP_ADDRESS  || "", SHOP_ABI, provider);
    const newProvider = window?.ethereum || (window?.web3 && window.web3.currentProvider);

    useEffect(() => {
        (async () => {
            let roundData = await priceFeed.latestRoundData();
            let decimals = await priceFeed.decimals();
            setUsdPrice(Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2)));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, balance])

    useEffect(() => {
        (async () => {
            try {
                const shopItems = await contract.getShopItems();
                const Arr: any = []
                shopItems.map((e: any) => {
                    return (
                        Arr.push({
                            fruit: e.fruitType,
                            price: Web3.utils.fromWei(`${Number(e.price._hex)}`, 'ether'),
                            qty: Number(e.amount._hex),
                            imagUrl: e.uri,
                            id: e.id._hex
                        })
                    )
                })
                setallData(Object.assign({}, ...Arr.map((x: any) => ({
                    [x.fruit]: {
                        amount: 0,
                        id: '0x0'
                    }
                }))));
                setFruits(Arr);
            } catch (err) {

                Notification('error', err)
                console.log(err);
            }
        })()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    useEffect(() => {
        library?.eth.getBalance(account).then((result: any) => {
            setBalance(result / 1e18)
        })
        setUsdBalance(Number((balance * usdPrice).toFixed(2)));
    }, [active, account, library, usdPrice, balance])

    useEffect(() => {
        let total = 0;
        if (fruits) {
            fruits.forEach((value: any) => {
                total += parseFloat(allData[value.fruit].amount) * parseFloat(value.price)
            })
            setTotalPrice(total);
        }
    }, [fruits, allData])


    const abbreAddress = (d: any) => {
        if (d?.length > 0) {
            let first = d.slice(0, 4);
            let last = d.slice(d.length - 4, d.length);
            return `${first}...${last}`;
        }
        return '';
    }

    const connectWallet = () => {
        activate(injected, (err) => {
            console.log(err);
        })
    }

    const handleChange = async (fruit: any, e: any) => {
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

            for (let i in allData) {
                if (allData[i].amount !== 0) {
                    FruitIds.push(allData[i].id)
                    FruitsAmounts.push(allData[i].amount)
                }
            }
            const web3 = new Web3(newProvider)
            if (FruitIds.length > 1) {
                try {
                    contracts.getContract(web3).methods.buyFruitBunch(FruitIds, FruitsAmounts).send({
                        from: account,
                        value: Web3.utils.toWei(`${totalPrice}`)
                    }).then(() => {
                        Notification('success', 'You bought FRUIT!!!')
                    })
                }
                catch (err) {
                    Notification('error', err)
                    console.log(err);
                }
            }
            else if (FruitIds.length === 1) {
                try {
                    contracts.getContract(web3).methods.buyFruit(FruitIds[0], FruitsAmounts[0]).send({
                        from: account,
                        value: Web3.utils.toWei(`${totalPrice}`)
                    }).then(() => {
                        Notification('success', 'You bought FRUIT!!!')
                    })
                }
                catch (err) {
                    Notification('error', err)
                    console.log(err);
                }
            }
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
                            <tr>
                                <th>NFT</th>
                                <th>Fruit</th>
                                <th>PRICE</th>
                                <th>Amount</th>
                                <th>QTY</th>
                                <th>Total</th>
                            </tr>
                            <tbody>
                                {(fruits && fruits.length > 0) ?
                                    (fruits.map((value: any) => (
                                        <tr key={value.fruit}>
                                            <td><img className='NFT-image' src={value.imagUrl} alt={value.fruit} /></td>
                                            <td>{value.fruit}</td>
                                            <td>{value.price}</td>
                                            <td>{value.qty}</td>
                                            <td>
                                                <span className='input'>
                                                    <input className="input-number" type="number" min={0} max={value.qty} value={allData[value.fruit].amount} onChange={e => handleChange(value, e)} />
                                                </span>
                                            </td>
                                            <td>{parseFloat(allData[value.fruit].amount) * value.price} ETH</td>
                                        </tr>
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
                                        <button className='walletConnect' onClick={() => changeChainId(newProvider, '0x4')}>
                                            Switch to Rinkeby
                                        </button>
                                        :
                                        <>
                                            <button className='walletConnect' onClick={deactivate} title='disconnect'>
                                                {abbreAddress(account)}
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
