export const AddPopup = ({ticker, active, setActive}) => {

    const submitForm = (e) => {
        e.preventDefault();
        // fetch("http://localhost:3000/portfolio/investment", {
        //     method: "POST",
        //     headers: {
        //         'content-type': 'application/json',
        //         'authorization': 'Bearer ' + authTokens.access,
        //     },
        //     body: JSON.stringify({ticker})
        // })
        setActive(false)
    }

    return (
        <div style={{left: active ? "0" : "100%"}} className="w-full absolute z-50 h-full left-0 transition-all flex items-center justify-center">
            <div className="text-white font-mono bg-white bg-opacity-5 backdrop-blur-md w-1/5 h-1/6 rounded-xl grid grid-rows-[40%_60%]">
                <div className="flex items-center text-gray-400 px-4 text-2xl">
                    Add investment [{ticker}]
                </div>
                <form onSubmit={submitForm} className="grid grid-cols-2 relative">
                    <input className="p-4 text-2xl bg-black bg-opacity-10 focus:bg-opacity-20 transition-all" placeholder="Amount"/>
                    <div className="w-full pointer-events-none h-full absolute flex items-center justify-center text-4xl">
                        =
                    </div>
                    <div className="flex p-4 items-center justify-end text-2xl">
                        $143
                    </div>
                </form>
            </div>
        </div>
    )
}