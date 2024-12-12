import {getColorFromPercentChange, stringToRGB, toTitleCase} from "../../utils/helpers.js";

export const StockMin = ({data}) => {
    let last_price = parseFloat(data.last_price), purchase_price = parseFloat(data.purchase_price);
    let percentage_change = 100 * ((last_price - purchase_price)/purchase_price).toFixed(4);
    let b_color = getColorFromPercentChange(percentage_change.toFixed(1))

    return (
        <div className="w-full p-2 border-b border-white border-opacity-10 text-white h-auto grid grid-cols-[10%_40%_10%_10%_10%_10%_10%]">
            <div className="flex items-center justify-center px-2 p-1"><div style={{backgroundColor: stringToRGB(data.ticker).cssString}}  className="p-1 flex font-mono text-lg items-center justify-center rounded-xl w-full h-full">{data.ticker}</div></div>
            <div className="w-full h-full flex items-center pl-4 text-opacity-80">{toTitleCase(data.equity_name)}</div>
            <div className="w-full h-full flex items-center justify-end text-opacity-80">${purchase_price.toFixed(2)}</div>
            <div className="w-full h-full flex items-center justify-end text-opacity-80">{data.amount}</div>
            <div className="flex items-center justify-end  pl-4 py-1"><div style={{backgroundColor: b_color.bg}}  className="p-1 flex text-md items-center justify-center rounded-xl w-full h-full">{percentage_change.toFixed(1)}%</div></div>
            <div className=" w-full h-full flex items-center justify-end text-opacity-80">${(last_price)}</div>
            <div style={{color:b_color.text}} className=" w-full h-full flex items-center justify-end text-opacity-80">${((last_price - purchase_price) * data.amount).toFixed(2)}</div>
        </div>
    )
}