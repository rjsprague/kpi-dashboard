// lib/withAuth.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Cookies from 'js-cookie';
import useRefreshToken from '../hooks/useRefreshToken';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { auth } = useAuth();
    const router = useRouter();
    const refresh = useRefreshToken();

    useEffect(() => {
      if (Cookies.get('accessToken')) {
        refresh();
      } else if (!auth?.accessToken) {
        router.replace('/login');
      }
    }, [auth]);

    return auth?.accessToken ? <Component {...props} /> : null;
  }
}
