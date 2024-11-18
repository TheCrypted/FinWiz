import {Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {GraphSuperETF} from "./tiny/GraphSuperETF.jsx";

export const ChartFin = () => {
    const data = [
        { month: 'Jan', Portfolio: 400, SP500: 240 },
        { month: 'Feb', Portfolio: 300, SP500: 139 },
        { month: 'Mar', Portfolio: 200, SP500: 980 },
        { month: 'Apr', Portfolio: 278, SP500: 390 },
        { month: 'May', Portfolio: 189, SP500: 480 },
        { month: 'Jun', Portfolio: 239, SP500: 380 },
        { month: 'Jul', Portfolio: 349, SP500: 430 }
    ];
    const marketData = [
        {
            symbol: "SPY",
            dailyChange: -0.42
        },
        {
            symbol: "QQQ",
            dailyChange: 0.87
        },
        {
            symbol: "VTI",
            dailyChange: -0.31
        },
        {
            symbol: "IWM",
            dailyChange: -1.24
        },
        {
            symbol: "EFA",
            dailyChange: 0.56
        },
        {
            symbol: "VGT",
            dailyChange: 1.12
        },
        {
            symbol: "XLF",
            dailyChange: -0.78
        },
        {
            symbol: "VOO",
            dailyChange: -0.45
        },
        {
            symbol: "ARKK",
            dailyChange: 2.31
        },
        {
            symbol: "DIA",
            dailyChange: -0.15
        }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        return (
            <div className="backdrop-blur-sm" style={{
                backgroundColor: "rgba(100, 100, 100, 0.2)",
                padding: '10px',
                // border: '1px solid #ccc',
                borderRadius: '5px'
            }}>
                <p className="text-white">{label}</p>
                {payload.map((item, index) => (
                    <p key={index} style={{ color: item.color }}>
                        {`${item.name}: ${item.value}`}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className=" w-full h-full pr-8 grid grid-rows-[25%_65%_10%]">
            <div className="grid grid-rows-2 pb-12">
                <div />
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="w-20 h-full" />

                        <div className="flex items-end w-auto pr-4 h-full text-white font-serif_light text-7xl">$2,380.06</div>
                        <div className="w-auto h-full font-bold text-green-700 text-4xl flex items-center">↑1.2%</div>
                    </div>
                    <div className="flex gap-2 w-1/4 place-items-end ">
                        <div className="w-full h-1/2 flex hover:cursor-pointer hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-800">1D</div>
                        <div className="w-full h-1/2 flex hover:cursor-pointer hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-600">1M</div>
                        <div className="w-full h-1/2 flex hover:cursor-pointer hover:bg-opacity-20 bg-white bg-opacity-20 items-center justify-center text-white border-b-2 border-blue-400">1Y</div>
                        <div className="w-full h-1/2 flex hover:cursor-pointer hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-200">5Y</div>
                    </div>
                </div>

            </div>
            <div>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        {/*<CartesianGrid strokeDasharray="3 3" />*/}
                        <XAxis dataKey="month" axisLine={{stroke: '#EAF0F4'}} tick={{fill: '#EAF0F4'}}
                        />
                        <YAxis axisLine={{stroke: 'rgba("0,0,0,0")'}} tick={{fill: '#EAF0F4'}}
                        />
                        <Tooltip content={<CustomTooltip/>}/>
                        <Legend/>
                        <Line
                            type="monotone"
                            dataKey="Portfolio"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            activeDot={{r: 8}}
                        />
                        <Line
                            type="monotone"
                            dataKey="SP500"
                            stroke="#4338ca"
                            strokeWidth={2}
                            activeDot={{r: 8}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex pl-8 pt-4 flex-wrap flex-col overflow-x-auto hide-scrollbar">
                {
                    marketData?.map(item => (
                        <GraphSuperETF data={item}/>
                    ))
                }
            </div>
        </div>
    )

}