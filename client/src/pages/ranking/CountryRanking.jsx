import { useEffect, useState } from 'react';
import { Button, TextField, Container, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { red } from '@mui/material/colors';

export const CountryRanking = () => {
    //ranking table for top countries for a given education indicator code
    const indicatorEduCode = 'UIS.FEP.3'; // Replace with user search function result
    const [topCountriesEduData, setTopCountriesEduData] = useState([]); // Initialize as an empty array

    //ranking table for top countries for a given imf indicator code 
    const indicatorIMFCode = 'PPPGDP'; // Replace with user search function result
    const [topCountriesIMFData, setTopCountriesIMFData] = useState([]);

    //ranking table for combined education & imf performance
    //no search function needed
    const [topCountriesData, setTopCountriesData] = useState([]);

    const [topStocksData, setTopStocksData] = useState([]);

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

        <Container>
            {/* depending on which button pressed, change search by results to education indicator, 
                IMF indicators or no search needed if rank by overall or stocks */}

            <Button onClick={() => search()} style={{ left: '5%', transform: 'translateX(-50%)' }}>
                Rank By Education
            </Button>

            <Button onClick={() => search()} style={{ left: '15%', transform: 'translateX(-50%)' }}>
                Rank By Macroeconomics
            </Button>

            <Button onClick={() => search()} style={{ left: '25%', transform: 'translateX(-50%)' }}>
                Rank By Overall
            </Button>

            <Button onClick={() => search()} style={{ left: '35%', transform: 'translateX(-50%)' }}>
                Rank By Stocks
            </Button>

            {/* For search bar, need AUTO-COMPLETE since user doesn't know the indicators */}
            <TextField label='Rank by' style={{ width: "100%" }} />

            <Button onClick={() => search()} style={{ left: '90%', transform: 'translateX(-50%)' }}>
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


        </Container>
    );
};
