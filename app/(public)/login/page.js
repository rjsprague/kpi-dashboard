"use client"

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '../../hooks/useAuth';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useUser } from '../../hooks/useUser';
import { toast } from 'react-toastify';


export default function LoginPage() {

    const router = useRouter();
    const emailRef = useRef();
    const errRef = useRef();
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { auth } = useAuth();

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // validate email address
        if (!email) {
            toast.error('Please enter your email address.', {
                position: toast.POSITION.TOP_CENTER,
            });
            return;
        }

        // validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.', {
                position: toast.POSITION.TOP_CENTER,
            });
            return;
        }

        try {
            await login(email, password);

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
            if (err.request?.status === 400) {
                setErrMsg('Bad Credentials.');
            } else if (err.request?.status === 401) {
                setErrMsg('Bad credentials.');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
        setSubmitting(false);
    }

    // if auth has a token and the token has not expired, redirect to dashboard
    useEffect(() => {
        if (auth && auth.token && Number(auth.tokenExpiry) * 1000 > Date.now()) {
            router.push('/kpi-dashboard');
        }
    }, [auth])

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
                            autoComplete="on"
                            onChange={(e) => setEmail((e.target.value))}
                            value={email}
                            required
                            className='w-full p-2 text-black border border-gray-300 rounded'
                        />
                        <label htmlFor="password" className='block text-sm font-medium'>Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            className='w-full p-2 text-black border border-gray-300 rounded'
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className='text-sm text-blue-500'>
                            {showPassword ? 'Hide' : 'Show'} Password
                        </button>
                        <button type="submit" className='w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>{!submitting ? "Sign In" : "Logging in..." }</button>
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