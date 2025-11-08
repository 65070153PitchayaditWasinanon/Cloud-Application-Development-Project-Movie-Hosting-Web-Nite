import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navlayout from "./layouts/Navlayout.jsx"
import Authlayout from "./layouts/Authlayout.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home.jsx'
import Payment from './pages/Payment.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
    <Routes>
      <Route element={<Navlayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      <Route element={<Authlayout />}>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Route>

    </Routes>
  </BrowserRouter>
)
