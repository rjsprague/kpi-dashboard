"use client"

import axios from 'axios';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import UniversalDropdown from '../../components/kpi-components/UniversalDropdown';
import withAuth from '../../lib/withAuth';
import useAuth from '../../hooks/useAuth';
import DropdownButton from '../../components/kpi-components/DropdownButton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const fetcher = (url) => axios.get(url).then((res) => res.data);

function UserProfilePage() {
    const [selectedTimezone, setSelectedTimezone] = useState('');
    const [profile, setProfile] = useState({});
    const [displayName, setDisplayName] = useState('');
    const { auth } = useAuth();
    const router = useRouter();

    const { data: timezones, error } = useSWR('/api/timezones', fetcher);

    const { data: profileData, error: profileError } = useSWR('/auth/getUser', fetcher);
    if (profileData === 'No token') router.push('/login');

    useEffect(() => {
        if (profileData) {
            setProfile(profileData);
            setSelectedTimezone(profileData.settings.timezone);
        }
    }, [profileData]);

    const handleTimezoneChange = (selectedOption) => {
        setSelectedTimezone(selectedOption[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('/auth/updateUser',
            { profile, auth, selectedTimezone },
            { 'Content-Type': 'application/json' }
        );

        if (response.data.status === 401) {
            toast.error('You are not authorized to update this user.', {
                position: toast.POSITION.TOP_CENTER,
            })
            return;
        }
        if (response.data.status === 403) {
            toast.error('You are not authorized to update this user.', {
                position: toast.POSITION.TOP_CENTER,
            })
            return;
        }
        if (response.data.status === 404) {
            toast.error('User not found.', {
                position: toast.POSITION.TOP_CENTER,
            })
            return;
        }
        if (response.data.status === 200) {
            toast.success('Timezone updated successfully!', {
                position: toast.POSITION.TOP_CENTER,
            })
            mutate('/auth/getUser');
        } else {
            toast.error('Failed to update timezone. Please try again. Contact support if this issue persists.', {
                position: toast.POSITION.TOP_CENTER,
            })
            console.error('Failed to update user:', await response.text());
        }
    };

    useEffect(() => {
        if (profileData?.settings?.timezone == "" && !toast.isActive('timezone-toast')) {
            toast.error('Please select a timezone', {
                position: toast.POSITION.TOP_CENTER,
                toastId: 'timezone-toast',
            });
        }
    }, [profileData?.settings?.timezone]);

    if (!profileData || !timezones) {
        return <div className='flex items-center justify-center w-full h-full'>Loading...</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center w-full h-full gap-4 overflow-y-auto'>
            <form onSubmit={handleSubmit} className="px-4 py-6 border border-gray-100 rounded-md">
                <h1 className='text-xl font-semibold text-center'>User Profile</h1>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="name">Name: </label>
                    <p>{profile?.name}</p>
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="displayName">Display Name: </label>
                    <p>{profile?.displayName}</p>
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="email">Email: </label>
                    <p>{profile?.email}</p>
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="timezone">Timezone:</label>
                    <p>{profile?.settings?.timezone && profile.settings.timezone}</p>

                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <UniversalDropdown
                        type={"timezone"}
                        options={timezones}
                        onOptionSelected={handleTimezoneChange}
                        selectedOptions={selectedTimezone ? [selectedTimezone] : []}
                        isSingleSelect={true}
                        className={"dropdown"}
                        ButtonComponent={DropdownButton}
                        defaultValue={"Select a timezone..."}
                    />
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <button type="submit" className='z-10 px-4 py-2 mx-auto mt-4 border rounded-md border-gray hover:bg-gray-100 hover:text-blue-800'>Save</button>
                </section>
            </form>
        </div>
    );
}

export default withAuth(UserProfilePage);