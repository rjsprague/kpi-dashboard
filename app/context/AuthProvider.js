"use client"
import { createContext, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
    auth: {},
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }) => {
    const { user, loading, fetchUser, login } = useUser();
    const [auth, setAuth] = useState({});
    const router = useRouter();

    const handleLogin = async (email, password) => {
        await login(email, password);
        console.log(user)
    };

    const logout = async () => {
        try {
            // Navigate to login page and wait for it to complete
            router.push('/login');

            // After successful navigation, perform the cleanup
            Cookies.remove('token');
            setAuth({ token: null });
            fetchUser(); // To re-fetch and set user to null
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    const updateUser = () => {
        fetchUser();
    };

    const refreshToken = async () => {
        try {
            const res = await fetch(`api/auth/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.refreshToken}`,
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                Cookies.set('token', data.token);
                setAuth({ ...auth, token: data.token });
            } else {
                // Open login modal here
                
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Open login modal here

        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, user, loading, handleLogin, logout, updateUser, refreshToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
