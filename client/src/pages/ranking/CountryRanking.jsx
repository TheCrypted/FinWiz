import { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const CountryRanking = () => {
    const indicatorCode = 'UIS.FEP.3'; // Replace with user search function result if needed.

    const [topCountriesData, setTopCountriesData] = useState([]); // Initialize as an empty array

    useEffect(() => {
        fetch(`http://localhost:3000/getTopCountriesEducation/${indicatorCode}`)
            .then((res) => res.json())
            .then((resJson) => setTopCountriesData(resJson.education_info));
    }, [indicatorCode]);

    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>Average Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topCountriesData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.country_name}</TableCell>
                                <TableCell>{row.val}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
