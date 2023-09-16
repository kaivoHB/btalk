import React, { useContext, useState } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { isMobileView } from "../context/View";
import logo from '../../src/img/logo.png'

function Navbar() {

    const [isButtonVisible, setButtonVisible] = useState(false);
    const {currentUser} = useContext(AuthContext);

    const handleClick = () => {
        setButtonVisible(!isButtonVisible);
    };

    return (
        <div className='navbar'>
            {/* <span>BTalk</span> */}
            <img className='nav-logoImg' src={logo} alt="" />
            <div className='user'>
                <img className='nav-img' src={currentUser.photoURL} alt={currentUser.displayName} onClick={handleClick}/>
                <span className='mobile'>{currentUser.displayName}</span>
                {/* <div className="user-dropdown">
                    <button className='nav-btn' onClick={()=>signOut(auth)}><i className="fa-solid fa-right-from-bracket"></i></button>
                    {!isMobileView ?  (
                        <button className='nav-btn' onClick={()=>signOut(auth)}>Logout</button>
                        ) : 
                        isButtonVisible && <button className='nav-btn' onClick={()=>signOut(auth)}>Logout</button>
                    }
                </div> */}
                
            </div>
        </div>
    )
}

export default Navbar