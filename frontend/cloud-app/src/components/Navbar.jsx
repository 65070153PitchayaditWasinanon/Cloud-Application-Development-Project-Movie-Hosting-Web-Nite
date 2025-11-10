import { NavLink, useSearchParams  } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../assets/Home.png"
import Search from "../assets/Search.png"
import logo from "../assets/logo.png"
import Gift from "../assets/Gift.png"
export default function Navbar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [text, setText] = useState(searchParams.get("q") || "");

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            const q = text.trim();
            if(q) setSearchParams({q});
            else setSearchParams({});
        }, 300);
        return () => clearTimeout(timeout);
    }, [text, setSearchParams])
    return (
        <nav className="px-4 py-4 bg-white grid grid-cols-3 items-center">

            <div className="flex flex-row space-x-8 justify-start">
                <div className="flex flex-row space-x-2 items-center ml-8">
                    <NavLink to="/" className="flex items-center gap-2 text-[#3D4979]">
                        <img src={Home} alt="Home" className="h-9 w-9" />
                        <span >Home</span>
                    </NavLink>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="
                         bg-gray-100 focus:outline-none text-gray-700 placeholder-gray-400
                        max-h-10"
                        onChange={(e)=>{setText(e.target.value)}}
                    />
                    <img src={Search} alt="search" className="w-6 h-6 text-gray-500" />
                </div>
            </div>


            <div className="flex justify-center">
                <img src={logo} alt="search" className="w-40 h-auto text-gray-500" />
            </div>


            <div className="flex flex-row space-x-8 justify-end pr-8">
                <div className="flex flex-row space-x-2 items-center ml-8">
                    <NavLink to="/promotion" className="flex items-center gap-2 text-[#3D4979]">
                        <img src={Gift} alt="Gift" className="h-8 w-8" />
                        <span >Promotion</span>
                    </NavLink>
                </div>

                <div className="flex items-center gap-2 border border-gray-400 rounded-3xl px-4 py-2 bg-white">
                    <select
                        className="bg-transparent focus:outline-none text-gray-700 cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" hidden>Adam Smith</option>
                        <option value="logout">Logout</option>
                    </select>
                </div>
            </div>


        </nav>

    );
}
