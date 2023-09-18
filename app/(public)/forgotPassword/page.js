"use client"

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');

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

            console.log(response, response.status)


            toast.success('Password reset email sent successfully.', {
                position: toast.POSITION.TOP_CENTER,
            });

        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col justify-center px-8 py-4 space-y-4 border border-white w-100">
                <Image src="/login-logo.svg" alt="Logo" width={600} height={150} />
                <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <section className="flex flex-row flex-wrap items-center justify-center gap-2 px-2 py-2 border border-gray-200 border-dotted">
                        <label htmlFor="email">Email: </label>
                        <input
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="p-1 text-gray-800 w-60"
                        />
                    </section>
                    <button type="submit" className="px-8 py-2 border-2 border-gray-200">Submit</button>
                </form>
            </div>
        </div>

    )
}