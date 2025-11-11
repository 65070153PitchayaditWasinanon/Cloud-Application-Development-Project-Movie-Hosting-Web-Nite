// /frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/Nite_login.png";
import eye_open from "../assets/icons/eye-close-up.png";
import eye_close from "../assets/icons/eye.png";
import background from "../assets/images/background.png";

export default function LoginPage() {
    // safe navigate fallback
    let navigateFallback = null;
    try {
        navigateFallback = useNavigate();
    } catch (e) {
        navigateFallback = null;
    }

    const [identifier, setIdentifier] = useState(""); // Use State ของ Identifier (Username หรือ Email)
    const [password, setPassword] = useState(""); // Use State ของ รหัสผ่าน ในการ Login
    const [showPassword, setShowPassword] = useState(false); // Use state ของการแสดงรหัสผ่าน
    const [loading, setLoading] = useState(false); // Use state ของการโหลด
    const [error, setError] = useState(""); // Use state ของข้อความแสดงตอนผิดพลาด

    const apiBase = "http://localhost:5000"; //getApiBase();

    const togglePassword = () => { // สลับการแสดงรหัสผ่านจาก Show -> Hide และ Hide -> Show
        setShowPassword((s) => !s);
    };

    const handleSubmit = async (e) => { // ฟังก์ชันเมื่อกดปุ่ม Login
        e.preventDefault();
        setError("");
        if (!identifier.trim() || !password) { // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
            setError("กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน");   // แสดงข้อความผิดพลาดถ้ากรอกไม่ครบ
            return;
        }

        setLoading(true);  // ตั้งสถานะการโหลดเป็น true
        try {   // พยายามส่งข้อมูลไปยังเซิร์ฟเวอร์
            const res = await fetch(`${apiBase}/api/login`, {   // ยิง API ไปที่ localhost:5000/api/login
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: identifier.trim(), password }), // ส่งข้อมูลในรูปแบบ JSON
            });

            const data = await res.json(); // รอรับข้อมูลตอบกลับจากเซิร์ฟเวอร์ในรูปแบบ JSON

            if (!res.ok) {
                setError(data.message || "เกิดข้อผิดพลาดในการล็อกอิน"); // แสดงข้อความ Error ถ้า Login ไม่สำเร็จ
                setLoading(false);  // ตั้งสถานะการโหลดเป็น false
                return;
            }

            const { token, user } = data; // ดึง token และ user จากข้อมูลที่ได้รับมา
            if (!token) { // ตรวจสอบว่ามี token หรือไม่
                setError("เซิร์ฟเวอร์ตอบกลับมาไม่ถูกต้อง (ไม่มี token)"); // แสดงข้อความ Error ถ้าไม่มี token
                setLoading(false); // ตั้งสถานะการโหลดเป็น false
                return;
            }

            localStorage.setItem("authToken", token); // เก็บ token ใน localStorage
            localStorage.setItem("authUser", JSON.stringify(user)); // เก็บข้อมูล user ใน localStorage

            if (navigateFallback) {
                navigateFallback("/home"); // ใช้ react-router นำทางไปที่หน้า /home
            } else {
                window.location.href = "/"; // ถ้าไม่ได้ใช้ react-router ให้เปลี่ยนหน้าโดยใช้ window.location.href
            }
        } catch (err) {
            console.error(err); // แสดง Errorใน console
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"); // แสดงข้อความ Error ถ้าไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้
        } finally {
            setLoading(false); // ตั้งสถานะการโหลดเป็น false
        }
    };

    return (
        <div
            id="background"
            className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center filter brightness-80"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div
                id="container"
                className="w-1/3 max-w-lg rounded-2xl p-8"
                style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            >
                <form className="login_form" onSubmit={handleSubmit}>
                    <img
                        src={logo}
                        alt="Logo"
                        id="nite_logo"
                        className="w-72 mx-auto pb-8 block"
                    />

                    {error && (
                        <div className="mb-4 font-nunito text-center text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            id="input_bar_username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            type="text"
                            placeholder="ชื่อผู้ใช้ หรือ อีเมล"
                            className="w-full rounded-full px-8 py-3 font-noto font-semibold text-lg placeholder:font-notosans outline-none shadow-sm bg-white bg-opacity-75"
                            autoComplete="username"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <input
                            id="input_bar_password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                            className="w-full rounded-full px-8 py-3 font-noto font-semibold text-lg placeholder:font-notosans outline-none shadow-sm bg-white bg-opacity-75"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0 border-0 bg-transparent"
                            aria-label="Toggle Password"
                        >
                            <img
                                src={showPassword ? eye_open : eye_close}
                                alt="Toggle Password"
                                className="w-7 h-7"
                            />
                        </button>
                    </div>

                    <div id="login_button_area" className="flex justify-center items-center mt-3">
                        <button
                            id="login_button"
                            type="submit"
                            disabled={loading}
                            className="rounded-full px-8 py-3 text-2xl font-extrabold text-[#303750] bg-[#3D4979] focus:outline-none focus:bg-[#303750] focus:text-white transition disabled:opacity-60"
                        >
                            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
                        </button>
                    </div>
                </form>

                <div id="register_area" className="mt-6 flex justify-center items-center">
                    <p id="register_link" className="text-white font-noto font-semibold text-base">
                        ยังไม่มีบัญชีใช่ไหม?{" "}
                        <a id="register_a_link" href="/register" className="underline text-[#303750] hover:text-[#303750]">
                            สมัครที่นี้เลย
                        </a>
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center mt-3">
                <p id="sponsor_text" className="text-white font-nunito font-semibold text-2xl">
                    Powered by AWS
                </p>
            </div>
        </div>
    );
}
