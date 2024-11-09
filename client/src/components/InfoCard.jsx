import {useEffect, useState} from "react";

export const InfoCard = ({country}) => {
    const [factCard, setFactCard] = useState([])

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
        fetch(`http://localhost:3000/imf/summary?country=${country}`)
            .then(res => res.json())
            .then(res => setFactCard(res))
    }, [country]);

    return (
        <div className="w-full h-full rounded-r-2xl grid grid-rows-[20%_80%] bg-opacity-25 bg-gray-600 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-center text-white text-4xl font-serif_light">
                Monetary Statistics
            </div>
            <div className="w-full h-full flex flex-col">
                {
                    factCard.length > 0 && factCard.map(({indicator_name, value}) => {
                        return (
                            <div className="h-1/6 grid grid-cols-[70%_30%] w-full">
                                <div
                                    className="w-full h-full text-2xl flex items-center pl-4 text-white font-serif">
                                    {indicator_name.split(",")[0]}
                                </div>
                                <div style={{backgroundColor: colorGrade(value)}}
                                    className="w-full bg-opacity-20 h-full text-white font-serif_bold justify-center text-3xl flex items-center">{Math.round(value)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}