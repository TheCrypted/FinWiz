import {useMousePosition} from "../../context/MousePositionProvider.jsx";
import {BorderMarq} from "../../utils/BorderMarq.jsx";
import {useContext, useRef} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {HOST_AWS, PORT_AWS} from "../../backend.json";


export const SignIn = () => {
    const mousePos = useMousePosition();
    const usernameRef = useRef(null);
    const pwdRef = useRef(null);
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username: usernameRef.current.value,
            password: pwdRef.current.value,
        }


        try {
            const response = await fetch(`http://${HOST_AWS}:${PORT_AWS}/auth/login`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json();

            if (response.ok) {
                login(data);
                navigate("/")
            } else {
                alert("Authentication failed");
            }
        } catch (error) {
            console.log("Error signing in", error)
        }
    }

    return (
        <div className="w-full h-full overflow-hidden bg-amber-50 flex items-center justify-center">
            <div className="w-full h-auto">
                <BorderMarq displacement={mousePos.x}>Fin Wiz</BorderMarq>
            </div>
            <form onSubmit={onSubmit} className="w-1/3 absolute bg-black bg-opacity-5 backdrop-blur-xl shadow-sm grid grid-rows-[40%_30%_30%] z-30 rounded-xl h-1/4 ">
                <div className="w-full h-full flex items-center pt-3 px-8 text-5xl font-serif ">
                    Sign in
                </div>
                <input ref={usernameRef} placeholder="Username" className="pl-8 placeholder:text-xl placeholder:text-gray-500 text-2xl w-full h-full transition-colors focus:bg-opacity-20 bg-black bg-opacity-0 focus:outline-none"></input>
                <input ref={pwdRef} placeholder="Password" type="password" className="pl-8 placeholder:text-xl placeholder:text-gray-500 text-2xl w-full h-full rounded-b-xl transition-colors focus:bg-opacity-20 bg-black bg-opacity-0 focus:outline-none"></input>
                <input type="submit" className="hidden"/>
            </form>
        </div>
    )
}