// hooks/useUser.js
"use client"
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessTokenCookie = Cookies.get('accessToken');

  const fetchUser = async () => {
    setLoading(true);
    const res = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessTokenCookie}`
      },
      cache: 'no-store'
    });
    const data = await res.json();
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
      const accessToken = response.data.token;
      Cookies.set('accessToken', accessToken, { expires: 7, path: '/' });
      fetchUser();
    } catch (err) {
      // Handle error
      console.log(err)
    }
  };

  useEffect(() => {
    if (accessTokenCookie) {
      fetchUser();
    }
  }, []);

  return { user, loading, fetchUser, login };
};
