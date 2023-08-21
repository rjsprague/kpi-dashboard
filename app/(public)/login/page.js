// app/login/login.js
"use client"
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../pages/api/axios';
import Link from 'next/link';
import useAuth from '../../hooks/useAuth';
import Cookies from 'js-cookie';
import useRefreshToken from '../../hooks/useRefreshToken';
import Image from 'next/image';


const LoginPage = () => {
    const public_base_url = process.env.NEXT_PUBLIC_BASE_URL

    const router = useRouter();
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setAuth } = useAuth();
    const refreshToken = useRefreshToken();

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            refreshToken().then((newToken) => {
                if (newToken) {
                    router.push('/kpi-dashboard');
                }
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/dashboard/auth',
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.token;
            Cookies.set('accessToken', accessToken, { expires: 7, secure: true });

            setAuth({ accessToken });
            setEmail('');
            setPassword('');

            const preLoginRoute = Cookies.get('preLoginRoute');

            console.log(preLoginRoute)

            if (preLoginRoute && preLoginRoute !== '/login') {
                router.push(preLoginRoute);
                Cookies.remove('preLoginRoute');
            } else {
                router.push('/kpi-dashboard');
            }
        } catch (err) {
            console.log('catch block', err);
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
            <section className='flex items-center justify-center min-h-screen px-4 bg-blue-900'>
                <div className='flex-col items-center p-8 text-blue-900 bg-white rounded shadow-super-3'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
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

                    <div className='flex items-center justify-between w-full mt-4 mb-4'>
                        <hr className='w-full' />
                        <span className='px-2 text-sm text-gray-500'>or</span>
                        <hr className='w-full' />
                    </div>
                    <Link
                        href={`https://podio.com/oauth/authorize?client_id=rei-ihi0fi&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/auth/podio/callback`}
                        className='flex flex-row items-center justify-center w-full gap-2 px-4 py-2 text-blue-900 bg-white border-2 border-blue-500 rounded hover:bg-gray-100'
                    >
                        <Image src="/podio.svg" alt="Podio Logo" width={20} height={20} />
                        Sign In with Podio
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default LoginPage;