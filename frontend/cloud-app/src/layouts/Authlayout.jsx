import React from 'react'
import { Outlet } from "react-router-dom";
// layout เอาไว้ใช้กับหน้าที่ไม่อยากให้มี navbar
const Authlayout = () => {
    return (
        <div>
            <main className="">
                <Outlet />
            </main>
        </div>
    )
}

export default Authlayout
