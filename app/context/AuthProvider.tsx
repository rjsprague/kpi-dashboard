"use client"
import { createContext, useState, ReactNode, useRef, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Define types
interface Auth {
    token?: string;
    tokenExpiry?: string;
}

type User = any;

interface AuthContextProps {
    auth: Auth;
    setAuth: (auth: Auth) => void;
    user: User | null;
    loading: boolean;
    handleLogin: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoggingOut: boolean;
    setIsLoggingOut: (isLoggingOut: boolean) => void;
    updateUser: (user: any) => void;
    refreshToken: () => Promise<void>;
}

// Initialize context
const AuthContext = createContext<AuthContextProps>({
    auth: {},
    setAuth: () => { },
    user: null,
    loading: false,
    handleLogin: async () => { },
    logout: async () => { },
    isLoggingOut: false,
    setIsLoggingOut: () => { },
    updateUser: () => { },
    refreshToken: async () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { user, loading, fetchUser, login } = useUser();
    const [auth, setAuth] = useState<Auth>({});
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogin = async (email: string, password: string) => {
        await login(email, password);
    };



    const logout = async () => {
        setIsLoggingOut(true);

        try {
            router.push('/login');

        } catch (error) {
            console.error('An error occurred during logout:', error);
        } finally {
            setAuth({ token: undefined, tokenExpiry: undefined });
            Cookies.remove('token');
            Cookies.remove('tokenExpiry');
            Cookies.remove('preLoginRoute')
            fetchUser();
            setIsLoggingOut(false);
        }
    };

    const updateUser = () => {
        fetchUser();
    };

    const refreshToken = async () => {
        try {
            const res = await fetch(`api/auth/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                Cookies.set('token', data.token);
                setAuth({ ...auth, token: data.token });
            } else {
                // Handle failure
                console.error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, user, loading, handleLogin, logout, isLoggingOut, setIsLoggingOut, updateUser, refreshToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
