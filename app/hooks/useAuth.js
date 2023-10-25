"use client"
import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';

const useAuth = () => {
    const { auth: originalAuth, setAuth, logout, user, loading, handleLogin, updateUser } = useContext(AuthContext);

    let updatedAuth = originalAuth;

    // If auth.token is undefined, try to get it from a cookie
    if (!originalAuth?.token) {
        const token = Cookies.get('token');
        const tokenExpiry = Cookies.get('tokenExpiry');
        // console.log('token', token, 'tokenExpiry', tokenExpiry)
        if (token) {
            updatedAuth = { ...originalAuth, token: token, tokenExpiry: tokenExpiry };
        }
    }

    // useDebugValue(auth, auth => auth?.token ? "Logged In" : "Logged Out");

    return { auth: updatedAuth, setAuth, logout, user, loading, handleLogin, updateUser };
}

export default useAuth;
