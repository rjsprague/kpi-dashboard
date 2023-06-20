import axios from '../../pages/api/axios';
import useAuth from './useAuth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const router = useRouter();

    const refresh = async () => {

        //console.log("auth.accessToken", auth.accessToken)
        try {
            const response = await axios.get('/dashboard/auth/refresh', {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                withCredentials: true
            });           
            // Store the new access token in the state
            setAuth({ accessToken: response.data.token });
            return response.data.token;
        } catch (err) {
            // If refresh token is expired or invalid, redirect to login
            if (err.response?.status === 401) {
                // Store the current location in the session storage
                sessionStorage.setItem('preLoginRoute', router.asPath);
                router.push('/login');
            } else {
                // Handle other errors as you see fit
                console.error(err);
            }
        }
    };

    return refresh;
};

export default useRefreshToken;
