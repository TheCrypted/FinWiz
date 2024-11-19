import {useNavigate, useSearchParams} from 'react-router-dom';
import earth_img from "../../assets/earth_night.jpg";
import GeoJSON from "../../assets/countries.json";
import Globe from "react-globe.gl";
import {useEffect, useRef, useState} from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

export const Country = () => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const globeRef = useRef(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 },
        { name: 'May', value: 500 }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        return (
            <div className="backdrop-blur-sm" style={{
                backgroundColor: "rgba(100, 100, 100, 0.2)",
                padding: '10px',
                // border: '1px solid #ccc',
                borderRadius: '5px'
            }}>
                <p className="text-white">{label}</p>
                {payload.map((item, index) => (
                    <p key={index} style={{ color: item.color }}>
                        {`${item.name}: ${item.value}`}
                    </p>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Calculate mouse position relative to center of screen
            const x = (event.clientX - window.innerWidth / 2) / window.innerWidth;
            const y = (event.clientY - window.innerHeight / 2) / window.innerHeight;
            setMousePosition({ x, y });

            if (globeRef.current) {
                // Get current point of view
                const currentPov = globeRef.current.pointOfView();

                globeRef.current.pointOfView({
                    lat: currentPov.lat + y*0.2,
                    altitude: 0.8
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.25;
            globeRef.current.pointOfView({
                lat: 0,
                lng: 0,
                altitude: 0.8
            }, 1000);
        }
    }, []);

    const countryName = searchParams.get('code');

    return (
        <div className="bg-black overflow-hidden" ref={containerRef}>
            <div className="absolute bg-black">
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    globeImageUrl={earth_img}
                    atmosphereColor="rgba(100, 100, 150, 1)"
                    atmosphereAltitude={0.15}
                    backgroundColor="rgba(0, 0, 0, 0)"
                />
            </div>
            <div className="absolute bg-black bg-opacity-60 scrollbar overflow-y-auto w-full h-full">
                <div className="bg-black bg-opacity-20 backdrop-blur-md w-full z-20 top-0 h-16 grid grid-cols-[20%_60%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
                    <div onClick={() => navigate("/")}
                        className="w-full h-full hover:underline transition-all hover:cursor-pointer flex items-center pl-8">
                        Hi, Aman
                    </div>
                    <div/>
                    <div onClick={() => navigate("/portfolio")}
                         className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center ">
                        Portfolio
                    </div>
                    <div onClick={() => navigate("/signin")}
                         className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center pr-8">
                        Sign In
                    </div>
                </div>
                <div className="w-full h-[90%] grid grid-cols-[15%_65%_20%]">
                    {/* Left spacer - 20% */}
                    <div className="col-span-1"></div>
                    <div className="col-span-1 flex items-center justify-center">
                        <LineChart width={800} height={500} data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                            <XAxis
                                dataKey="name"
                                stroke="rgba(255,255,255, 0.5)"
                                tick={{ fill: '#fff', opacity: 0.5 }}
                                tickLine={{ stroke: '#fff', opacity: 0.5 }}
                            />
                            <YAxis
                                stroke="rgba(255,255,255, 0.5)"
                                tick={{ fill: '#fff', opacity: 0.5 }}
                                tickLine={{ stroke: '#fff', opacity: 0.5 }}
                            />
                            <Tooltip content={<CustomTooltip />} contentStyle={{backgroundColor: '#333', border: 'none'}}/>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#fff"
                                strokeWidth={2}
                                dot={{stroke: '#fff', strokeWidth: 2}}
                            />
                        </LineChart>
                    </div>
                    <div className="col-span-1"></div>
                </div>

            </div>
        </div>
    );
}