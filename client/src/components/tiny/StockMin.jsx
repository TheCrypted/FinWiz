import {getColorFromPercentChange, stringToRGB} from "../../utils/helpers.js";

export const StockMin = ({data}) => {

    return (
        <div className="w-full p-2 border-b border-white border-opacity-10 text-white h-auto grid grid-cols-[10%_40%_10%_10%_10%_10%_10%]">
            <div className="flex items-center justify-center px-2 p-1"><div style={{backgroundColor: stringToRGB(data.ticker).cssString}}  className="p-1 flex font-mono text-lg items-center justify-center rounded-xl w-full h-full">{data.ticker}</div></div>
            <div className="w-full h-full flex items-center pl-4 text-opacity-80">{data.full_name}</div>
            <div className="w-full h-full flex items-center justify-end text-opacity-80">${data.current_price}</div>
            <div className="w-full h-full flex items-center justify-end text-opacity-80">{data.quantity}</div>
            <div className="flex items-center justify-center pl-4 px-2 p-1"><div style={{backgroundColor: getColorFromPercentChange(data.day_change).bg}}  className="p-1 flex text-md items-center justify-center rounded-xl w-full h-full">{data.day_change}%</div></div>
            <div className=" w-full h-full flex items-center justify-end text-opacity-80">${Math.round(data.quantity * data.current_price)}</div>
        </div>
    )
}