import {useNavigate} from "react-router-dom";

export const InfoCard = ({country, right, factCard}) => {
    const navigate = useNavigate();
    return (
        <div className="w-full h-full rounded-r-2xl flex items-end shadow-xl">
            <div className="w-full h-auto">
                <div onClick={() => right ? navigate('/educationView/' + encodeURI(country)) : navigate('/imfview/' + encodeURI(country))}
                    className={`h-auto text-right py-1 w-full text-xl flex ${right ? "justify-end" : ""} pr-8 hover:underline hover:cursor-pointer items-center pl-8 text-gray-500 font-mono`}>
                    {right ? "Education Analysis" : "IMF Analysis"}
                </div>

                {
                    factCard.length > 0 && factCard.map(({indicator_name, value}) => {
                        return (
                            <div
                                className={`h-auto text-right py-1 w-full text-xl flex ${right ? "justify-end" : ""} pr-8 items-center pl-8 text-gray-500 font-mono`}>
                                {indicator_name.split(",")[0]}: {Math.round(value)}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}