// UPDATE!!!

import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

// const config = require('./config.json');

export const SimilarView = () => {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  // const [countryName, setCountryName] = useState({});

//   useEffect(() => {

//     // fetch country name 
//     // fetch(`http://${config.server_host}:${config.server_port}/random`)
//     //   .then(res => res.json())
//     //   .then(resJson => setSongOfTheDay(resJson));
//   };

const country_name = "Australia";

const [IMFValues, getIMFValues] = useState([{}]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/getIMFInfo/${country_name}`)
            .then(res => res.json())
            .then(resJson => getIMFValues(resJson));
    }, [country_name]);

  return (
    <Container>
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell key='Indicator Name'>Indicator Name</TableCell>
                    <TableCell key='Indicator Value'>Indicator Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    IMFValues.map((row, i) => (
                        <TableRow key={row.indicator_name}>
                            <TableCell key='Indicator Name'>{row.indicator_name}</TableCell>
                            <TableCell key='Indicator Value'>{row.avg}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </TableContainer>
    </Container>
  );
}

export default SimilarView;