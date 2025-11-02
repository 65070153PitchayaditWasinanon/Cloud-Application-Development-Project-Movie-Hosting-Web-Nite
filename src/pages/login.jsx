import React from "react";
import logo from "../assets/images/Nite_login.png";
import bg from "../assets/images/background.png";


export default function LoginPage() {
    return (
        <div style={styles.background}>
            <div className="container" style={styles.container}>
                <form className="login_form">
                    <img src={logo} alt="Logo" className="logo" style={styles.nite_logo} />
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="ชื่อผู้ใช้" style={styles.input_bar} />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" placeholder="รหัสผ่าน" style={styles.input_bar} />
                    </div>
                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    background: {
        backgroundImage: `url(${bg})`,
        filter: 'brightness(80%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    },
    container: {
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        padding: '20px 30px 30px 30px',
        borderRadius: '30px',
    },
    nite_logo: {
        width: '300px',
        padding: '0px 30px 30px 30px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    input_bar: {
        borderRadius: '20px',
        padding: '10px 20px 10px 20px',
    },

};