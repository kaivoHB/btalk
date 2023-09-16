import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Tạo Context cho xác thực
export const AuthContext = createContext();

// Component cung cấp Context
export const AuthContextProvider = ({ children }) => {
    // Trạng thái lưu trữ người dùng hiện tại
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        // Theo dõi sự thay đổi trong trạng thái xác thực
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        // Hủy theo dõi khi unmount
        return () => {
            unsub();
        };
    }, []);

    return (
        // Cung cấp dữ liệu người dùng hiện tại thông qua Context
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
