import {useEffect, useState} from "react";

export const InfoCard = ({country}) => {
    const [factCard, setFactCard] = useState([
        {indicator_name: "Employment", value: 20},
        {indicator_name: "GDP at Current Prices", value: 2605},
        {indicator_name: "Gross National Savings", value: 21},
        {indicator_name: "Inflation Index", value: 174},
    ])

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

    // TODO eliminate the background entirel;y make it seem like a part of the page
    return (
        <div className="w-full h-full rounded-r-2xl shadow-xl">
            <div className="w-full h-full ">
                {
                    factCard.length > 0 && factCard.map(({indicator_name, value}) => {
                        return (
                            <div className="h-auto py-2 w-full text-2xl flex items-center pl-8 text-gray-400 font-serif">
                                {indicator_name.split(",")[0]}: {Math.round(value)}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}