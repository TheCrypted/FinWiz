import {Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {GraphSuperETF} from "./tiny/GraphSuperETF.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import { format } from 'date-fns';
import {calculateDayDiffPerc} from "../utils/helpers.js";
import {HOST_AWS, PORT_AWS} from "../backend.json";

export const ChartFin = ({industryBreak}) => {
    const {user, authTokens} = useContext(AuthContext);
    const [graphPoints, setGraphPoints] = useState([])
    const timeRef = useRef("1W");
    const [time, setTime] = useState("1W")

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

    const updateGraphData = (time) => {
        fetch(`http://${HOST_AWS}:${PORT_AWS}/portfolio/portfolioHistory?timePeriod=${time}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authTokens.access}`
            }
        }).then(res => res.json())
            .then(res => setGraphPoints(res.data))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        updateGraphData("1W")

    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }
        return (
            <div className="backdrop-blur-sm" style={{
                backgroundColor: "rgba(100, 100, 100, 0.2)",
                padding: '10px',
                borderRadius: '5px'
            }}>
                <p className="text-white">{`Date: ${format(new Date(payload[0].payload.date), 'dd MMM yy')}`}</p>
                {payload.map((item, index) => {
                    return (
                        <p key={index} style={{color: item.color}}>
                            Portfolio Value: ${payload[0].payload.portfolioValue.toFixed(1)}
                        </p>
                    )
                })}
            </div>
        );
    };

    const updateTimeStep = (e) => {
        updateGraphData(e.target.innerHTML);
        setTime(e.target.innerHTML)
    }

    return (
        <div className=" w-full h-full pr-8 grid grid-rows-[25%_65%_10%]">
            <div className="grid grid-rows-2 pb-12">
                <div />
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="w-20 h-full" />

                        <div className="flex items-end w-auto pr-4 h-full text-white font-mono text-6xl">{industryBreak?.total?.toFixed(2)}</div>
                        <div className="w-auto h-full font-bold text-green-700 text-3xl flex items-center">↑{calculateDayDiffPerc(graphPoints)}%</div>
                    </div>
                    <div className="flex gap-2 w-1/4 place-items-end ">
                        <div style={{backgroundColor: `rgba(255, 255, 255, ${time === "1D" ? 0.2 : 0})`}} onClick={updateTimeStep} className="w-full h-1/2 flex hover:cursor-pointer !hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-900">1D</div>
                        <div style={{backgroundColor: `rgba(255, 255, 255, ${time === "1W" ? 0.2 : 0})`}} onClick={updateTimeStep} className="w-full h-1/2 flex hover:cursor-pointer !hover:bg-opacity-20 bg-white bg-opacity-20 items-center justify-center text-white border-b-2 border-blue-800">1W</div>
                        <div style={{backgroundColor: `rgba(255, 255, 255, ${time === "1M" ? 0.2 : 0})`}} onClick={updateTimeStep} className="w-full h-1/2 flex hover:cursor-pointer !hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-600">1M</div>
                        <div style={{backgroundColor: `rgba(255, 255, 255, ${time === "1Y" ? 0.2 : 0})`}} onClick={updateTimeStep} className="w-full h-1/2 flex hover:cursor-pointer !hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-400">1Y</div>
                        <div style={{backgroundColor: `rgba(255, 255, 255, ${time === "5Y" ? 0.2 : 0})`}} onClick={updateTimeStep} className="w-full h-1/2 flex hover:cursor-pointer !hover:bg-opacity-20 bg-white bg-opacity-0 items-center justify-center text-white border-b-2 border-blue-200">5Y</div>
                    </div>
                </div>

            </div>
            <div className="-z-0">
                <ResponsiveContainer>
                    <LineChart
                        data={graphPoints}
                        margin={{top: 20, right: 30, left: 20, bottom: 5}}
                    >
                        {/*<CartesianGrid strokeDasharray="3 3" />*/}
                        <XAxis tickFormatter={item => format(new Date(item), 'dd MMM yy')} dataKey="date" axisLine={{stroke: '#EAF0F4'}} tick={{fill: '#EAF0F4'}}
                        />
                        <YAxis axisLine={{stroke: 'rgba("0,0,0,0")'}} tick={{fill: '#EAF0F4'}}
                        />
                        <Tooltip content={<CustomTooltip/>}/>
                        <Legend/>
                        <Line
                            type="monotone"
                            dataKey="portfolioValue"
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