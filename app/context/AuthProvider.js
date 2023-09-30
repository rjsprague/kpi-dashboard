"use client"
import { createContext, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user, loading, fetchUser, login } = useUser();
    const [auth, setAuth] = useState({});
    const router = useRouter();

    const handleLogin = async (email, password) => {
        await login(email, password);
        setAuth({ user, loading });
    };

    const logout = async () => {
        try {
            // Navigate to login page and wait for it to complete
            router.push('/login');

            // After successful navigation, perform the cleanup
            Cookies.remove('accessToken');
            setAuth({ accessToken: null });
            fetchUser(); // To re-fetch and set user to null
            console.log('User logged out')
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };



    const updateUser = (newUserData) => {
        fetchUser();
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, user, loading, handleLogin, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
