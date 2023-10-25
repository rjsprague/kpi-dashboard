// "use client"
import { createContext, useState, ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'; // Note: Corrected 'next/navigation' to 'next/router'

// Define types
interface Auth {
  token?: string;
  refreshToken?: string;
}

type User = any; // Replace 'any' with your User type definition

interface AuthContextProps {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  user: User | null;
  loading: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => void;
  refreshToken: () => Promise<void>;
}

// Initialize context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, loading, fetchUser, login } = useUser();
  const [auth, setAuth] = useState<Auth>({});
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const logout = async () => {
    try {
      router.push('/login');
      Cookies.remove('token');
      setAuth({ token: undefined });
      fetchUser();
    } catch (error) {
      console.error('An error occurred during logout:', error);
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
          Authorization: `Bearer ${auth.refreshToken}`,
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        Cookies.set('token', data.token);
        setAuth({ ...auth, token: data.token });
      } else {
        // Handle failure
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, loading, handleLogin, logout, updateUser, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
