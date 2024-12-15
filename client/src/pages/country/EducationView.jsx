import {useContext, useEffect, useState} from "react";
import {Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {AuthContext} from "../../context/AuthContext.jsx";
import {generateChartData, processEducationValues, processIMFPerformance} from "../../utils/helpers.js";
import ReactTextTransition from "react-text-transition";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis
} from "recharts";
import {useNavigate, useParams} from "react-router-dom";
import {Footer} from "../../components/Footer.jsx";
import {HOST_AWS, PORT_AWS} from "../../backend.json";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
        <div className="rounded-xl text-white backdrop-blur-md p-2 bg-white bg-opacity-20">
          <p><strong>{name}</strong></p>
          <p>Percentage Difference: <b>{value.toFixed(1)}</b>%</p>
        </div>
    );
  }
  return null;
};
const CustomTooltip2 = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { indicator_name, indicator_value } = payload[0].payload;
    return (
        <div className="rounded-xl text-white backdrop-blur-md p-2 bg-white bg-opacity-20">
          <p><strong>{indicator_name}</strong></p>
          <p>Percentage Difference: <b>{indicator_value.toFixed(1)}</b>%</p>
        </div>
    );
  }
  return null;
};

export const EducationView = () => {
  const {country_name} = useParams();
  const [EducationValues, getEducationValues] = useState([]);
  const [PercentDifference, getPercentDifference] = useState([]);
  const [improvedEduData, setImprovedEduData] = useState([]);
  const {user, authTokens} = useContext(AuthContext);
  const [factor, setFactor] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://${HOST_AWS}:${PORT_AWS}/getPercentageDiffEducation/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.percentage_difference) {
          getPercentDifference(resJson.percentage_difference); // Correct key
        } else {
          console.error("API response does not contain percentage_difference");
          getPercentDifference([]); // Fallback
        }
      })
      .catch((err) => {
        console.error("Error fetching percentage difference:", err);
        getPercentDifference([]); // Fallback
      });
  }, [country_name]);


  useEffect(() => {
    fetch(`http://${HOST_AWS}:${PORT_AWS}/getEducationInfo/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => {
        getEducationValues(resJson.education_info || []); // Extract imf_info array
        console.log(resJson)
      })
      .catch((err) => {
        console.error("Error fetching education data:", err);
        getEducationValues([]); // Fallback to empty array on error
      });
  }, [country_name]);

  useEffect(() => {
    fetch(`http://${HOST_AWS}:${PORT_AWS}/getIncreasingIndicators/${country_name}`)
      .then((res) => res.json())
      .then((resJson) => setImprovedEduData(resJson.improv_edu_info));
  }, [country_name]);

  return (
      <div className="w-full bg-slate-900 h-full overflow-y scrollbar">
        <div className="w-full z-20 top-0 h-16 grid grid-cols-[15%_65%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
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
        <div className="w-full place-items-center h-[88%] grid grid-cols-[45%_55%]">
          <div className="pl-12 flex flex-col w-full h-auto text-xl text-gray-300 font-mono pr-4">
            <div
                className="text-gray-400 w-full border-b border-white border-opacity-20 grid grid-cols-[30%_30%_40%] p-4">
              <div className="flex items-center justify-start">Age Range</div>
              <div className="flex items-center ">Gender</div>
              <div className="flex items-center justify-end">Mean Years in School</div>
            </div>
            {PercentDifference ? (
                PercentDifference.filter(item => !item.indicator_name.includes("Total")).map((row, i) => {
                  let range = row.indicator_name.split(":")[1].split(".",3).slice(1,3);
                  return (
                      <div style={{
                        backgroundColor: factor === i ? "rgba(0,0,0,0.4)" : "transparent"
                      }} onClick={() => setFactor(i)}
                          className="hover:!bg-white/10 transition-all hover:cursor-pointer w-full border-b border-white border-opacity-20 grid grid-cols-[30%_30%_40%] justify-between p-4"
                          key={i}>
                        <div className="flex items-center">{range[0] || "N/A"}</div>
                        <div className="flex items-center text-gray-400">{range[1] || "N/A"}</div>
                        <div className="flex items-center justify-end">{row.education_value.toFixed(2) || "N/A"}</div>
                      </div>
                  )
                })
            ) : (
                <div>
                  <div colSpan={2} align="center">
                    No data available
                  </div>
                </div>
            )}
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-xl text-white  font-mono w-3/4 pb-8 flex items-center justify-center">
              <ReactTextTransition>
                {PercentDifference[factor]?.indicator_name.split(":")[1]}
              </ReactTextTransition>
            </div>
            <ResponsiveContainer width="80%" height={400}>
              <LineChart
                  data={generateChartData(PercentDifference[factor])}
                  margin={{top: 20, right: 30, left: 20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis>
                  <Label className="w-full h-full flex items-center justify-center" value="Values"
                         angle={-90}
                         position="left"
                         offset={0}>Years</Label>
                </YAxis>
                <Tooltip content={<CustomTooltip/>}/>
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ResponsiveContainer className="bg-slate-900" width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={EducationValues.filter(item => !item.indicator_name.includes("GPI"))}>
            <PolarGrid />
            <PolarAngleAxis tickFormatter={item => item.split(",").slice(1, 3).join(",")} dataKey="indicator_name" />
            <PolarRadiusAxis />
            <Radar name="indicator_name" dataKey="indicator_value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      <Footer />
      </div>
  );
};

export default EducationView;
