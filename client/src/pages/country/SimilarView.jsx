// UPDATE!!!

import { useEffect, useState } from 'react';
import {
    Container, 
    Divider, 
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";

// const config = require('./config.json');

export const SimilarView = () => {

    const country_name = "Canada";

    const [SimilarEducationCountries, getSimilarEducationCountries] = useState([]);

    //fetch relevant queries data 
    useEffect(() => {
        fetch(`http://localhost:3000/getSimilarEducationCountries/${country_name}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((resJson) => {
            console.log("API Response for Similar Education Countries:", resJson);
            if (Array.isArray(resJson.similar_countries)) {
              getSimilarEducationCountries(resJson.similar_countries); // Use the nested array
            } else {
              console.error("API response does not contain a valid similar_countries array:", resJson);
              getSimilarEducationCountries([]); // Fallback
            }
          })
          .catch((err) => {
            console.error("Error fetching similar education countries:", err);
            getSimilarEducationCountries([]); // Fallback on error
          });
      }, [country_name]);
      
      

  return (
    <Container>
    <h1>STATS FOR CANADA</h1>
      <TableContainer>
      <h2>Similar Countries Based on Education Indicators</h2>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell key='Country Name'>Country Name</TableCell>
                    <TableCell key='Performance Score'>Performance Score</TableCell>
                    <TableCell key='Distance'>Distance</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {/* display in table form similar countries & their quantitative differences in performance */}
                {Array.isArray(SimilarEducationCountries) && SimilarEducationCountries.length > 0 ? (
                    SimilarEducationCountries.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{row.country_name || "N/A"}</TableCell>
                        <TableCell>{row.performance_score || "N/A"}</TableCell>
                        <TableCell>{row.distance || "N/A"}</TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={3} align="center">
                        No data available
                    </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
    </Container>
  );
}

export default SimilarView;