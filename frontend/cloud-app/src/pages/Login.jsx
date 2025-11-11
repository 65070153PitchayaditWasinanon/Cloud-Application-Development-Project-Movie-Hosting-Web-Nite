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

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Safe env detection: support Vite (import.meta.env) and CRA (process.env)
    const getApiBase = () => {
        try {
            // Vite
            if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
                return import.meta.env.VITE_API_URL;
            }
        } catch (e) {
            // ignore
        }
        try {
            // CRA / webpack (process may not exist in some setups)
            if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
                return process.env.REACT_APP_API_URL;
            }
        } catch (e) {
            // ignore
        }
        // fallback: relative path (same origin)
        return "";
    };

    const apiBase = "http://localhost:5000"; //getApiBase();

    const togglePassword = () => {
        setShowPassword((s) => !s);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!identifier.trim() || !password) {
            setError("กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: identifier.trim(), password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "เกิดข้อผิดพลาดในการล็อกอิน");
                setLoading(false);
                return;
            }

            const { token, user } = data;
            if (!token) {
                setError("เซิร์ฟเวอร์ตอบกลับมาไม่ถูกต้อง (ไม่มี token)");
                setLoading(false);
                return;
            }

            localStorage.setItem("authToken", token);
            localStorage.setItem("authUser", JSON.stringify(user));

            if (navigateFallback) {
                navigateFallback("/");
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setLoading(false);
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
                        <div className="mb-4 text-center text-red-600 font-medium">
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
