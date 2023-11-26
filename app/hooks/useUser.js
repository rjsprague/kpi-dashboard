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
        if (!auth.token) {
            setLoading(false);
            return;
        }

        try {
            // setLoading(true);
            const res = await fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`
                },
                cache: 'no-store'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // try {
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
            await fetchUser();
        // } catch (err) {
        //     // Handle error
        //     console.log(err.request.status)
        //     if (err.request?.status === 400) {
        //         throw new Error('Missing Username or Password');
        //     } else if (err.request?.status === 401) {
        //         throw new Error('Bad credentials');
        //     } else {
        //         throw new Error('Login Failed');
        //     }

        // }
    };

    useEffect(() => {
        if (auth?.token) {
            fetchUser();
        }
    }, [auth.token]);

    return { user, loading, fetchUser, login };
};
