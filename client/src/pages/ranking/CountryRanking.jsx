import {useContext, useEffect, useState} from 'react';
import { Button, TextField, Container, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { red } from '@mui/material/colors';
import {AuthContext} from "../../context/AuthContext.jsx";
import ReactTextTransition from "react-text-transition";

export const CountryRanking = () => {
    //ranking table for top countries for a given education indicator code
    const indicatorEduCode = 'UIS.FEP.3'; // Replace with user search function result
    const [topCountriesEduData, setTopCountriesEduData] = useState([]); // Initialize as an empty array
    const [countryWindow, setCountryWindow] = useState({});

    //ranking table for top countries for a given imf indicator code 
    const indicatorIMFCode = 'PPPGDP'; // Replace with user search function result
    const [topCountriesIMFData, setTopCountriesIMFData] = useState([]);
    const {user, authTokens} = useContext(AuthContext);

    //ranking table for combined education & imf performance
    //no search function needed
    const [topCountriesData, setTopCountriesData] = useState([]);

    const [topStocksData, setTopStocksData] = useState([]);

    const getCountryWindow = (country) => {
        fetch(`http://localhost:3000/getCountryWindow?country=${country}`, {
            method: 'GET',
        }).then(res => res.json())
            .then(res => setCountryWindow(res.window_info[0]))
            .catch(err => console.error(err));
    }
    console.log(countryWindow)

    useEffect(() => {
        fetch(`http://localhost:3000/getTopCountriesEducation/${indicatorEduCode}`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesEduData(resJson.education_info));

        fetch(`http://localhost:3000/getTopCountriesIMF/${indicatorIMFCode}`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesIMFData(resJson.imf_info));

        fetch(`http://localhost:3000/getTopCountriesCombined`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesData(resJson.rank_info));

        fetch(`http://localhost:3000/getTopStocksPerCountry`)
            .then((res) => res.json())
            .then((resJson) => setTopStocksData(resJson.rank_stock_info));

    }, [indicatorEduCode], [indicatorIMFCode]);

    return (

        <div className="w-full h-full bg-slate-900">

            <div className="w-full h-full relative">
                <div className="w-full pointer-events-none h-full absolute flex justify-end z-20">
                    <div className="flex items-center justify-center w-1/2 pointer-events-auto">
                        <div className="rounded-xl w-2/4 h-2/5 grid pl-4 text-gray-200 text-xl  font-mono grid-rows-2 bg-opacity-10  ">
                            <div className="flex items-center">Education score: {countryWindow?.avg_education_value.toFixed(0)}</div>
                            <div className="flex items-end ">International Monetary score: {countryWindow?.avg_imf_value.toFixed(0)}</div>
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
                        Country Rankings
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
            {/* depending on which button pressed, change search by results to education indicator, 
                IMF indicators or no search needed if rank by overall or stocks */}

            <Button onClick={() => search()} style={{left: '5%', transform: 'translateX(-50%)'}}>
                Rank By Education
            </Button>

            <Button onClick={() => search()} style={{left: '15%', transform: 'translateX(-50%)'}}>
                Rank By Macroeconomics
            </Button>

            <Button onClick={() => search()} style={{left: '25%', transform: 'translateX(-50%)'}}>
                Rank By Overall
            </Button>

            <Button onClick={() => search()} style={{left: '35%', transform: 'translateX(-50%)'}}>
                Rank By Stocks
            </Button>

            {/* For search bar, need AUTO-COMPLETE since user doesn't know the indicators */}
            <TextField label='Rank by' style={{width: "100%"}}/>

            <Button onClick={() => search()} style={{left: '90%', transform: 'translateX(-50%)'}}>
                Generate Ranking
            </Button>

            <h1>Top Countries for {indicatorEduCode}</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>Average Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topCountriesEduData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.country_name}</TableCell>
                                <TableCell>{row.val}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider></Divider>

            <h1>Top Countries for {indicatorIMFCode}</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>Average Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topCountriesIMFData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.country_name}</TableCell>
                                <TableCell>{row.avg_value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider></Divider>

            <h1>Top Countries (Combined)</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Average Education Value</TableCell>
                            <TableCell>Average IMF Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topCountriesData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.country_rank}</TableCell>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>{row.country_name}</TableCell>
                                <TableCell>{row.avg_education_value}</TableCell>
                                <TableCell>{row.avg_imf_value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <h1>Top Stocks For Each Country</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>Stocks</TableCell>
                            <TableCell>Average Stock Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topStocksData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.country_name}</TableCell>
                                <TableCell>{row.best_stocks}</TableCell>
                                <TableCell>{row.avg_country_performance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider></Divider>


        </div>
    );
};
