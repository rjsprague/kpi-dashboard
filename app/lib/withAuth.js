// lib/withAuth.js
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
import useRefreshToken from '../hooks/useRefreshToken';
import LoadingQuotes from '../components/LoadingQuotes'

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { auth, setAuth } = useAuth();
    const router = useRouter();
    const pathname = usePathname()
    const refresh = useRefreshToken();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!auth?.accessToken) {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
          refresh().then(() => setIsLoading(false));
        } else {
          // Store the current location in the cookie
          Cookies.set('preLoginRoute', pathname);
          router.push('/login');
        }
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
