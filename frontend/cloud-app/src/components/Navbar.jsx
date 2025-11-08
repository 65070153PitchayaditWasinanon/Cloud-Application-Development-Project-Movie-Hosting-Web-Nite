import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="px-4 py-3 bg-white shadow">
            <NavLink to="/" className="mr-4" >Home</NavLink>
        </nav>
    );
}
