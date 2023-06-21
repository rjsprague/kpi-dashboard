import axios from '../../pages/api/axios'
import useAuth from './useAuth'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const refresh = async () => {
        try {
            const response = await axios.get('/dashboard/auth/refresh', {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                withCredentials: true
            });           
            setAuth({ accessToken: response.data.token });
            Cookies.set('accessToken', response.data.token, { expires: 120 / (24 * 60), secure: true });
            return response.data.token;
        } catch (err) {
            // If refresh token is expired or invalid, redirect to login
            if (err.response?.status === 401) {
                // Store the current location in the cookie
                Cookies.set('preLoginRoute', pathname);
                router.push('/login');
            } else {
                console.error(err);
            }
        }
    };

    return refresh;
};

export default useRefreshToken;
