import {useNavigate} from "react-router-dom";
import {ShareIndex} from "../../components/tiny/ShareIndex.jsx";
import {ChartFin} from "../../components/ChartFin.jsx";
import {StockMin} from "../../components/tiny/StockMin.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {Collapse} from "@mui/material";
import {AddPopup} from "../../components/tiny/AddPopup.jsx";


export const Portfolio = () => {
    const navigate = useNavigate();
    const {user, authTokens} = useContext(AuthContext)
    const stocks = [
        {'ticker': 'HON', 'current_price': 228.7, 'quantity': 15, 'purchase_price': 225.0, 'day_change': -0.36, 'full_name': 'Honeywell International Inc.'},
        {'ticker': 'BUD', 'current_price': 56.25, 'quantity': 10, 'purchase_price': 53.0, 'day_change': -0.18, 'full_name': 'Anheuser-Busch Companies, Inc.'},
        {'ticker': 'EMC', 'current_price': 26.4, 'quantity': 30, 'purchase_price': 29.0, 'day_change': -0.64, 'full_name': 'EMC Corporation'},
        {'ticker': 'GE', 'current_price': 176.81, 'quantity': 8, 'purchase_price': 180.0, 'day_change': -0.1, 'full_name': 'General Electric Company'},
        {'ticker': 'XOM', 'current_price': 120.31, 'quantity': 25, 'purchase_price': 115.0, 'day_change': 0.84, 'full_name': 'Exxon Mobil Corporation'},
        {'ticker': 'BAY', 'current_price': 50.2, 'quantity': 12, 'purchase_price': 48.5, 'day_change': 0.5, 'full_name': 'Bayer Aktiengesellschaft'},
        {'ticker': 'UL', 'current_price': 43.8, 'quantity': 20, 'purchase_price': 40.0, 'day_change': 0.6, 'full_name': 'Unilever PLC'},
        {'ticker': 'FDX', 'current_price': 265.1, 'quantity': 5, 'purchase_price': 250.0, 'day_change': -0.4, 'full_name': 'FedEx Corporation'},
        {'ticker': 'BMO', 'current_price': 95.3, 'quantity': 18, 'purchase_price': 92.0, 'day_change': 0.3, 'full_name': 'Bank Of Montreal'},
        {'ticker': 'GDT', 'current_price': 62.7, 'quantity': 7, 'purchase_price': 60.0, 'day_change': -0.2, 'full_name': 'Guidant Corporation'},
        {'ticker': 'BRK/B', 'current_price': 310.9, 'quantity': 3, 'purchase_price': 305.0, 'day_change': -0.15, 'full_name': 'Berkshire Hathaway Inc.'},
        {'ticker': 'GUI', 'current_price': 72.5, 'quantity': 9, 'purchase_price': 70.0, 'day_change': 0.1, 'full_name': 'Gucci Industries'},
        {'ticker': 'CAH', 'current_price': 65.4, 'quantity': 14, 'purchase_price': 63.0, 'day_change': 0.25, 'full_name': 'Cardinal Health, Inc.'},
        {'ticker': 'PCZ', 'current_price': 39.2, 'quantity': 22, 'purchase_price': 38.0, 'day_change': 0.15, 'full_name': 'Petro-Canada'},
        {'ticker': 'SLF', 'current_price': 58.6, 'quantity': 16, 'purchase_price': 57.0, 'day_change': 0.8, 'full_name': 'Sun Life Financial Incorporated'},
        {'ticker': 'PUK', 'current_price': 40.7, 'quantity': 13, 'purchase_price': 39.5, 'day_change': -0.05, 'full_name': 'Prudential Public Limited Company'},
        {'ticker': 'TOD', 'current_price': 80.2, 'quantity': 5, 'purchase_price': 78.0, 'day_change': -0.1, 'full_name': 'Today Corp.'},
        {'ticker': 'SNC', 'current_price': 45.1, 'quantity': 11, 'purchase_price': 43.5, 'day_change': 0.2, 'full_name': 'SN Corporation'},
        {'ticker': 'AUTH', 'current_price': 29.9, 'quantity': 12, 'purchase_price': 30.0, 'day_change': -0.25, 'full_name': 'Authentic Inc.'},
        {'ticker': 'CSCO', 'current_price': 55.6, 'quantity': 25, 'purchase_price': 54.0, 'day_change': 0.5, 'full_name': 'Cisco Systems, Inc.'},
        {'ticker': 'NTDOY', 'current_price': 77.8, 'quantity': 10, 'purchase_price': 75.0, 'day_change': -0.15, 'full_name': 'Nintendo Co., Ltd.'},
        {'ticker': 'LLOY', 'current_price': 2.3, 'quantity': 100, 'purchase_price': 2.5, 'day_change': -0.05, 'full_name': 'Lloyds Banking Group plc'},
        {'ticker': 'UBER', 'current_price': 47.3, 'quantity': 15, 'purchase_price': 46.0, 'day_change': 0.6, 'full_name': 'Uber Technologies, Inc.'},
        {'ticker': 'PYPL', 'current_price': 188.7, 'quantity': 6, 'purchase_price': 190.0, 'day_change': 0.3, 'full_name': 'PayPal Holdings'}]
    const [userInvestments, setUserInvestments] = useState([])
    const [search, setSearch] = useState(false)
    const searchInputRef = useRef(null);
    const [searchResults, setSearchResults] = useState([])
    const [popup, setPopup] = useState(false)
    const [activeTicker, setActiveTicker] = useState(null)

    const getInvestments = () => {
        fetch("http://localhost:3000/portfolio/investment", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authTokens.access}`,
            }
        }).then(res => res.json())
            .then(res => setUserInvestments(res.investments))
            .catch(e => console.log(e))
    }

    useEffect(() => {
        window.addEventListener("scroll", function (event) {
            setSearch(false)
        })
        if(!authTokens?.access) {
            navigate("/signin")
        }
        getInvestments();

    }, []);

    const addInvestment = (ticker) => {
        setActiveTicker(ticker)
        setPopup(true)
        searchInputRef.current.value = ""; 
        setSearchResults([])
    }

    const onInput = () => {
        if(searchInputRef.current.value) {
            fetch(`http://localhost:3000/portfolio/equity?prefix=${searchInputRef.current.value}`)
                .then(res => res.json())
                .then(res => setSearchResults(res.equities))
        } else {
            setSearchResults([])
        }
    }

    return (
        <div className="w-full h-full overflow-x-hidden bg-slate-900 overflow-y-auto scrollbar">
            <AddPopup ticker={activeTicker} active={popup} setActive={setPopup} />
            <div
                className="w-full z-20 top-0 h-16 grid grid-cols-[15%_65%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
                <div onClick={() => navigate("/")}
                    className="w-full h-full hover:underline transition-all hover:cursor-pointer flex items-center pl-8">
                    Hi, {user?.username}
                </div>
                <div className="w-full h-full relative">
                    <input onChange={onInput} ref={searchInputRef} onFocus={() => setSearch(true)} onBlur={() => setSearch(false)} placeholder="Search Equities"
                           className="w-full h-full rounded-b-xl placeholder:text-opacity-20 text-white px-8 hover:cursor-text placeholder:text-white focus:shadow-xl bg-slate-950 bg-opacity-20 focus:bg-opacity-100 transition-all p-4"/>
                    <Collapse in={search} timeout="auto" unmountOnExit className="absolute z-20 top-16 w-full h-full">
                        <div className="w-full h-full backdrop-blur-xl ">
                            {
                                searchResults.map(item => (
                                    <div onClick={() => addInvestment(item.ticker)} key={item.ticker} className="w-full font-mono hover:underline hover:cursor-pointer justify-between px-4 bg-white bg-opacity-5 py-2 grid grid-cols-[8%_55%_37%]">

                                        <div className="flex items-center justify-start text-2xl">{item.ticker}
                                        </div>
                                        <div
                                            className="flex ml-8 items-center justify-start text-2xl">{item.name}
                                        </div>
                                        <div className="flex w-full justify-end font-mono">
                                            <div className="w-3/4 flex justify-end">{item.industry_tag}</div>
                                            <div className="w-1/4 flex justify-end">{item.country_code}</div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </Collapse>
                </div>

                <div onClick={() => navigate("/portfolio")}
                     className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center ">
                    Portfolio
                </div>
                <div onClick={() => navigate("/signin")}
                     className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center pr-8">
                    Sign In
                </div>
            </div>
            <div className="h-[85%] w-full pl-12 pr-12 grid grid-cols-[70%_30%]">
                <ChartFin />
                <div className="cursor-auto w-full h-full pl-2 pr-2 flex items-center justify-center">
                    <div className="w-full px-6 pb-6 h-3/4 border-white border-opacity-10 rounded-xl grid grid-rows-[15%_23%_4%_2%_4%_42%_10%]">
                        <div className="flex items-center text-white text-2xl ">Portfolio Highlights</div>
                        <div className="w-full flex gap-4">
                            <div className="w-full pl-4 h-full bg-red-800 bg-opacity-30 rounded-xl">
                                <div className="text-red-800 h-1/2 text-3xl font-bold flex items-end pb-1">-$22.71</div>
                                <div className="text-red-800 h-1/2 text-2xl flex items-start pt-1">↓ 1.63%</div>
                            </div>
                            <div className="w-full pl-2 h-full bg-green-700 bg-opacity-30 rounded-xl">
                                <div className="text-green-700 h-1/2 text-3xl font-bold flex items-end pb-1">+$42.32</div>
                                <div className="text-green-700 h-1/2 text-2xl flex items-start pt-1">↑ 3.19%</div>
                            </div>
                        </div>
                        <div/>
                        <div className="w-full h-full flex rounded-full  bg-white">
                            <div className="bg-blue-800 w-1/2 rounded-l-full" />
                            <div className="bg-blue-600 border-l-4 border-slate-800 w-1/4"/>
                            <div className="bg-blue-400 border-l-4 border-slate-800 w-1/5"/>
                            <div className="bg-blue-200 border-l-4 border-slate-800 w-1/5 rounded-r-full" />
                        </div>
                        <div />
                        <div className="w-full h-full flex flex-col gap-2">
                            <ShareIndex strength={4} pc={44.5} value={1200.20} text={"Technology"}/>
                            <ShareIndex strength={3} pc={30.0} value={800.00} text={"Healthcare"}/>
                            <ShareIndex strength={2} pc={21.2} value={353.04} text={"Finance"}/>
                            <ShareIndex strength={1} pc={8.2} value={103.04} text={"Other"}/>
                        </div>
                        <div className="w-full h-full  flex ">
                            <div className="w-full border-r border-opacity-30 border-white grid grid-cols-[20%_80%]  h-full">
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green"
                                         className="size-6">
                                        <path
                                            d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"/>
                                        <path fillRule="evenodd"
                                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="w-full h-full flex items-center justify-start text-white text-lg">
                                    53% Sustainable
                                </div>
                            </div>
                            <div className="w-full h-full grid grid-cols-[20%_80%] ">
                                <div className="w-full h-full flex items-center justify-end">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold"
                                         className="size-6">
                                        <path
                                            d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z"/>
                                        <path fillRule="evenodd"
                                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="w-full h-full flex items-center justify-end text-white text-lg">
                                    53% High-Dividend
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pl-20 w-full h-full">
                <div className="w-full h-20"/>
                <div className="grid grid-cols-[67%_33%]">
                    <div>
                        <div
                            className="w-full p-2 border-b border-white font-mono border-opacity-10 text-white h-auto grid grid-cols-[10%_40%_10%_10%_10%_10%_10%]">
                            <div className="flex items-center justify-center opacity-50">SYMBOL</div>
                            <div className="flex items-center pl-4 opacity-50">NAME</div>
                            <div className="flex items-center justify-end  opacity-50">PURCHASE</div>
                            <div className="flex items-center justify-end  opacity-50">QUANTITY</div>
                            <div className="flex items-center justify-end  opacity-50">GAIN</div>
                            <div className="flex items-center justify-end opacity-50">PRICE</div>
                            <div className="flex items-center justify-end  opacity-50">P/L</div>
                        </div>
                        {
                            userInvestments?.map((item) => <StockMin data={item}/>)
                        }
                    </div>
                </div>
                <div className="w-full h-20"/>


            </div>

        </div>
    )
}