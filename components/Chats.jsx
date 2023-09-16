import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import cloud from '../img/cloud.png'

function Chats() {

    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = (u) =>  {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    // console.log(Object.entries(chats));

    return (
        <div className='chats'>
            {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
                <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                    {chat[1].userInfo?.photoURL === currentUser?.photoURL ? <i className="fa-solid fa-cloud fa-2xl pt-3 pb-3"></i> : <img className="chats-img" src={chat[1].userInfo?.photoURL} alt={chat[1].userInfo?.displayName} title={chat[1].userInfo?.displayName} />}
                    <div className="userChatInfo mobile">
                        <span>{chat[1].userInfo?.displayName === currentUser?.displayName ? 'Cloud' : chat[1].userInfo?.displayName}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats