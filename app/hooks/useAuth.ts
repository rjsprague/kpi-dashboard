// useAuth.ts

import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';

type Auth = {
  token?: string;
  tokenExpiry?: string;
};

type UseAuthReturn = {
  auth: Auth | null;
  setAuth: (auth: Auth) => void;
  logout: () => void;
  user: any;  // Define the user type here based on your user object shape
  loading: boolean;
  handleLogin: (credentials: any) => void; // Define the credentials type
  updateUser: (user: any) => void; // Define the user update type
};

const useAuth = (): UseAuthReturn => {
  const { auth: originalAuth, setAuth, logout, user, loading, handleLogin, updateUser } = useContext(AuthContext);

  let updatedAuth: Auth | null = originalAuth;

  // If auth.token is undefined, try to get it from a cookie
  if (!originalAuth?.token) {
    const token = Cookies.get('token');
    const tokenExpiry = Cookies.get('tokenExpiry');
    if (token) {
      updatedAuth = { ...originalAuth, token: token, tokenExpiry: tokenExpiry };
    }
  }

  return { auth: updatedAuth, setAuth, logout, user, loading, handleLogin, updateUser };
};

export default useAuth;
