import React, { useContext, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc, } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { isMobileView } from "../context/View";
import { toast } from 'wc-toast';

function Search() {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [isSearchVisible, setSearchVisible] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearchIconClick = () => {
        setSearchVisible(!isSearchVisible);
        setUsername("");
    };

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("displayName", "==", username));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
                console.log(doc.data());
            });
        } catch (err) {
            setErr(true);
            toast.error('User not found!');
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };
    
    const handleSelect = async () => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));
            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });
        
                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedId + ".userInfo"]: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
                });
    
                await updateDoc(doc(db, "userChats", user.uid), {
                [combinedId + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) {
            console.log('Something went wrong', err);
        }
        setUser(null);
        setUsername("")
    };

    return (
        <div className='search'>
            <wc-toast />
            {isSearchVisible && (<div className="searchWrapper" />)}
            <div className="searchForm">
            {isMobileView ? (
                <div className="searchIcon text-center">
                    <i className="fa-solid fa-magnifying-glass fa-2xl"  onClick={handleSearchIconClick}/>
                    {isSearchVisible && (
                        <input className="search-inpt" type="text" placeholder='Find a user' onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} value={username}/>
                    )}
                </div>
            ) : (
                <input className="search-inpt" type="text" placeholder='Find a user' onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} value={username}/>
                
            )}
            </div>
            {err && <span>User not found!</span>}
            {user && (
                isMobileView ? (
                    isSearchVisible && (
                    <div className="userChat-mobile" onClick={handleSelect}>
                        <img className="search-img" src={user.photoURL} alt="" />
                        <div className="userChatInfo">
                            <span>{user.displayName}</span>
                        </div>
                    </div>)
                ) :  (
                    <div className="userChat" onClick={handleSelect}>
                        <img className="search-img" src={user.photoURL} alt="" />
                        <div className="userChatInfo">
                            <span className="mobile">{user.displayName}</span>
                        </div>
                    </div>)
                )
            }
        </div>
    )
}

export default Search