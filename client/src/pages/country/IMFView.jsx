import {useContext, useEffect, useState} from "react";
import {Collapse, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {AuthContext} from "../../context/AuthContext.jsx";
import {processIMFPerformance, processIMFValues} from "../../utils/helpers.js";
import ReactTextTransition from "react-text-transition";
import {HOST_AWS, PORT_AWS} from "../../backend.json";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, percentage_point_difference } = payload[0].payload;
    return (
        <div className="rounded-xl backdrop-blur-md p-2 bg-white bg-opacity-20">
          <p><strong>{name}</strong></p>
          <p>Percentage Difference: <b>{percentage_point_difference}</b>%</p>
        </div>
    );
  }
  return null;
};

export const IMFView = () => {
  // const country_name = "Australia";
  const [IMFValues, getIMFValues] = useState([]);
  const [IMFPerformance, getIMFPerformance] = useState([]);
  const {country_name} = useParams();
  const {user, authTokens} = useContext(AuthContext)
  const [chart, setChart] = useState(0)
  const navigate = useNavigate();

  const formatPerformanceData = (data) => {
    return data.map(item => ({
      name: item.indicator_name.split(",")[0],
      countryAvg: parseFloat(item.country_average),
      globalAvg: parseFloat(item.global_average),
      difference: parseFloat(item.percentage_point_difference)
    }));
  };


  useEffect(() => {
    fetch(`http://${HOST_AWS}:${PORT_AWS}/getIMFPerformance/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("API Response:", resJson); // Debugging
        getIMFPerformance(resJson.imf_performance || []); // Extract imf_info array
      })
      .catch((err) => {
        console.error("Error fetching IMF performance info:", err);
        getIMFPerformance([]); // Fallback to empty array on error
      });
  }, [country_name]);

  useEffect(() => {
    fetch(`http://${HOST_AWS}:${PORT_AWS}/getIMFInfo/${country_name}`)
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
      <div className="overflow-hidden w-full h-full bg-slate-900 text-white">
        <div
            className="w-full z-20 top-0 h-16 grid grid-cols-[15%_65%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
          <div onClick={() => navigate("/")}
               className="w-full h-full hover:underline transition-all hover:cursor-pointer flex items-center pl-8">
            Hi, {user?.username}
          </div>
          <div className="w-full flex items-center justify-center h-full relative">
            <b className="font-bold">{country_name}</b> &nbsp; vs the World
          </div>

          <div onClick={() => navigate("/portfolio")}
               className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center ">
            Portfolio
          </div>
          <div onClick={() => {
            if (authTokens?.access) logout();
            else navigate("/signin")
          }}
               className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center pr-8">
            {authTokens?.access ? "Sign out" : "Sign In"}
          </div>
        </div>
        <div className="w-full place-items-center h-[92%] grid grid-cols-[45%_55%]">
          <div className="pl-4 flex flex-col w-full h-auto  text-xl text-gray-300 font-mono pr-4">
            {Array.isArray(IMFPerformance) && IMFPerformance.length > 0 ? (
                processIMFPerformance(IMFPerformance).map((row, i) => (
                    <div style={{
                          backgroundColor: chart === i ? "rgba(0,0,0,0.4)" : "transparent"
                        }} onClick={() => setChart(i)} className="hover:!bg-white/10 transition-all hover:cursor-pointer w-full border-b border-white border-opacity-20 flex justify-between p-4" key={i}
                    >
                      <div className="w-3/4 flex justify-start">{row.indicator_name || "N/A"}</div>
                      <div className="w-1/4 text-gray-200 flex justify-end">{row.country_average || "N/A"}</div>
                    </div>
                ))
            ) : (
                <div>
                  <div colSpan={2} align="center">
                    No data available
                  </div>
                </div>
            )}
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-xl font-mono w-3/4 pb-4 flex items-center justify-center">
              <ReactTextTransition>
                {IMFPerformance[chart]?.indicator_name}
              </ReactTextTransition>
            </div>
          <ResponsiveContainer height={650} width={800}>
            <BarChart data={[IMFPerformance[chart]]} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis>
                <Label className="w-full h-full flex items-center justify-center" value="Values"
                       angle={-90}
                       position="left"
                       offset={10}>{IMFPerformance[chart]?.indicator_name.split(",")[1]}</Label>
              </YAxis>
              <Tooltip cursor={false} content={<CustomTooltip/>}/>
              <Legend/>
              <Bar dataKey="country_average" fill="#82ca9d" barSize={30} name="Country Average"/>
              <Bar dataKey="global_average" fill="#8884d8" barSize={15} name="Global Average"/>

            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
};

export default IMFView;
