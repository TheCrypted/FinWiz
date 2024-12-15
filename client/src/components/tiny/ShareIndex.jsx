
export const ShareIndex = ({text, value, pc, strength}) => {
    return (
        <div className="w-full text-slate-200 text-lg grid grid-cols-[10%_60%_30%] h-10">
            <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full bg-blue-${strength * 200}`}/>
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