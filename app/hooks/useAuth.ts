// useAuth.ts
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';

type Auth = {
    token?: string;
    tokenExpiry?: string;
};

type UseAuthReturn = {
    auth: Auth | null;
    setAuth: (auth: Auth) => void;
    logout: () => void;
    user: any;
    loading: boolean;
    handleLogin: (email: string, password: string) => Promise<void>;
    updateUser: (user: any) => void;
};

const useAuth = (): UseAuthReturn => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { auth: originalAuth, setAuth, logout, user, loading, handleLogin, updateUser } = context;

    let updatedAuth: Auth | null = originalAuth;

    // If auth.token is undefined, try to get it from a cookie
    if (!originalAuth?.token) {
        const token = Cookies.get('token');
        const tokenExpiry = Cookies.get('tokenExpiry');
        if (token) {
            updatedAuth = { ...originalAuth, token: token, tokenExpiry: tokenExpiry };
        }
    }

    return { auth: updatedAuth, setAuth, logout, user, loading, handleLogin, updateUser };
};

export default useAuth;
