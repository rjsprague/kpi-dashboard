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
        const { auth, setAuth, refreshToken } = useAuth();
        const { user, loading, fetchUser } = useUser();
        const router = useRouter();
        const pathname = usePathname()
        // const refresh = useRefreshToken();
        const [isLoading, setIsLoading] = useState(true);
        const [showLoginModal, setShowLoginModal] = useState(false);

        // console.log('auth', auth.tokenExpiry)

        useEffect(() => {          
            let interval;

            if (auth?.tokenExpiry) {
                interval = setInterval(() => {
                    if (new Date().getTime() / 1000 > Number(auth.tokenExpiry)) {
                        // Clear cookie and show login modal
                        Cookies.remove('token');
                        Cookies.remove('tokenExpiry')
                        setShowLoginModal(true);
                        clearInterval(interval);
                    }
                }, 1000); // Check every second
            }

            if (!user && !loading) {
                // Check if we are on the server
                if (typeof window === 'undefined') {
                    return;
                }

                // Get auth token from cookies
                const accessToken = Cookies.get('token');
                console.log('accessToken', accessToken)
                if (!accessToken) {
                    router.push('/login');
                    return;
                }

                // Fetch the user
                fetch(`api/users/me`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then((res) => {
                        console.log(res, res.status)
                        if (res.status !== 200) {
                            // refreshToken();
                            setShowLoginModal(true);
                            return;
                        }
                        return res.json();
                    })
                    .then((user) => {
                        setAuth({ user, token: accessToken });
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        router.push('/login');
                    });
            } else {
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
                {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
                {isLoading ?
                    <div className='absolute inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-20'>
                        <LoadingQuotes mode={'dark'} />
                    </div> : <Component {...props} />}
            </>
        )
    }
}
