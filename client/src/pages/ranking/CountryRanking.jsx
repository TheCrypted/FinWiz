import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const config = require('./config.json');

export const CountryRanking = () => {
    const { indicatorCode } = 'UIS.FEP.3';   //REPLACE w user search function result

    const [topCountriesData, setTopCountriesData] = useState([{}]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/getTopCountriesEducation/${indicatorCode}`)
            .then(res => res.json())
            .then(resJson => setTopCountriesData(resJson));
    }, [indicatorCode]);

    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell key='Country'>Country</TableCell>
                            <TableCell key='Average Value'>Average Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            topCountriesData.map((row, i) => (
                                <TableRow key={row.country_name}>
                                    <TableCell key='Country'>{row.country_name}</TableCell>
                                    <TableCell key='Average Value'>{row.val}</TableCell>
                                </TableRow>
                            ))

                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}