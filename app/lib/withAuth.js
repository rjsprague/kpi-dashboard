// lib/withAuth.js
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import Cookies from 'js-cookie';
import LoadingQuotes from '@/components/LoadingQuotes';
import { useUser } from '@/hooks/useUser';


export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const { auth, setAuth, refreshToken, isLoggingOut } = useAuth();
        // const { user, loading, fetchUser } = useUser();
        // const router = useRouter();
        // const pathname = usePathname()
        // const refresh = useRefreshToken();
        const [isLoading, setIsLoading] = useState(true);
        const [showLoginModal, setShowLoginModal] = useState(false);

        useEffect(() => {          
            let interval;

            if (auth?.tokenExpiry) {
                interval = setInterval(() => {
                    if (new Date().getTime()  > auth.tokenExpiry * 1000) {
                        // Clear cookie and show login modal
                        Cookies.remove('token');
                        Cookies.remove('tokenExpiry')
                        setShowLoginModal(true);
                        clearInterval(interval);
                    }
                }, 1000); // Check every second

                setIsLoading(false);
            }

        }, [auth]);

        if (isLoading) {
            return (
                <div className='absolute inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-20'>
                    <LoadingQuotes mode={'dark'} />
                </div>
            )

        }

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
