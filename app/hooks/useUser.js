// hooks/useUser.js
"use client"
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import useAuth from './useAuth';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth, setAuth } = useAuth();
    // console.log("useUser auth", auth)

    const fetchUser = async () => {
        setLoading(true);
        const res = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            cache: 'no-store'
        });
        const data = await res.json();
        // console.log("useUser fetchUser", data)
        setUser(data);
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login',
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    cache: 'no-store'
                }
            );
            const { exp } = jwt.decode(response.data.token);
            // console.log("useUser login expiry", exp)
            const expiryDate = new Date(exp * 1000);
            // console.log("useUser login expiryDate", expiryDate)

            Cookies.set('token', response.data.token, { expires: expiryDate, path: '/' });
            Cookies.set('tokenExpiry', exp.toString(), { expires: expiryDate, path: '/' });

            setAuth({ token: response.data.token, tokenExpiry: exp });
            fetchUser();
        } catch (err) {
            // Handle error
            console.log(err)
        }
    };

    useEffect(() => {
        if (auth?.token) {
            fetchUser();
        }
    }, []);

    return { user, loading, fetchUser, login };
};
