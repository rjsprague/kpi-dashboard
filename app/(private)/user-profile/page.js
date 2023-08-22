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
    // console.log('auth', auth)

    const { data: timezones, error } = useSWR('/api/timezones', fetcher);
    // console.log('timezones', timezones)

    const { data: profileData } = useSWR('/auth/getUser', fetcher);
    // console.log(profileData)

    useEffect(() => {
        if (profileData) {
            setProfile(profileData);
            setSelectedTimezone(profileData.settings.timezone);
        }
    }, [profileData]);

    const handleTimezoneChange = (selectedOption) => {
        console.log(selectedOption)
        setSelectedTimezone(selectedOption[0]);
    };

    const handleSubmit = async (e) => {
        console.log('submitting')
        e.preventDefault();
        const response = await fetch('/auth/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile, auth, selectedTimezone })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            mutate('/auth/getUser');
            router.push('/kpi-dashboard');
        } else {
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
        <div className='flex flex-col items-center justify-center w-full h-full gap-4'>
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