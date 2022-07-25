import { Fruit } from "../../types";

interface RowProps {
    item : Fruit,
    handleChange: (fruit: Fruit, e: any) => Promise<void>,
    allData: any
}

export const Row = ({item, handleChange, allData} : RowProps) => {
    return (
        <tr key={item.fruit}>
            <td><img className='NFT-image' src={item.imagUrl} alt={item.fruit} /></td>
            <td>{item.fruit}</td>
            <td>{item.price}</td>
            <td>{item.qty}</td>
            <td>
                <span className='input'>
                    <input className="input-number" type="number" min={0} max={item.qty} value={allData[item.fruit].amount} onChange={e => handleChange(item, e)} />
                </span>
            </td>
            <td>{parseFloat(allData[item.fruit].amount) * parseFloat(item.price)} ETH</td>
        </tr>
    );
}
