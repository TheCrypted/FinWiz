import Globe from "react-globe.gl";
import { useRef, useState, useCallback, useEffect } from 'react';
import GeoJSON from '../assets/countries.json';
import earth_img from "../assets/earth_night.jpg"
import {InfoCard} from "../components/InfoCard.jsx";
import ReactTextTransition, { presets } from "react-text-transition";

export const Home = () => {
    const containerRef = useRef(null);
    const globeEl = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [transitionDuration, setTransitionDuration] = useState(1000);
    const [hoveredPolygon, setHoveredPolygon] = useState(null);
    const [selectedPolygon, setSelectedPolygon] = useState(null);

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
        <div className="w-full h-full relative bg-black">
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
                <div className="w-full text-white text-9xl flex items-center justify-center h-1/4 font-serif_light absolute top-1/3">
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
            {selectedPolygon && <div className="w-1/4 h-full flex items-end absolute">
                <div className="w-full pb-12 absolute bottom-0 h-1/4 ">
                    <InfoCard country={selectedPolygon?.properties.adm0_iso}/>
                </div>

            </div>}
        </div>

    );
};