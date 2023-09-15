// lib/withAuth.js
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
// import useRefreshToken from '../hooks/useRefreshToken';
import LoadingQuotes from '../components/LoadingQuotes';


export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const { auth, setAuth } = useAuth();
        const router = useRouter();
        const pathname = usePathname()
        // const refresh = useRefreshToken();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            // Check if the user is authenticated
            if (!auth) {
                // Check if we are on the server
                if (typeof window === 'undefined') {
                    return;
                }

                // Get auth token from cookies
                const accessToken = Cookies.get('accessToken');

                if (!accessToken) {
                    router.push('/login');
                    return;
                }

                // Fetch the user
                fetch(`${process.env.API_BASE_URL}/users/me`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then((res) => {
                        console.log(res, res.status)
                        if (res.status === 401) {
                            router.push('/login');
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

        return <Component {...props} />;
    }
}
