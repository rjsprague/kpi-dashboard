// lib/withAuth.js
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import Cookies from 'js-cookie';
import LoadingQuotes from '@/components/LoadingQuotes';
import { useRouter } from 'next/navigation';

function checkCookies() {

    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});

    const tokenExists = cookies.hasOwnProperty('token');
    console.log(tokenExists)
    const tokenExpiryExists = cookies.hasOwnProperty('tokenExpiry');
    console.log(tokenExpiryExists)

    return { tokenExists, tokenExpiryExists };
}

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const { auth, isLoggingOut } = useAuth();
        const [isLoading, setIsLoading] = useState(true);
        const [showLoginModal, setShowLoginModal] = useState(false);

        const router = useRouter();

        useEffect(() => {
            const { tokenExists, tokenExpiryExists } = checkCookies();
            let interval;
            // get tokenExpiry from cookie
            const tokenExpiry = Cookies.get('tokenExpiry');

            if (!tokenExists && isLoggingOut === false || !tokenExpiryExists && isLoggingOut === false) {
                // if the Cookies.get('token') and/or Cookies.get('tokenExpiry') is missing redirect to login
                router.push('/login');
            }

            if (auth?.tokenExpiry && tokenExpiry && isLoggingOut === false) {
                interval = setInterval(() => {
                    if (new Date().getTime() > Number(auth.tokenExpiry) * 1000) {
                        // show login modal
                        setShowLoginModal(true);
                        clearInterval(interval);
                    }
                }, 1000); // Check every second

                setIsLoading(false);
            }

        }, [auth, isLoggingOut]);

        return (
            <>
                {showLoginModal && !isLoggingOut && <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
                {isLoading ?
                    <div className='absolute inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-20'>
                        <LoadingQuotes mode={'dark'} />
                    </div> : <Component {...props} />}
            </>
        )
    }
}
