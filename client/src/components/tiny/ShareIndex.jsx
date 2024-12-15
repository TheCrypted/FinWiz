
export const ShareIndex = ({text, value, pc, strength}) => {
    let color_set = {
        4: "#1e40af",
        3: "#2563eb",
        2: "#60a5fa",
        1: "#bfdbfe"
    }
    
    return (
        <div className="w-full text-slate-200 text-lg grid grid-cols-[10%_60%_30%] h-10">
            <div className="flex items-center justify-center">
                <div style={{backgroundColor: color_set[strength]}} className={`w-4 h-4 rounded-full`}/>
            </div>
            <div className=" flex items-center ">
                <b>{pc}</b> &nbsp; {text}
            </div>
            <div className="flex items-center justify-end font-bold w-full h-full">
                ${value}
            </div>
        </div>
    )
}