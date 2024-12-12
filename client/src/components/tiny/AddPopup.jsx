import {useContext, useEffect, useRef, useState} from "react";
import DatePicker from "react-date-picker";
import {AuthContext} from "../../context/AuthContext.jsx";

export const AddPopup = ({ticker, active, setActive}) => {
    const [price, setPrice] = useState(0);
    const volumeRef = useRef(null);
    const basePrice = useRef(0);
    const [date, onChange] = useState(new Date());
    const { authTokens } = useContext(AuthContext);

    const updatePrice = (e) => {
        setPrice((parseFloat(volumeRef.current.value || "1") * basePrice.current).toFixed(2))
    }

    useEffect(() => {
        fetch(`http://localhost:3000/portfolio/equity/${ticker}?expected=1`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => res.equities[0])
            .then(res => basePrice.current = parseFloat(res.open))
            .catch(e => console.log(e));
    }, [ticker]);

    const submitForm = (e) => {
        e.preventDefault()
        const token = authTokens.access;
        fetch("http://localhost:3000/portfolio/investment", {
            method: "POST",
            headers: {
                'authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({date, amount: parseFloat(volumeRef.current.value || "1"), ticker}),
        }).then(res => res.json()
            .then(res => console.log(res.message)))
            .catch(e => console.log(e.message));
        setActive(false)

    }

    return (
        <div onClick={() => setActive(false)} style={{left: active ? "0" : "100%"}} className="w-full absolute shadow-xl bg-black bg-opacity-5 z-50 h-full left-0 transition-all flex items-center justify-center">
            <div onClick={e => e.stopPropagation()} className="text-white font-mono bg-white bg-opacity-5 backdrop-blur-md w-1/5 h-1/4 rounded-xl grid grid-rows-[40%_60%]">
                <div className="flex items-center text-gray-400 px-4 text-2xl">
                    Add investment [{ticker}]
                </div>
                <form onSubmit={submitForm} className="grid grid-cols-2 grid-rows-2 relative">
                    <input ref={volumeRef} type="number" step="any" onChange={updatePrice}
                           className="p-4 text-2xl border-b border-black bg-black bg-opacity-10 focus:bg-opacity-20 transition-all"
                           placeholder="Amount"/>
                    <div
                        className="w-full pointer-events-none h-1/2 absolute flex items-center justify-center text-4xl">
                        =
                    </div>
                    <div className="flex border-b border-black p-4 items-center justify-end text-2xl">
                        ${price}
                    </div>
                    <DatePicker onChange={onChange} clearIcon={null} maxDate={new Date()} calendarIcon={null} value={date} open={false} shouldOpenCalendar={() => false} className="w-full text-2xl flex  items-center justify-center h-full col-span-2"/>
                    <button type="submit" className="hidden" />
                </form>
            </div>
        </div>
    )
}