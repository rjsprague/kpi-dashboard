"use client"
import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';

const useAuth = () => {
    const { auth: originalAuth, setAuth, logout, user, loading, handleLogin, updateUser } = useContext(AuthContext);

    let updatedAuth = originalAuth;

    // If auth.accessToken is undefined, try to get it from a cookie
    if (!originalAuth?.accessToken) {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            updatedAuth = { ...originalAuth, accessToken };
        }
    }

    // useDebugValue(auth, auth => auth?.accessToken ? "Logged In" : "Logged Out");

    return { auth: updatedAuth, setAuth, logout, user, loading, handleLogin, updateUser };
}

export default useAuth;
