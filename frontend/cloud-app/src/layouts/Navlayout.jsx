import React from 'react'
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Navlayout = () => {
    return (
        <div>
            <Navbar />
            <main className="overflow-y-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default Navlayout
