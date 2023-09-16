import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

import Login from './page/login/Login'
import Register from './page/register/Register'
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';

const container = document.getElementById('root');
const root = createRoot(container);
const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/register', element: <Register />},
  {path: '/login', element: <Login />},
])

root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);

reportWebVitals();
