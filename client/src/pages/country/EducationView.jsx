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
  const [PercentDifference, getPercentDifference] = useState([]);
  const [improvedEduData, setImprovedEduData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/getPercentageDiffEducation/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("API Response:", resJson); // Debugging
        getPercentDifference(resJson.imf_performance || []); // Extract imf_info array
      })
      .catch((err) => {
        console.error("Error fetching education percentage difference:", err);
        getPercentDifference([]); // Fallback to empty array on error
      });
  }, [country_name]);

  useEffect(() => {
    fetch(`http://localhost:3000/getEducationInfo/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("API Response:", resJson); // Debugging
        getEducationValues(resJson.education_info || []); // Extract imf_info array
      })
      .catch((err) => {
        console.error("Error fetching education data:", err);
        getEducationValues([]); // Fallback to empty array on error
      });

    fetch(`http://localhost:3000/getIncreasingIndicators/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => setImprovedEduData(resJson.improv_edu_info));
  }, [country_name]);

  return (
    <Container>
      <h1>STATS FOR AUSTRALIA</h1>
      <TableContainer>
        <h2>Education Indicator Average Values</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Indicator Name</TableCell>
              <TableCell>Indicator Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(EducationValues) && EducationValues.length > 0 ? (
              EducationValues.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.indicator_name || "N/A"}</TableCell>
                  <TableCell>{row.indicator_value || "N/A"}</TableCell>
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
        <h2>Percentage Difference in Education Indicators from Previous Year</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Indicator Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Percentage Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(PercentDifference) && PercentDifference.length > 0 ? (
              PercentDifference.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.indicator_name || "N/A"}</TableCell>
                  <TableCell>{row.year || "N/A"}</TableCell>
                  <TableCell>{row.education_value || "N/A"}</TableCell>
                  <TableCell>{row.year_change || "N/A"}</TableCell>
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

      <h1>Improving Countries</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Indicator Name</TableCell>
              <TableCell>Start Year</TableCell>
              <TableCell>End Year</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {improvedEduData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.indicator_name}</TableCell>
                <TableCell>{row.begin_year}</TableCell>
                <TableCell>{row.end_year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EducationView;
