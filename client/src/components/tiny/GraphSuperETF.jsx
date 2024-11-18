
export const GraphSuperETF = ({data}) => {

    return (
        <div className="w-1/6 relative hover:bg-opacity-10 transition-all hover:cursor-pointer bg-white bg-opacity-0  mr-4 h-full border border-white rounded-xl border-opacity-20">
            <div className="w-1/2 absolute h-full flex items-center justify-center text-white text-lg font-semibold text-opacity-70 overflow-hidden">{data.symbol}</div>
            <div style={{color: data.dailyChange < 0 ? "rgba(200, 0, 0, 0.5)" : "rgba(0, 200, 0, 0.5)"}} className="w-1/2 right-0 absolute h-full flex items-center justify-center text-white text-xl font-bold transition-all overflow-hidden">{data.dailyChange}%</div>
        </div>
    )
}