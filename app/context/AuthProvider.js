// AuthProvider.js
"use client"
import { createContext, useState, useEffect } from 'react';
import axios from '../../pages/api/axios'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    // when the component mounts, try to refresh the access token
    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const response = await axios.get('/dashboard/auth/refresh', {
                    withCredentials: true
                });
                setAuth({ accessToken: response.data.accessToken });
            } catch (err) {
                // handle error
            }
        };

        refreshAccessToken();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
