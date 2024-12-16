import {useNavigate} from "react-router-dom";


export const Footer = ({country}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full font-serif text-sm text-white text-opacity-20 hover:text-opacity-50 transition-all pt-12 h-1/6 bg-slate-900 px-12 flex justify-between">
            <div className="flex flex-col">
                <div onClick={() => navigate("/ranking")}  className="hover:underline hover:cursor-pointer">Country Rankings</div>
                <div onClick={() => navigate("/imfview/" + country)}  className="hover:underline hover:cursor-pointer">IMF View</div>
                <div onClick={() => navigate("/educationView/" + country)}  className="hover:underline hover:cursor-pointer">Education View</div>
            </div>
            <div className="flex flex-col items-end">
                <div onClick={() => navigate("/portfolio")} className="hover:underline hover:cursor-pointer">View Portfolio</div>
                <div onClick={() => navigate("/")} className="hover:underline hover:cursor-pointer">Dashboard</div>

            </div>
        </div>
    )
}