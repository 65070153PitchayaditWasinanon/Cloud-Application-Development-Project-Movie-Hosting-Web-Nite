import React, { useState } from "react";
import logo from "../assets/images/Nite_Register.png";
import eye_close from "../assets/icons/eye-close-up.png";
import eye_open from "../assets/icons/eye.png";
import "../styles/register.css";


export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div id="background">
            <div className="container" id="container">
                <form className="register_form">
                    <img src={logo} alt="Logo" className="logo" id="nite_register" />
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="ชื่อผู้ใช้" id="input_bar_username" />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="อีเมลล์" id="input_bar_email" />
                    </div>
                    <div className="mb-3 position-relative">
                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="รหัสผ่าน" id="input_bar_password" />
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                            onClick={togglePassword}
                            style={{ border: "none", background: "transparent" }}
                        >
                            <img
                                src={showPassword ? eye_open : eye_close}
                                alt="Toggle Password"
                                className="eye-icon"
                                width="30" height="30"
                            />
                        </button>
                    </div>
                    <div id="login_button_area" className="d-flex justify-content-center align-items-center">
                        <button className="btn centered-text" id="register_button">Register</button>
                    </div>
                </form>
                <div className="register_if_not d-flex justify-content-center align-items-center" id="login_area">
                    <p className="login_link text-white" id="login_link">มีบัญชีอยู่แล้ว? <a href="/" id="login_a_link">ไปเข้าสู่ระบบกัน!</a></p>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
                <p id="sponsor_text">Powered by AWS</p>
            </div>
        </div>
    );
};