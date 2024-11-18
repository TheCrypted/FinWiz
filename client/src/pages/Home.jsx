import Globe from "react-globe.gl";
import { useRef, useState, useCallback, useEffect } from 'react';
import GeoJSON from '../assets/countries.json';
import earth_img from "../assets/earth_night.jpg"
import {InfoCard} from "../components/InfoCard.jsx";
import ReactTextTransition, { presets } from "react-text-transition";
import {useNavigate} from "react-router-dom";

export const Home = () => {
    const containerRef = useRef(null);
    const globeEl = useRef();
    const navigate = useNavigate();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [transitionDuration, setTransitionDuration] = useState(1000);
    const [hoveredPolygon, setHoveredPolygon] = useState(null);
    const [selectedPolygon, setSelectedPolygon] = useState(null);
    const [factCard, setFactCard] = useState([
        {indicator_name: "Employment", value: 20},
        {indicator_name: "GDP at Current Prices", value: 2605},
        {indicator_name: "Gross National Savings", value: 21},
        {indicator_name: "Inflation Index", value: 174},
        {indicator_name: "Population", value: 42},
        {indicator_name: "Total Investment", value: 23},
        {indicator_name: "Unemployment Rate", value: 6},
    ]);

    function colorGrade(value) {
        if (value < -50 || value > 200) {
            return 'rgba(0, 255, 0, 0.1)';
        }

        const normalized = (value + 50) / (200 + 50);

        const red = Math.round((1 - normalized) * 255);
        const green = Math.round(normalized * 255);

        return `rgba(${red}, ${green}, 0, 0.2)`;
    }


    useEffect(() => {
        if(!selectedPolygon) return;
        fetch(`http://localhost:3000/imf/summary?country=${selectedPolygon?.properties.adm0_iso}`)
            .then(res => res.json())
            .then(res => setFactCard(res))

    }, [selectedPolygon]);

    const handlePolygonHover = useCallback((polygon) => {
        setHoveredPolygon(polygon);
        document.body.style.cursor = polygon ? 'pointer' : 'default';
    }, []);

    const getPolColor = (polygon) => {
        if(polygon === selectedPolygon){
            return "rgba(150, 200, 120, 0.6)";
        }
        return hoveredPolygon === polygon ? 'rgba(50, 50, 120, 0.6)' : 'rgba(0, 0, 0, 0)'
    }

    const handlePolygonClick = useCallback((polygon) => {
        setSelectedPolygon(polygon);
        // console.log(polygon.properties)
        const lat = polygon.properties.label_y - 15;
        const lng = polygon.properties.label_x;
        globeEl.current.pointOfView({
            lat: lat,
            lng: lng,
            altitude: 1.75
        }, 1000);

        const controls = globeEl.current.controls();
        controls.autoRotate = false;
    }, []);

    useEffect(() => {
        let controls = globeEl.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.1;
        controls.enableZoom = false;
        globeEl.current.pointOfView({lat:0, long:0, altitude: 1.75 }, 200);
    }, []);

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

    return (
        <div className="w-full h-full relative bg-black overflow-hidden">
            <div className="w-full h-full absolute">
                <div className="ticker-wrap bottom-0 absolute h-10 w-full text-slate-800 font-serif_light text-2xl ">
                    <div class="ticker">
                        <span class="item-collection-1">
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                        </span>
                        <span class="item-collection-2">
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                            <span class="item">University of Pennsylvania</span>
                        </span>
                    </div>
                </div>
                <div className="w-full text-white text-8xl flex items-center justify-center h-1/4 font-serif_light absolute top-1/3">
                    <ReactTextTransition className="w-full h-full flex items-center justify-center">
                        {selectedPolygon?.properties?.sovereignt}
                    </ReactTextTransition>
                </div>
            </div>
            <div onClick={e => {
                e.stopPropagation();
                setSelectedPolygon(null);
                globeEl.current.controls().autoRotate = true;
            }} ref={containerRef} className="w-full absolute grid grid-rows-[42%_58%] h-screen">
                <div/>
                <Globe
                    ref={globeEl}
                    width={dimensions.width}
                    height={dimensions.height}
                    globeImageUrl={earth_img}
                    atmosphereColor="rgba(100, 100, 150, 1)"
                    atmosphereAltitude={0.15}
                    polygonsData={GeoJSON.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
                    polygonAltitude={(d) => hoveredPolygon === d ? 0.1 : 0.01}
                    backgroundColor="rgba(0, 0, 0, 0)"
                    polygonCapColor={getPolColor}
                    polygonSideColor={() => 'rgba(200, 200, 200, 0.05)'}
                    onPolygonHover={handlePolygonHover}
                    onPolygonClick={handlePolygonClick}
                    polygonLabel={({properties: d}) => `
                    <b class="font-serif_bold">${d.name_sort}</b>
                `}
                    polygonsTransitionDuration={transitionDuration}
                />
            </div>
            <div
                className="w-full z-20 absolute top-0 h-16 grid grid-cols-[20%_60%_10%_10%] text-2xl text-gray-500 font-serif font-thin ">
                <div className="w-full h-full hover:underline transition-all hover:cursor-pointer flex items-center pl-8">
                    Hi, Aman
                </div>
                <div/>
                <div onClick={() => navigate("/portfolio")} className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center ">
                    Portfolio
                </div>
                <div onClick={() => navigate("/signin")} className="w-full h-full hover:underline transition-all hover:cursor-pointer flex justify-end items-center pr-8">
                    Sign In
                </div>
            </div>
            {selectedPolygon && <div onClick={e => {
                e.stopPropagation();
                setSelectedPolygon(null);
                globeEl.current.controls().autoRotate = true;
            }} className="w-1/4  h-full flex items-end absolute">
                <div className="w-full pb-12 absolute bottom-0 h-1/4 ">
                    <InfoCard factCard={factCard.slice(0, 4)} key={0} country={selectedPolygon?.properties.adm0_iso}/>
                </div>
            </div>}
            {selectedPolygon && <div onClick={e => {
                e.stopPropagation();
                setSelectedPolygon(null);
                globeEl.current.controls().autoRotate = true;
            }} className="w-1/4 h-full flex right-0 items-end absolute">
                <div className="w-full pb-12 absolute bottom-0 h-1/4 ">
                    <InfoCard factCard={factCard.slice(4, 8)} key={1} right={true} country={selectedPolygon?.properties.adm0_iso}/>
                </div>
            </div>}
        </div>

    );
};