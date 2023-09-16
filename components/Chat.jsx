import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { auth } from '../firebase';
import {signOut} from "firebase/auth"
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from '../context/AuthContext'
import logo from '../../src/img/logo.png'

function Chat() {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    return (
        <div className='chat'>
            <div className="chatInfo">
                {/* <img className='chatInfo-logoImg' src={logo} alt="BTalk" /> */}
                <span>{data.user?.displayName === currentUser.displayName ? 'My cloud' : data.user?.displayName}</span>
                <div className="chatIcons">
                    <i className="fa-solid fa-right-from-bracket" onClick={()=>signOut(auth)}></i>
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    )
}

export default Chat