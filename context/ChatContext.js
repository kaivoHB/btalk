import { createContext, useContext, useReducer } from "react";
// import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";

// Tạo Context cho trò chuyện
export const ChatContext = createContext();

// Component cung cấp Context
export const ChatContextProvider = ({ children }) => {
    // Lấy thông tin người dùng hiện tại từ Context xác thực
    const { currentUser } = useContext(AuthContext);

    // Trạng thái ban đầu cho Context trò chuyện
    const INITIAL_STATE = {
        chatId: "null",
        user: {},
    };

    // Reducer cho trạng thái trò chuyện
    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            default:
                return state;
        }
    };

    // Sử dụng useReducer để quản lý trạng thái Context
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        // Cung cấp dữ liệu và hàm dispatch thông qua Context
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};
