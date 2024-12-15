import {useContext, useEffect, useRef, useState} from 'react';
import {
    Button,
    TextField,
    Container,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse
} from '@mui/material';
import {AuthContext} from "../../context/AuthContext.jsx";
import ReactTextTransition from "react-text-transition";
import {useNavigate} from "react-router-dom";
import {NewsArticle} from "../../components/tiny/NewsArticle.jsx";
import {Footer} from "../../components/Footer.jsx";
import {HOST_AWS, PORT_AWS} from "../../backend.json"

export const CountryRanking = () => {
    //ranking table for top countries for a given education indicator code
    const indicatorEduCode = 'UIS.FEP.3'; // Replace with user search function result
    const [topCountriesEduData, setTopCountriesEduData] = useState([]); // Initialize as an empty array
    const [countryWindow, setCountryWindow] = useState({});
    const navigate = useNavigate();
    //ranking table for top countries for a given imf indicator code 
    const [topCountriesIMFData, setTopCountriesIMFData] = useState([]);
    const [bottomCountriesIMFData, setBottomCountriesIMFData] = useState([]);
    const {user, authTokens} = useContext(AuthContext);
    const [indicators, setIndicators] = useState(["Whatever"])
    const [search, setSearch] = useState(false)
    const searchInputRef = useRef(null);
    const indicatorRef = useRef([]);
    const [newsArticles, setNewsArticles] = useState(
        [{"imageUrl":"https://ichef.bbci.co.uk/news/1024/cpsprodpb/e89a/live/5040abd0-ba6a-11ef-aff0-072ce821b6ab.jpg.webp","thumbnailTitle":"Trump gets $15m in ABC News defamation case","description":"The network will also publish a statement expressing \"regret\" for statements by George Stephanopoulos.","url":"https://www.bbc.com/news/articles/cgrw57q4y9do"},{"imageUrl":"https://www.politico.eu/cdn-cgi/image/width=1200,height=675,fit=crop,quality=80,onerror=redirect,format=auto/wp-content/uploads/2020/11/23/GettyImages-541872954.jpg","thumbnailTitle":"US officials in 'direct contact' with victorious Syria rebels","description":"Secretary of State Antony Blinken confirms contact with the HTS group, despite it still being on the US terrorism list.","url":"https://www.bbc.com/news/articles/c5y46713z21o"},{"imageUrl":"https://ichef.bbci.co.uk/news/800/cpsprodpb/56bb/live/0bebe950-ba1e-11ef-8f2f-e59e2ffa2d0d.jpg.webp","thumbnailTitle":"Fears of heavy death toll after cyclone hits island Mayotte","description":"There are reports of severe damage on the French Indian Ocean territory after it was struck by Cyclone Chido.","url":"https://www.bbc.com/news/articles/c2ldkg59j15o"}]    )
    //ranking table for combined education & imf performance
    //no search function needed
    const [topCountriesData, setTopCountriesData] = useState([]);

    const [topStocksData, setTopStocksData] = useState([]);

    const getCountryWindow = (country) => {
        console.log(country)
        fetch(`https://${HOST_AWS}:${PORT_AWS}/getCountryWindow?country=${country}`, {
            method: 'GET',
        }).then(res => res.json())
            .then(res => setCountryWindow(res.window_info[0]))
            .catch(err => console.error(err));
    }

    const onInput = () => {
        if(searchInputRef.current.value) {
            setIndicators(indicatorRef.current.filter(item => item.indicator_name.includes(searchInputRef.current.value)))

        } else {
            setSearchResults([])
        }
    }

    const onSubmitCode = (newCode) => {
        updateIMFData(newCode)
    }

    const updateIMFData = (newCode, name) => {
        fetch(`https://${HOST_AWS}:${PORT_AWS}/getTopCountriesIMF/${newCode}`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesIMFData(resJson.imf_info));
        fetch(`https://${HOST_AWS}:${PORT_AWS}/getTopCountriesIMF/${newCode}?order=bottom`)
            .then((res) => res.json())
            .then((resJson) => setBottomCountriesIMFData(resJson.imf_info));
        if(name) searchInputRef.current.value = name;
    }

    useEffect(() => {
        fetch(`https://${HOST_AWS}:${PORT_AWS}/getCountryWindow?country=Germany`, {
            method: 'GET',
        }).then(res => res.json())
            .then(res => setCountryWindow(res.window_info[0]))
            .catch(err => console.error(err));

        fetch(`https://${HOST_AWS}:${PORT_AWS}/indicators`, {
            method: 'GET',
        }).then(res => res.json())
            .then(res => {
                indicatorRef.current = res;
                setIndicators(res)
            })
            .catch(err => console.error(err));

        fetch("https://${HOST_AWS}:${PORT_AWS}/bbc-news", {
            method: "GET"
        }).then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch(`https://${HOST_AWS}:${PORT_AWS}/getTopCountriesEducation/${indicatorEduCode}`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesEduData(resJson.education_info));

        updateIMFData('PPPGDP');

        fetch(`https://${HOST_AWS}:${PORT_AWS}/getTopCountriesCombined`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesData(resJson.rank_info));

        fetch(`https://${HOST_AWS}:${PORT_AWS}/getTopStocksPerCountry`)
            .then((res) => res.json())
            .then((resJson) => setTopStocksData(resJson.rank_stock_info));

    }, [indicatorEduCode]);

    return (

        <div className="w-full h-full bg-slate-900">
            <div className="w-full h-full relative">
                <div className="w-full pointer-events-none h-full absolute flex justify-end z-20">
                    <div className="flex items-center justify-center w-1/2 pointer-events-auto">
                        <div className="rounded-xl w-2/4 h-2/5 grid pl-4 text-gray-200 text-xl  font-mono grid-rows-2 bg-opacity-10  ">
                            <div className="flex items-center">Education score: {countryWindow?.avg_education_value?.toFixed(0)}</div>
                            <div className="flex items-end ">International Monetary score: {countryWindow?.avg_imf_value?.toFixed(0)}</div>
                        </div>
                    </div>
                </div>
                <div
                    className="w-full z-20 top-0 h-16 grid grid-cols-[15%_65%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
                    <div onClick={() => navigate("/")}
                         className="w-full h-full hover:underline transition-all hover:cursor-pointer flex items-center pl-8">
                        Hi, {user?.username}
                    </div>
                    <div className="w-full flex items-center justify-center h-full relative">
                        Global Overview
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
                <div
                    className="pl-8 w-full h-[92%] text-gray-400 text-8xl gap-8 font-serif_light flex flex-col justify-center">
                    <div onClick={() => getCountryWindow(countryWindow.country_2_above)} className="hover:text-9xl hover:cursor-pointer hover:text-white transition-all text-7xl">
                        <ReactTextTransition className="w-full flex items-center">
                            {countryWindow.country_2_above ? parseInt(countryWindow.country_rank)-2 + ".": null} {countryWindow.country_2_above}
                        </ReactTextTransition>
                    </div>
                    <div onClick={() => getCountryWindow(countryWindow.country_1_above)} className="hover:text-9xl hover:cursor-pointer hover:text-white transition-all ">
                        <ReactTextTransition className="w-full flex items-center">
                            {countryWindow.country_1_above ? parseInt(countryWindow.country_rank)-1 + ".": null} {countryWindow.country_1_above}
                        </ReactTextTransition>
                    </div>
                    <div onClick={() => getCountryWindow(countryWindow.queried_country)} className="hover:text-9xl hover:cursor-pointer hover:text-white transition-all font-bold text-white text-9xl">
                        <ReactTextTransition className="w-full flex items-center">
                            {parseInt(countryWindow.country_rank)}. {countryWindow.queried_country}
                        </ReactTextTransition>
                    </div>
                    <div onClick={() => getCountryWindow(countryWindow.country_1_below)} className="hover:text-9xl hover:cursor-pointer hover:text-white transition-all ">
                        <ReactTextTransition className="w-full flex items-center">
                            {parseInt(countryWindow.country_rank)+1}. {countryWindow.country_1_below}
                        </ReactTextTransition>
                    </div>
                    <div onClick={() => getCountryWindow(countryWindow.country_2_below)}
                        className="hover:text-9xl hover:cursor-pointer hover:text-white transition-all text-7xl">
                        <ReactTextTransition className="w-full flex items-center">
                            {parseInt(countryWindow.country_rank)+2}. {countryWindow.country_2_below}
                        </ReactTextTransition>
                    </div>
                </div>
            </div>
            <div className="w-full h-24 bg-slate-900"/>
            <div className="w-full pl-8 h-full flex bg-slate-900">
                <div className="w-1/3 flex flex-col gap-12">
                    {
                        newsArticles.map(item => (<NewsArticle item={item} /> ))
                    }
                    {/*<NewsArticle />*/}
                    {/*<NewsArticle />*/}
                    {/*<NewsArticle />*/}
                </div>
                <div className="w-2/3 h-full pl-8 text-2xl font-serif flex flex-col text-white items-center">
                    <div className="w-full h-1/5" />
                    <div className="w-3/4 h-auto">
                        <div className="grid text-gray-400 grid-cols-[20%_50%_30%]">
                            <div>Country</div>
                            <div>Stocks</div>
                            <div className="flex justify-end">Avg Market Cap</div>
                        </div>
                        {topStocksData.map((row, index) => (
                            <div className="grid text-xl py-2 grid-cols-[20%_50%_30%] border-t border-gray-400" key={index}>
                                <div>{row.country_name}</div>
                                <div>{row.best_stocks}</div>
                                <div className="flex justify-end">{row.avg_country_performance.toFixed(0)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-slate-900 w-full h-full relative">
                <input onFocus={() => setSearch(true)} onBlur={() => setSearch(false)} ref={searchInputRef} onChange={onInput} className="w-full h-24 text-white placeholder:text-gray-500 text-7xl pl-8 font-serif" placeholder="Rank by indicator"/>
                <Collapse in={search} timeout="auto" unmountOnExit className="absolute top-24 z-20 w-1/3 left-8 h-full">
                    <div className="w-full h-full rounded-b-xl bg-white bg-opacity-5  backdrop-blur-xl ">
                        {
                            indicators.slice(0,10).map(item => (
                                <div onClick={() => updateIMFData(item.indicator_code, item.indicator_name)} className="w-full text-white flex items-center text-xl font-mono hover:underline hover:cursor-pointer justify-between px-4 py-2">
                                    <div className="truncate w-3/4 ">{item.indicator_name}</div>
                                    <div>{item.indicator_code}</div>
                                </div>
                            ))
                        }
                    </div>
                </Collapse>
                <div className=" w-full h-[83%] flex">
                    <div className="w-1/2 pl-8 flex text-white font-mono items-center justify-center">
                        <div className="w-3/4">
                            <div className="text-gray-400 grid grid-cols-[80%_20%]">
                                <div>Country</div>
                                <div className="flex justify-end">Value</div>
                            </div>
                            {topCountriesIMFData.map((row, index) => (
                                <div className="py-2 text-xl grid grid-cols-[80%_20%]" key={index}>
                                    <div>{row.country_name.split("(")[0]}</div>
                                    <div className="flex bg-green-800 bg-opacity-20 justify-end">{row.avg_value.toFixed(0)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 px-8 flex text-white font-mono items-center justify-center">
                        <div className="w-3/4">
                            <div className="text-gray-400 grid grid-cols-[80%_20%]">
                                <div>Country</div>
                                <div className="flex justify-end">Value</div>
                            </div>
                            {bottomCountriesIMFData.map((row, index) => (
                                <div className="py-2 text-xl grid grid-cols-[80%_20%]" key={index}>
                                    <div>{row.country_name.split("(")[0]}</div>
                                    <div className="flex bg-red-800 bg-opacity-20 h-full justify-end">{row.avg_value.toFixed(0)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>

        </div>
    );
};
