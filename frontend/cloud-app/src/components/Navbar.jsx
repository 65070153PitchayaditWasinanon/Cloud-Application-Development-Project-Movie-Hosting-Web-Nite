import { NavLink } from "react-router-dom";
import Home from "../assets/Home.png"
import Search from "../assets/Search.png"
import logo from "../assets/logo.png"
import Gift from "../assets/Gift.png"
export default function Navbar() {
    return (
        <nav className="px-4 py-6 bg-white shadow flex flex-row">
            <div className="flex flex-1 flex-row space-x-2 items-center ml-8">
                <NavLink to="/" className="mr-4 text-[#3D4979]" ><img src={Home} alt="" className="w-8" /></NavLink>
                <NavLink to="/" className="mr-4 text-[#3D4979]" >Home</NavLink>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="
                        flex-1 bg-gray-100 focus:outline-none text-gray-700 placeholder-gray-400
                        max-h-10"
                />
                <img src={Search} alt="search" className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex flex-1">
                <img src={logo} alt="search" className="w-50 h-auto text-gray-500" />
            </div>
            <div className="flex flex-1 flex-row space-x-2 items-center ml-8">
                <NavLink to="/promotion" className="mr-4 text-[#3D4979]" ><img src={Gift} alt="" className="w-8" /></NavLink>
                <NavLink to="/promotion" className="mr-4 text-[#3D4979]" >Promotion</NavLink>
            </div>

            <div className="flex flex-1 flex-row space-x-2 items-center ml-8">
                <NavLink to="/promotion" className="mr-4 text-[#3D4979]" ><img src={Gift} alt="" className="w-8" /></NavLink>
                <NavLink to="/promotion" className="mr-4 text-[#3D4979]" >Promotion</NavLink>
            </div>
        </nav>
    );
}
