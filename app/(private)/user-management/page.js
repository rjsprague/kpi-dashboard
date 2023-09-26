"use client"

import useSWR, { mutate } from 'swr';
import withAuth from '../../lib/withAuth';
import 'react-toastify/dist/ReactToastify.css';
import cookies from 'js-cookie';
import CreateUserModal from '@/components/user-components/CreateUserModal';


const fetcher = (url) => fetch(url).then((res) => res.json())

function UserManagementPage() {

    const accessToken = cookies.get('accessToken');
    console.log("accessToken", accessToken)

    const { data: user, error: userError } = useSWR('/auth/getUser', fetcher)
    console.log("user", user)
  

    if (user && !user.isAdmin) {
        <div>
            <h1>Unauthorized</h1>
        </div>
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-4 mx-auto left-5 top-20">
            <h1 className="mb-4 text-2xl text-white">User Management</h1>
            <CreateUserModal />
        </div>
    );
}

export default withAuth(UserManagementPage);