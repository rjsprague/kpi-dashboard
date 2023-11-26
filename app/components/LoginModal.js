"use client"
import { Dialog } from '@headlessui/react';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';

export default function LoginModal({ isOpen, onClose }) {
    const router = useRouter();
    // set current path to redirect to after login
    const currentPath = usePathname();
    const emailRef = useRef();
    const errRef = useRef();
    const { login, fetchUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isLoggingOut } = useAuth();

    // console.log(isLoggingOut)
    
    useEffect(() => {
        if (isOpen && emailRef.current) {
            emailRef.current.focus();
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);

            Cookies.set('preLoginRoute', currentPath)
            setEmail('');
            setPassword('');
            router.refresh();
            onClose();
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Invalid Username or Password');
            } else {
                setErrMsg('Something went wrong');
            }
            errRef.current.focus();
        }
    };

    const handlePodioSignIn = () => {
        const podioAuthUrl = `https://podio.com/oauth/authorize?client_id=rei-ihi0fi&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/auth/podio/callback?preLoginRoute=${currentPath}`;
        const newWindow = window.open(podioAuthUrl, '_blank', 'width=300,height=400');

        const timer = setInterval(function () {
            if (newWindow.closed) {
                clearInterval(timer);
                // Optionally notify the user that the auth window was closed without completion
            }
        }, 500);

        const messageEventListener = function (event) {
            if (event.origin !== process.env.NEXT_PUBLIC_BASE_URL) {
                return;
            }
            const { type } = event.data;
            if (type === 'PODIO_AUTH_SUCCESS') {
                clearInterval(timer);  // Clear the interval timer
                fetchUser();           // Fetch the user data
                onClose();             // Close the dialog or perform some action
                window.removeEventListener('message', messageEventListener); // Remove the event listener
            }
        };

        window.addEventListener('message', messageEventListener, false);
    };


    return (
        <Dialog open={isOpen && isLoggingOut === false} onClose={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md p-6 mx-auto bg-blue-700 rounded-md shadow-super-3">
                    <Dialog.Title className="text-2xl font-bold text-center text-gray-100">Login</Dialog.Title>
                    <div className="mt-8">
                        {errMsg && <p className="text-sm text-center text-red-500">{errMsg}</p>}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full px-3 py-2 text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    className="block w-full px-3 py-2 text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-blue-100">
                            {showPassword ? "Hide" : "Show"} Password
                        </button>
                        <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-300 hover:text-gray-500">Sign In</button>
                    </form>


                    <button
                        onClick={handlePodioSignIn}
                        className='flex flex-row items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-blue-900 bg-white border-2 border-blue-500 rounded-md hover:bg-gray-100'
                    >
                        <Image src="/podio.svg" alt="Podio Logo" width={20} height={20} />
                        Sign In with Podio
                    </button>

                    <Link
                        href={'/forgotPassword'}
                        className="flex justify-end mt-2 text-right text-blue-200 rounded-md"
                    >
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </Dialog>
    );
}
