"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth';

function Home() {
    const { auth } = useAuth();
    const router = useRouter();

    // if auth has a token and the token has not expired, redirect to dashboard
    useEffect(() => {
        if (auth && auth.token && Number(auth.tokenExpiry)*1000 > Date.now()) {
            router.push('/kpi-dashboard');
        }
    }, [auth])

    return (
        <>
            <main className='flex items-center w-screen h-screen'>
                <section className='flex flex-col items-center gap-20 px-10 mx-auto'>
                    <div>
                        <Image
                            src="/login-logo.svg"
                            alt="REI Automated Logo"
                            height={100}
                            width={500}
                            quality={100}
                            priority
                        />
                    </div>
                    <div>
                        <Link href="/login" className='px-8 py-4 text-3xl uppercase border border-white hover:bg-white hover:text-blue-900'>Sign In</Link>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Home