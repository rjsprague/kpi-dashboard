"use client"

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


export default function ForgotPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [id, setId] = useState('');
    const [resetSecret, setResetSecret] = useState('');

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('id');
        const resetSecret = searchParams.get('key');

        if (!id || !resetSecret) {
            toast.error('Invalid reset link. Please try again.', {
                position: toast.POSITION.TOP_CENTER,
            });
            router.push('/forgotPassword')
            return;
        }

        setId(id);
        setResetSecret(resetSecret);

    }, [pathname, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !newPasswordConfirmation) {
            toast.error('Please enter a password.', {
                position: toast.POSITION.TOP_CENTER,
            });
            return;
        }

        if (newPassword !== newPasswordConfirmation) {
            toast.error('Passwords do not match.', {
                position: toast.POSITION.TOP_CENTER,
            });
            return;
        }

        try {
            const response = await axios.post('/api/auth/reset-password',
                JSON.stringify({
                    id: id,
                    resetSecret: resetSecret,
                    password: newPassword,
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(response)

            if (response && response.status !== 200) {
                toast.error('Error resetting password. Please try again. Contact support@reiautomated.io if you are unable to reset your password.', {
                    position: toast.POSITION.TOP_CENTER,
                });
                router.push('/forgotPassword')
                return;
            }

            toast.success('Password successfully reset.', {
                position: toast.POSITION.TOP_CENTER,
            });
            router.push('/login')

        } catch (error) {
            toast.error('Error resetting password. Please try again.', {
                position: toast.POSITION.TOP_CENTER,
            })
            console.error('Error setting new password:', error);
            router.push('/forgotPassword')
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col justify-center px-8 py-4 space-y-8 bg-blue-800 rounded w-100 shadow-super-3">
                <Image src="/login-logo.svg" alt="Logo" width={600} height={150} priority />
                <h1 className="text-2xl font-bold text-center">Enter your shiny new password.</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <section className="flex flex-row flex-wrap items-center justify-center gap-2 px-2 py-2 border border-gray-200 border-dotted rounded">
                        <label htmlFor="newPassword">Shiny New Password: </label>
                        <input
                            type="text"
                            name="newPassword"
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            className="p-1 text-gray-800 w-60"
                        />
                        {/* New Password Confirmation */}
                        <label htmlFor="newPasswordConfirmation">Make sure it is the same: </label>
                        <input
                            type="text"
                            name="newPasswordConfirmation"
                            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                            value={newPasswordConfirmation}
                            className="p-1 text-gray-800 w-60"
                        />
                    </section>
                    <button type="submit" className="px-8 py-2 border-2 border-gray-200 rounded shadow-super-3">This is my shiny new password.</button>
                </form>
                <Link href="/login">
                    Back to Login
                </Link>
            </div>
        </div>

    )
}