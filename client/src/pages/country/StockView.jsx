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

export const StockView = () => {
  const country_name = "Canada";
  const [SummaryStockInfo, getSummaryStockInfo] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/getSummaryStockInfo/${country_name}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((resJson) => {
        console.log("API Response for Summary Stock Info:", resJson);
        if (resJson.summary_stock_info) {
          getSummaryStockInfo(resJson.summary_stock_info);
          console.log("Updated State with:", resJson.summary_stock_info);
        } else {
          console.error("API response does not contain stock_info");
          getSummaryStockInfo([]); // Fallback
        }
      })
      .catch((err) => {
        console.error("Error fetching stock information:", err);
        getSummaryStockInfo([]); // Fallback
      });
  }, [country_name]);

  return (
    <Container>
      <h1>STATS FOR CANADA</h1>
      <TableContainer>
        <h2>Stock Information</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Industry</TableCell>
              <TableCell>Company Count</TableCell>
              <TableCell>Average Open Price</TableCell>
              <TableCell>Average Close Price</TableCell>
              <TableCell>Minimum Close Price</TableCell>
              <TableCell>Maximum Close Price</TableCell>
              <TableCell>YOY Close Growth</TableCell>
              <TableCell>High Volatility Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(SummaryStockInfo) && SummaryStockInfo.length > 0 ? (
              SummaryStockInfo.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.industry || "N/A"}</TableCell>
                  <TableCell>{row.company_count || "N/A"}</TableCell>
                  <TableCell>{row.avg_open_price || "N/A"}</TableCell>
                  <TableCell>{row.avg_close_price || "N/A"}</TableCell>
                  <TableCell>{row.min_close_price || "N/A"}</TableCell>
                  <TableCell>{row.max_close_price || "N/A"}</TableCell>
                  <TableCell>{row.yoy_close_growth || "N/A"}</TableCell>
                  <TableCell>{row.high_volatility_count || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

export default StockView;
