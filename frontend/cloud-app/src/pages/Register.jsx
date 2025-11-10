import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ถ้าใช้ react-router
import logo from "../assets/images/Nite_Register.png";
import eye_close from "../assets/icons/eye-close-up.png";
import eye_open from "../assets/icons/eye.png";
import background from "../assets/images/background.png";

export default function RegisterPage() {
    const apiBase = "http://localhost:5000"; //getApiBase();

    const navigate = useNavigate?.() || null; // ถ้าไม่ได้ใช้ react-router, ใช้ window.location
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const togglePassword = () => setShowPassword((s) => !s);

    const handleChange = (e) => {
        const { id, value } = e.target;
        // id values: input_bar_username, input_bar_email, input_bar_password
        if (id === "input_bar_username") setForm((p) => ({ ...p, username: value }));
        if (id === "input_bar_email") setForm((p) => ({ ...p, email: value }));
        if (id === "input_bar_password") setForm((p) => ({ ...p, password: value }));
    };

    const validate = () => {
        setErrorMsg("");
        const { username, email, password } = form;
        if (!username.trim()) return "กรุณากรอกชื่อผู้ใช้";
        if (!email.trim()) return "กรุณากรอกอีเมลล์";
        // simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "รูปแบบอีเมลล์ไม่ถูกต้อง";
        if (!password) return "กรุณากรอกรหัสผ่าน";
        if (password.length < 6) return "รหัสผ่านอย่างน้อย 6 ตัวอักษร";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setErrorMsg(v);
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            // หาก backend อยู่ต่าง origin: set FULL URL เช่น `${process.env.REACT_APP_API_URL}/api/register`
            const res = await fetch(`${apiBase}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                // server.js ส่ง status 400 หรือ 500 พร้อม message
                setErrorMsg(data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
            } else {
                // สำเร็จ (server.js คืน 201 กับ user info)
                setSuccessMsg("สมัครสมาชิกสำเร็จ — ไปยังหน้าเข้าสู่ระบบในไม่กี่วินาที");
                // ตัวอย่าง: รอสักครู่ให้ผู้ใช้เห็นข้อความ (หรือเปลี่ยนเป็นโอนย้ายทันที)
                setTimeout(() => {
                    if (navigate) navigate("/login");
                    else window.location.href = "/login";
                }, 900);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้ โปรดลองอีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            id="background"
            className="min-h-screen flex flex-col justify-center items-center p-4"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.8)"
            }}
        >
            <div id="container" className="w-full max-w-xl bg-white/25 rounded-2xl p-8 md:p-10">
                <form className="register_form" onSubmit={handleSubmit} noValidate>
                    <img src={logo} alt="Logo" id="nite_register" className="w-72 mx-auto pb-6 block" />

                    <div className="mb-4">
                        <input
                            id="input_bar_username"
                            type="text"
                            placeholder="ชื่อผู้ใช้"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-full px-8 py-3 font-noto font-semibold text-lg placeholder:font-notosans outline-none shadow-sm bg-white bg-opacity-75"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            id="input_bar_email"
                            type="email"
                            placeholder="อีเมลล์"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-full px-8 py-3 font-noto font-semibold text-lg placeholder:font-notosans outline-none shadow-sm bg-white bg-opacity-75"
                        />
                    </div>

                    <div className="mb-4 relative">
                        <input
                            id="input_bar_password"
                            type={showPassword ? "text" : "password"}
                            placeholder="รหัสผ่าน"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-full px-8 py-3 font-noto font-semibold text-lg placeholder:font-notosans outline-none shadow-sm bg-white bg-opacity-75"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            aria-label="Toggle password visibility"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0"
                        >
                            <img src={showPassword ? eye_open : eye_close} alt="Toggle" className="w-8 h-8" />
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-2 text-center text-red-600 font-medium">{errorMsg}</div>
                    )}
                    {successMsg && (
                        <div className="mb-2 text-center text-green-700 font-medium">{successMsg}</div>
                    )}

                    <div id="login_button_area" className="flex justify-center items-center mt-3">
                        <button
                            id="register_button"
                            type="submit"
                            disabled={loading}
                            className="rounded-[30px] px-10 py-3 text-2xl font-nunito! font-extrabold text-[#303750] bg-[#3D4979] focus:outline-none focus:bg-[#303750] focus:text-white transition disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>

                <div id="login_area" className="mt-6 flex justify-center items-center">
                    <p id="login_link" className="text-white font-noto! font-semibold text-base">
                        มีบัญชีอยู่แล้ว?{" "}
                        <a id="login_a_link" href="/login" className="font-noto! underline text-[#303750]! hover:text-[#303750]">
                            ไปเข้าสู่ระบบกัน!
                        </a>
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center mt-4">
                <p id="sponsor_text" className="text-white font-nunito font-semibold text-2xl">
                    Powered by AWS
                </p>
            </div>
        </div>
    );
}
