import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from 'wc-toast';
import logo from '../../img/logo.png'

function Login() {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
    
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/")
        } catch (err) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className='formContainer'>
            <wc-toast />
            <div className='formWrapper'>
                {/* <span className="logo">BTalk</span> */}
                <img className="logo-img" src={logo} alt="" />
                <span className="title">Login</span>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type='email' placeholder='email'/>
                    <input type='password' placeholder='password'/>
                    <button className="login-btn">Sign in</button>
                </form>
                <p>You don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login