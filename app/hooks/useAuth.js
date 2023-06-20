import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from 'js-cookie';

const useAuth = () => {
    let { auth, setAuth } = useContext(AuthContext);

    // If auth.accessToken is undefined, try to get it from a cookie
    if (!auth?.accessToken) {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            auth = { ...auth, accessToken };
        }
    }

    useDebugValue(auth, auth => auth?.accessToken ? "Logged In" : "Logged Out")
    return { auth, setAuth };
}

export default useAuth;
