"use client"

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import withAuth from '../../lib/withAuth';
import 'react-toastify/dist/ReactToastify.css';
import cookies from 'js-cookie';
import UserModal from '@/components/user-components/UserModal';
import LoadingQuotes from '@/components/LoadingQuotes';
import UserList from '@/components/user-components/UserList';
import axios from 'axios';
import fetchClients from '@/lib/fetchClients';


const fetchWithToken = async ({ url, accessToken }) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('An error occurred while fetching data.');
    }
};

const fetcher = (url) => fetch(url).then((res) => res.json())

function UserManagementPage() {
    const [isOpen, setIsOpen] = useState(false);

     // Define default values for the form
     const defaultValues = {
        email: '',
        name: '',
        displayName: '',
        settings: {
            timezone: '',
            google: {
                rootFolderID: '',
                propertyFolderID: ''
            },
            podio: {
                userID: 0,
                spacesID: 0
            }
        },
        isAdmin: false,
        isStarter: false,
        isProfessional: false,
        isScaling: false,
    };

    const url = '/api/users';
    const accessToken = cookies.get('accessToken');
    const { data: user, error: userError } = useSWR('/auth/getUser', fetcher, { 
        revalidateOnFocus: false, 
        revalidateOnReconnect: false 
      })
    const { data: users, error: usersError } = useSWR({ url, accessToken }, fetchWithToken)
    const { data: clientsObj, error: clientsError } = useSWR('/api/spaces', fetchClients)

    // console.log(users)
    // console.log(clientsObj)

    const openModal = () => {
        setIsOpen(true);
    };

    if (user && !user.isAdmin) {
        <div className="flex justify-center w-full h-full items center">
            <h1>Unauthorized</h1>
        </div>
    }
    
    if (!user || !users || !clientsObj) {
        return <div className="flex items-center justify-center w-full h-screen"><LoadingQuotes mode={'dark'} /></div>
    }
    if (usersError) {
        console.error('Failed to load users:', usersError)
    }
    if (userError) {
        console.error('Failed to load user:', userError)
    }
    if (clientsError) {
        console.error('Failed to load clients:', clientsError)
    }

    return (
        <div className="relative right-0 flex flex-col items-center w-full h-screen px-2 py-20 space-y-8 sm:px-10">
            <h1 className="text-2xl text-white">User Management</h1>
            <button onClick={openModal} className="p-2 text-white bg-blue-500 rounded">
                Create User
            </button>
            <UserModal user={defaultValues} openModal={openModal} isOpen={isOpen} setIsOpen={setIsOpen} />
            <UserList usersArray={users.data} clientsObj={clientsObj} />
        </div>
    );
}

export default withAuth(UserManagementPage);