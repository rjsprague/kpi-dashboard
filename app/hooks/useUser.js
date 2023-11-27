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

    const login = async (rawEmail, password) => {

        console.log(rawEmail)

        // sanitize email address
        const email = rawEmail.trim().toLowerCase();
        console.log("sanitizedEmail", email)

        const response = await axios.post('/api/auth/login',
            JSON.stringify({ email, password }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
                cache: 'no-store'
            }
        );
        const { exp } = jwt.decode(response.data.token);
        const expiryDate = new Date(exp * 1000);

        Cookies.set('token', response.data.token, { expires: expiryDate, path: '/' });
        Cookies.set('tokenExpiry', exp.toString(), { expires: expiryDate, path: '/' });

        setAuth({ token: response.data.token, tokenExpiry: exp });
        await fetchUser();

    };

    useEffect(() => {
        if (auth?.token) {
            fetchUser();
        }
    }, [auth.token]);

    return { user, loading, fetchUser, login };
};
