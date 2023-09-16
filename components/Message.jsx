import React, { useContext, useEffect, useRef } from "react";
import { collection, query, where, orderBy, doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { format } from 'date-fns';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { toast } from 'wc-toast';
import { FirebaseError } from "firebase/app";
import { async } from "@firebase/util";
import { useState } from "react";

function Message({message}) {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const ref = useRef();

    // useEffect(() => {
    //     ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // }, [message]);

    const handleDelete = async () => {
        try {
            const chatRef = doc(db, 'chats', data.chatId);
            const chatSnapshot = await getDoc(chatRef);
    
            if (chatSnapshot.exists()) {
                if (window.confirm("Are you sure you want to delete this message?")) {
                    const chatData = chatSnapshot.data(); // Access the document data
                    const messagesArray = chatData.messages || []; // Access the messages array or initialize as an empty array
                    const updatedMessages = messagesArray.filter(mess => mess.id !== message.id);
                    await updateDoc(chatRef, { messages: updatedMessages });
                    toast.success('Message deleted', { type: 'success' });
                }
            } else {
                console.log('Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <wc-toast></wc-toast>
            <div className="messageInfo">
                <img className="message-imgInfo" src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
            </div>
            <div className="messageContent">
                {message.text && <p>{message.text}</p>}
                {message.img && <img className="message-imgContent" src={message.img} alt="" />}
                <div className="message-edit">
                    <span className="hover-span me-3">{format(message.date.seconds * 1000 + message.date.nanoseconds / 1000000, 'dd/MM HH:mm')}</span>
                    <i className="fa-regular fa-trash-can hover-span" onClick={handleDelete}></i>
                </div>
            </div>
        </div>
    )
}

export default Message