import React,{ useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { toast } from 'wc-toast';
import './Register.css'
import logo from '../../img/logo.png'

function Register() {

    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        if (!file) {
            setLoading(false);
            toast.error('Please upload an image.');
            return;
        }

        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);
            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        setImageUploaded(true);
                        //Update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        //create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
        
                        //create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    } catch (err) {
                        console.log(err);
                        setErr(true);
                        setLoading(false);
                        toast.error('Something went wrong');
                    }
                });
            });
        } catch (err) {
            setErr(true);
            setLoading(false);
            toast.error('This account already exists');
        }
    };

    return (
        <div className='formContainer'>
            <wc-toast></wc-toast>
            <div className='formWrapper'>
                {/* <span className="logo">BTalk</span> */}
                <img className="logo-img" src={logo} alt="" />
                <span className="title">Register</span>
                <form method='post' onSubmit={(e) => handleSubmit(e)}>
                    <input type='text' placeholder='display name' required/>
                    <input type='email' placeholder='email' required/>
                    <input type='password' placeholder='password' required/>
                    <input type='file' id='file' style={{display: 'none'}}/>
                    <label htmlFor="file" className='mt-3 mb-3'>
                        {/* { setImgPreview ? <img src={imgPreview}></img> : <i className="fa-regular fa-images fa-lg"></i> } */}
                        <i className="fa-regular fa-images fa-lg"></i>
                        <span>Add your avatar</span>
                    </label>
                    <button className='register-btn' disabled={loading}>Sign up</button>
                    {loading && <span className='text-primary'>Uploading image</span>}
                    {/* {err && <span className='text-danger'>Something went wrong</span>} */}
                </form>
                <p>You do have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Register