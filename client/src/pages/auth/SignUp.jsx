import {useMousePosition} from "../../context/MousePositionProvider.jsx";
import {useRef} from "react";
import {BorderMarq} from "../../utils/BorderMarq.jsx";
import {HOST_AWS, PORT_AWS} from "../../backend.json";

export const SignUp = () => {
    const mousePos = useMousePosition();
    const usernameRef = useRef();
    const emailRef = useRef(null);
    const pwdRef = useRef();

    const onSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: pwdRef.current.value,
        }

        try {
            const response = await fetch(`https://${HOST_AWS}:${PORT_AWS}/auth/register`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json();

            if(response.ok) {
                console.log(data)
            }
        } catch (error) {
            console.log("Error registering user", error)
        }
    }

    return (
        <div className="w-full h-full bg-amber-50 overflow-hidden flex items-center justify-center">
            <div className="w-full h-auto">
                <BorderMarq displacement={mousePos.x}>Fin Wiz</BorderMarq>
            </div>
            <form onSubmit={onSubmit} className="w-1/3 absolute bg-black bg-opacity-5 backdrop-blur-xl shadow-sm grid grid-rows-[30%_23%_23%_24%] z-30 rounded-xl h-1/3 ">
                <div className="w-full h-full flex items-center pt-3 px-8 text-5xl font-serif ">
                    Sign up
                </div>
                <input ref={usernameRef} placeholder="Username" className="pl-8 placeholder:text-gray-500 placeholder:text-xl text-2xl w-full h-full transition-colors focus:bg-opacity-20 bg-black bg-opacity-0 focus:outline-none"></input>
                <input ref={emailRef} placeholder="Email" type="email" className="pl-8 placeholder:text-xl placeholder:text-gray-500 text-2xl w-full h-full transition-colors focus:bg-opacity-20 bg-black bg-opacity-0 focus:outline-none"></input>
                <input ref={pwdRef} placeholder="Password" type="password" className="pl-8 placeholder:text-xl rounded-b-xl placeholder:text-gray-500 text-2xl w-full h-full transition-colors focus:bg-opacity-20 bg-black bg-opacity-0 focus:outline-none"></input>
                <input type="submit" className="hidden"/>
            </form>
        </div>
    )
}