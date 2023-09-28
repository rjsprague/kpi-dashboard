"use client"

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../pages/api/axios';
import Link from 'next/link';
import useAuth from '../../hooks/useAuth';
import Image from 'next/image';
import Cookies from 'js-cookie';

export default function LoginPage() {

    const router = useRouter();
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setAuth } = useAuth();

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/login',
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response && response.data && response.data.token && response.data.token;
            Cookies.set('accessToken', accessToken, { expires: 7, path: '/' });
            setAuth({ accessToken });
            setEmail('');
            setPassword('');

            const preLoginRoute = Cookies.get('preLoginRoute');

            if (preLoginRoute && preLoginRoute !== '/login') {
                router.push(preLoginRoute);
                Cookies.remove('preLoginRoute');
            } else {
                router.push('/kpi-dashboard');
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <main>
            <section className='flex flex-col items-center justify-center min-h-screen gap-8 px-4 bg-blue-900'>
                <Image src="/login-logo.svg" alt="Logo" width={600} height={150} priority />
                <div className='flex-col items-center p-8 mt-4 text-blue-900 bg-white rounded lg:mt-10 shadow-super-3'>
                    <p ref={errRef} className={` ${errMsg ? "errmsg px-4 text-center font-semibold uppercase border text-blue-900 border-red-600 rounded-full bg-red-300" : "offscreen"}`} aria-live="assertive">{errMsg}</p>
                    <h1 className='mb-6 text-2xl'>Sign In</h1>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <label htmlFor="email" className='block text-sm font-medium'>Email:</label>
                        <input
                            type="text"
                            id="email"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            className='w-full p-2 text-black border border-gray-300 rounded'
                        />
                        <label htmlFor="password" className='block text-sm font-medium'>Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            className='w-full p-2 text-black border border-gray-300 rounded'
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className='text-sm text-blue-500'>
                            {showPassword ? 'Hide' : 'Show'} Password
                        </button>
                        <button type="submit" className='w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>Sign In</button>
                    </form>

                    <Link
                        href={`https://podio.com/oauth/authorize?client_id=rei-ihi0fi&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/auth/podio/callback`}
                        className='flex flex-row items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-blue-900 bg-white border-2 border-blue-500 rounded hover:bg-gray-100'
                    >
                        <Image src="/podio.svg" alt="Podio Logo" width={20} height={20} />
                        Sign In with Podio
                    </Link>

                    <Link
                        href={'/forgotPassword'}
                        className="flex justify-end mt-2 text-right text-blue-900"
                    >
                        Forgot Password?
                    </Link>
                </div>
            </section>
        </main>
    )
}