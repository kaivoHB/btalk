import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from 'wc-toast';

function Input() {

    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    // Function to handle file input change
    const handleFileChange = (e) => {
        const selectedImage = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setImgPreview(event.target.result);
        };
        reader.readAsDataURL(selectedImage);
        setImg(selectedImage);
    };

    const handleSend = async () => {
            try {
                if (img) {
                    if (data.chatId === 'null') {
                        toast.warn('Choose someone to chat');
                        return;
                    }
                    const uniqueFileName = uuid() + "_" + img.name;
                    const storageRef = ref(storage, uniqueFileName);
                    const uploadTask = uploadBytesResumable(storageRef, img);
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            // switch (snapshot.state) {
                            //     case 'paused':
                            //     console.log('Upload is paused');
                            //     break;
                            //     case 'running':
                            //     console.log('Upload is running');
                            //     break;
                            // }
                        }, 
                        (error) => {
                            toast.error('Something went wrong');
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                await updateDoc(doc(db, "chats", data.chatId), {
                                    messages: arrayUnion({
                                        id: uuid(),
                                        text,
                                        senderId: currentUser.uid,
                                        date: Timestamp.now(),
                                        img: downloadURL,
                                }),
                            });
                        });
                    });
                } else {
                    if (!text) {
                        toast.error('Please enter a message.');
                        return; 
                    } else {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                            }),
                        });
                    }
                }
                    await updateDoc(doc(db, "userChats", currentUser.uid), {
                        [data.chatId + ".lastMessage"]: {
                            text,
                        },
                        [data.chatId + ".date"]: serverTimestamp(),
                    });
                
                    await updateDoc(doc(db, "userChats", data.user.uid), {
                        [data.chatId + ".lastMessage"]: {
                            text,
                        },
                        [data.chatId + ".date"]: serverTimestamp(),
                    });
                setText("");
                setImg(null);
                setImgPreview(null);
            } catch (error) {
                toast.error('Choose someone to chat')
            }
    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSend();
    };

    return (
        <div className='input'>
            <wc-toast></wc-toast>
            <input className="input-inpt" type="text" placeholder='Type sonething...' onKeyDown={handleKey} onChange={(e) => setText(e.target.value)} value={text}/>
            <div className="send">
                {/* <input type="file" id="file" style={{display: 'none'}} onChange={(e) => setImg(e.target.files[0])}/> */}
                <input type="file" id="file" style={{ display: 'none' }} onChange={handleFileChange} />
                <label htmlFor="file">
                    {!imgPreview ? <i className="fa-regular fa-images fa-2xl"></i> : <img className="send-imgPreview" src={imgPreview} alt="Selected Image" />}
                </label>
                <button className="send-btn" onClick={handleSend}>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </div>
        </div>
    )
}

export default Input