import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import './App.css';
import Home from './page/home/Home';
import { initializeApp } from "firebase/app";
import Login from './page/login/Login';
import Register from './page/register/Register';
import { AuthContext } from './context/AuthContext';

function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyAvBzF7whONy7kag_kGmgpYC6-jAP6e5tc",
    authDomain: "btalk-be914.firebaseapp.com",
    projectId: "btalk-be914",
    storageBucket: "btalk-be914.appspot.com",
    messagingSenderId: "330458551660",
    appId: "1:330458551660:web:adbe5392cf7dbe8604cf49"
  };

  const app = initializeApp(firebaseConfig);

  const {currentUser} = useContext(AuthContext);
  
  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  return (
    <div>
      {/* <Register /> */}
      {/* <Login /> */}
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    </div>
  );
}

export default App;
