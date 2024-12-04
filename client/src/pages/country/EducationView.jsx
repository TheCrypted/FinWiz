import { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const EducationView = () => {
  const country_name = "Australia";
  const [EducationValues, getEducationValues] = useState([]);
//   const [IMFPerformance, getIMFPerformance] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:3000/getIMFPerformance/${country_name}`)
//       .then((res) => res.json())
//       .then((resJson) => {
//         console.log("API Response:", resJson); // Debugging
//         getIMFPerformance(resJson.imf_performance || []); // Extract imf_info array
//       })
//       .catch((err) => {
//         console.error("Error fetching IMF performance info:", err);
//         getIMFPerformance([]); // Fallback to empty array on error
//       });
//   }, [country_name]);

  useEffect(() => {
    fetch(`http://localhost:3000/getEducationInfo/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("API Response:", resJson); // Debugging
        getIMFValues(resJson.imf_info || []); // Extract imf_info array
      })
      .catch((err) => {
        console.error("Error fetching IMF data:", err);
        getIMFValues([]); // Fallback to empty array on error
      });
  }, [country_name]);

  return (
    <Container>
        <h1>STATS FOR AUSTRALIA</h1>
      <TableContainer>
        <Table>
            <h2>IMF Indicator Comparative Performance</h2>
          <TableHead>
            <TableRow>
              <TableCell>Indicator Name</TableCell>
              <TableCell>Indicator Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(IMFValues) && IMFValues.length > 0 ? (
              IMFValues.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.indicator_name || "N/A"}</TableCell>
                  <TableCell>{row.avg || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table>
        <h2>IMF Indicator Average Values</h2>
          <TableHead>
            <TableRow>
              <TableCell>Indicator Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Country Average</TableCell>
              <TableCell>Global Average</TableCell>
              <TableCell>Percentage Point Difference</TableCell>
              <TableCell>Performance Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(IMFPerformance) && IMFPerformance.length > 0 ? (
              IMFPerformance.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.indicator_name || "N/A"}</TableCell>
                  <TableCell>{row.year || "N/A"}</TableCell>
                  <TableCell>{row.country_average || "N/A"}</TableCell>
                  <TableCell>{row.global_average || "N/A"}</TableCell>
                  <TableCell>{row.percentage_point_difference || "N/A"}</TableCell>
                  <TableCell>{row.performance_status || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EducationView;
