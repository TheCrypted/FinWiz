import {useNavigate} from "react-router-dom";
import {ShareIndex} from "../../components/tiny/ShareIndex.jsx";
import {ChartFin} from "../../components/ChartFin.jsx";
import {StockMin} from "../../components/tiny/StockMin.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {Collapse} from "@mui/material";
import {AddPopup} from "../../components/tiny/AddPopup.jsx";
import {Footer} from "../../components/Footer.jsx";
import {
    calculateDayDiff,
    calculateDayDiffPerc,
    calculateTotalDiff,
    calculateTotalDiffPerc
} from "../../utils/helpers.js";
import {HOST_AWS, PORT_AWS} from "../../backend.json";


export const Portfolio = () => {
    const navigate = useNavigate();
    const {user, authTokens, logout} = useContext(AuthContext)
    const [userInvestments, setUserInvestments] = useState([])
    const [search, setSearch] = useState(false)
    const searchInputRef = useRef(null);
    const [searchResults, setSearchResults] = useState([])
    const [popup, setPopup] = useState(false)
    const [activeTicker, setActiveTicker] = useState(null)
    const [industryBreak, setIndustryBreak] = useState({})
    const [graphPoints, setGraphPoints] = useState([])
    let color_set = {
        4: "#1e40af",
        3: "#2563eb",
        2: "#60a5fa",
        1: "#bfdbfe"
    }

    // get user's current investment portfolio
    const getInvestments = () => {
        fetch(`https://${HOST_AWS}:${PORT_AWS}/portfolio/investment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authTokens.access}`,
            }
        }).then(res => res.json())
            .then(res => setUserInvestments(res.investments))
            .catch(e => navigate("/signin"))
    }

    //get info on industries of user's investments
    const getIndustryDistribution = () => {
        fetch(`https://${HOST_AWS}:${PORT_AWS}/portfolio/industry-distribution`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authTokens.access}`,
            }
        }).then(res => {
            if(res.status === 403) {
                navigate("/signin");
                return;
            }

            return res.json()
        })
            .then(res => {
                setIndustryBreak(res)
            })
            .catch(err => navigate("/signin"));
    }

    //dynamically graph based on time period selected
    useEffect(() => {
        window.addEventListener("scroll", function (event) {
            setSearch(false)
        })
        if(!authTokens?.access) {
            navigate("/signin")
        }
        fetch(`https://${HOST_AWS}:${PORT_AWS}/portfolio/portfolioHistory?timePeriod=1M`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authTokens.access}`
            }
        }).then(res => {
            if(res.status === 403) {
                navigate("/signin");
                return;
            }
            return res.json()
        })
            .then(res => setGraphPoints(res.data))
            .catch(err => console.error(err));

        getInvestments();
        getIndustryDistribution();
    }, []);

    const addInvestment = (ticker) => {
        setActiveTicker(ticker)
        setPopup(true)
        searchInputRef.current.value = ""; 
        setSearchResults([])
    }

    const onInput = () => {
        if(searchInputRef.current.value) {
            fetch(`https://${HOST_AWS}:${PORT_AWS}/portfolio/equity?prefix=${searchInputRef.current.value}`)
                .then(res => res.json())
                .then(res => setSearchResults(res.equities))
        } else {
            setSearchResults([])
        }
    }

    return (
        <div className="w-full h-full overflow-x-hidden bg-slate-900 overflow-y-auto scrollbar">
            <AddPopup getInvestments={getInvestments} getIndustryDistribution={getIndustryDistribution} ticker={activeTicker} active={popup} setActive={setPopup}/>
            <div
                className="w-full z-20 top-0 h-16 grid grid-cols-[15%_65%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
                <div onClick={() => navigate("/")}
                     className="w-full h-full hover:underline transition-all hover:cursor-pointer flex items-center pl-8">
                    Hi, {user?.username}
                </div>
                <div className="w-full h-full relative">
                    <input onChange={onInput} ref={searchInputRef} onFocus={() => setSearch(true)}
                           onBlur={() => setSearch(false)} placeholder="Search Equities"
                           className="w-full h-full font-mono placeholder:font-serif rounded-b-xl placeholder:text-opacity-20 text-white px-8 hover:cursor-text placeholder:text-white focus:shadow-xl bg-slate-950 bg-opacity-20 focus:bg-opacity-100 transition-all p-4"/>
                    <Collapse in={search} timeout="auto" unmountOnExit className="absolute z-20 top-16 w-full h-full">
                        <div className="w-full h-full backdrop-blur-xl ">
                            {/* search bar results */}
                            {
                                searchResults.map(item => (
                                    <div onClick={() => addInvestment(item.ticker)} key={item.ticker}
                                         className="w-full font-mono hover:underline hover:cursor-pointer justify-between px-4 bg-white bg-opacity-5 py-2 grid grid-cols-[8%_55%_37%]">

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
                <div onClick={() => {
                    if(authTokens?.access) logout();
                    else navigate("/signin")
                }}
                     className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center pr-8">
                    {authTokens?.access ? "Sign out" : "Sign In"}
                </div>
            </div>
            {/* display details on industry & sustainability levels of portfolio  */}
            <div className="h-[85%] w-full pl-12 pr-12 grid grid-cols-[70%_30%]">
                <ChartFin industryBreak={industryBreak}/>
                <div className="cursor-auto w-full h-full pl-2 pr-2 flex items-center justify-center">
                    <div
                        className="w-full px-6 pb-6 h-3/4 border-white border-opacity-10 rounded-xl grid grid-rows-[15%_23%_4%_2%_4%_42%_10%]">
                        <div className="flex items-center text-white text-2xl ">Portfolio Highlights</div>
                        <div className="w-full flex gap-4">
                            <div className="w-full text-green-700 pl-4 h-full bg-green-700 bg-opacity-30 rounded-xl relative">
                                <div
                                    className="h-1/2 text-3xl font-bold flex items-end pb-1">+${calculateDayDiff(graphPoints)}</div>
                                <div
                                    className="h-1/2 text-2xl flex items-start pt-1">↑ {calculateDayDiffPerc(graphPoints)}%
                                </div>
                                <div className="absolute right-0 [writing-mode:vertical-lr] font-bold border-l border-green-700 top-0 flex items-center justify-center font-mono text-xl h-full w-1/6">
                                    MONTH
                                </div>
                            </div>
                            <div className="w-full text-green-700 pl-4 h-full bg-green-700 bg-opacity-30 rounded-xl relative">
                                <div
                                    className="h-1/2 text-3xl font-bold flex items-end pb-1">+${calculateTotalDiff(graphPoints)}</div>
                                <div
                                    className="h-1/2 text-2xl flex items-start pt-1">↑ {calculateTotalDiffPerc(graphPoints)}%
                                </div>
                                <div
                                    className="absolute right-0 [writing-mode:vertical-lr] font-bold border-l border-green-700 top-0 flex items-center justify-center font-mono text-xl h-full w-1/6">
                                    YEAR
                                </div>
                            </div>
                        </div>
                        <div/>
                        <div className="w-full h-full flex rounded-full overflow-hidden  bg-white">
                            {
                                industryBreak?.industryBreakDown &&
                                industryBreak.industryBreakDown.slice(0, 4).map((item, index) => (
                                    <div style={{width: item.percentage, backgroundColor: color_set[4 - index]}}/>
                                ))
                            }
                        </div>
                        <div/>
                        <div className="w-full h-full flex flex-col gap-2">
                            {
                                industryBreak?.industryBreakDown &&
                                industryBreak.industryBreakDown.slice(0, 4).map((item, index) => (
                                    <ShareIndex strength={4 - index} pc={item.percentage}
                                                value={item.monetaryValue.toFixed(1)} text={item.industry}/>
                                ))
                            }
                        </div>
                        <div className="w-full h-full  flex ">
                            <div
                                className="w-full border-r border-opacity-30 border-white grid grid-cols-[20%_80%]  h-full">
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
                <div className="w-full h-28"/>
                
                {/* relevant news on user's stocks */}
                <div className=" w-full h-2/5 pr-8 flex gap-16">
                    <div
                        className="cursor-pointer text-white w-1/5 h-full grid grid-rows-[60%_20%_20%] opacity-60 transition-all hover:underline hover:opacity-100">
                        <div
                            style={{backgroundImage: `url("https://s.yimg.com/uu/api/res/1.2/4UjqlVd5zf0ehZVH2a808Q--~B/Zmk9c3RyaW07aD0yNTI7cT04MDt3PTMzNjthcHBpZD15dGFjaHlvbg--/https://media.zenfs.com/en/thestreet_881/c6c28d56e5dc81af3ae326088256d884.cf.webp")`}}
                            className="bg-cover w-full h-full"/>
                        <a className="text-justify text-white font-serif pt-2 text-2xl">Major Apple chip supplier is
                            expanding into the U.S.
                        </a>
                        <div className="flex text-gray-400 font-mono pt-2">
                            TheStreet
                        </div>
                    </div>
                    <div
                        className="cursor-pointer w-1/5 h-full grid grid-rows-[60%_20%_20%] text-white opacity-60 transition-all hover:underline hover:opacity-100">
                        <div
                            style={{backgroundImage: `url("https://s.yimg.com/uu/api/res/1.2/VtZX_048Jw0kEH9fRAm3yw--~B/Zmk9c3RyaW07aD0yNTI7cT04MDt3PTMzNjthcHBpZD15dGFjaHlvbg--/https://media.zenfs.com/en/benzinga_79/4c61323f3b3f07bb1f62e39ae6d47d6c.cf.webp")`}}
                            className="bg-cover w-full h-full"/>
                        <a className="text-justify text-white font-serif pt-2 text-2xl">Abandoned Train Car Transformed Into Airbnb.
                        </a>
                        <div className="flex text-gray-400 font-mono pt-2">
                            Benzinga
                        </div>
                    </div>
                    <div
                        className="cursor-pointer w-1/5 h-full grid grid-rows-[60%_20%_20%] text-white opacity-60 transition-all hover:underline hover:opacity-100">
                        <div
                            style={{backgroundImage: `url("https://s.yimg.com/uu/api/res/1.2/XUWvgPdPBmeCo6bdpd0i0Q--~B/Zmk9c3RyaW07aD0yNTI7cT04MDt3PTMzNjthcHBpZD15dGFjaHlvbg--/https://media.zenfs.com/en/motleyfool.com/b3e0bf479403f530429503988d860396.cf.webp")`}}
                            className="bg-cover w-full h-full"/>
                        <a className="text-justify text-white font-serif pt-2 text-2xl">Prediction: AMD Stock Will Soar

                        </a>
                        <div className="flex text-gray-400 font-mono pt-2">
                            TheStreet
                        </div>
                    </div>
                    <div
                        className="cursor-pointer w-1/5 h-full grid grid-rows-[60%_20%_20%] text-white opacity-60 transition-all hover:underline hover:opacity-100">
                        <div
                            style={{backgroundImage: `url("https://s.yimg.com/uu/api/res/1.2/7uKc39fov6Oe_84WN9mAwg--~B/Zmk9c3RyaW07aD0yNTI7cT04MDt3PTMzNjthcHBpZD15dGFjaHlvbg--/https://s.yimg.com/os/creatr-uploaded-images/2024-12/e0b4dbb0-b73a-11ef-aabb-dfa9fd85c7ad.cf.webp")`}}
                            className="bg-cover w-full h-full"/>
                        <a className="text-justify text-white font-serif pt-2 text-2xl">Forget the dealership: You can
                            now buy a Hyundai
                        </a>
                        <div className="flex text-gray-400 font-mono pt-2">
                            TheStreet
                        </div>
                    </div>
                </div>


            </div>
            <div className="w-full h-40"/>

            <Footer/>
        </div>
    )
}