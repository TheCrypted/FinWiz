
export const InfoCard = ({country, right, factCard}) => {


    return (
        <div className="w-full h-full rounded-r-2xl flex items-end shadow-xl">
            <div className="w-full h-auto">
                {
                    factCard.length > 0 && factCard.map(({indicator_name, value}) => {
                        return (
                            <div className={`h-auto text-right py-1 w-full text-xl flex ${right ? "justify-end" : ""} pr-8 items-center pl-8 text-gray-500 font-mono`}>
                                {indicator_name.split(",")[0]}: {Math.round(value)}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}