"use client"

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Post to /auth/forgot-password
        try {
            const response = await axios.post('/api/auth/forgot-password',
                JSON.stringify({ email: email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (!response.data) {
                toast.error('Error sending password reset email.', {
                    position: toast.POSITION.TOP_CENTER,
                });
                return;
            }

            // console.log(response.data)

            toast.success('Password reset email sent successfully. Check your email inbox.', {
                position: toast.POSITION.TOP_CENTER,
            });
            router.push('/login')
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col justify-center px-8 py-4 space-y-8 bg-blue-800 rounded w-100 shadow-super-3">
                <Image src="/login-logo.svg" alt="Logo" width={600} height={150} priority />
                <h1 className="text-2xl font-bold text-center">Oops... I forgot my password.</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <section className="flex flex-row flex-wrap items-center justify-center gap-2 px-2 py-2 border border-gray-200 border-dotted rounded">
                        <label htmlFor="email">Email: </label>
                        <input
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="p-1 text-gray-800 w-60"
                        />
                    </section>
                    <button type="submit" className="px-8 py-2 border-2 border-gray-200 rounded shadow-super-3">Please send me a password reset link.</button>
                </form>
                <Link href="/login">
                    Back to Login
                </Link>
            </div>
        </div>

    )
}