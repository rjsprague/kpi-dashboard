"use client"

import withAuth from '@/lib/withAuth';
import useAuth from '@/hooks/useAuth';
import DropdownButton from '@/components/kpi-components/DropdownButton';
import UniversalDropdown from '@/components/kpi-components/UniversalDropdown';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EllipsisLoader from '@/components/EllipsisLoader';


function UserProfilePage() {
    const { user, loading, logout, auth, updateUser } = useAuth();
    const [selectedTimezone, setSelectedTimezone] = useState('');
    const [timezones, setTimezones] = useState([]);
    const accessToken = auth?.token;
    
    useEffect(() => {
        axios.get('/api/timezones')
            .then(response => setTimezones(response.data))
            .catch(error => console.error('Failed to fetch timezones:', error));
    }, []);

    useEffect(() => {
        if (user) {
            setSelectedTimezone(user.settings.timezone);
        }
    }, [user]);

    const handleTimezoneChange = (selectedOption) => {
        setSelectedTimezone(selectedOption[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/users/${user.id}`,
                {
                    "email": user.email,
                    "name": user.name,
                    "displayName": user.displayName,
                    "settings": {
                        "timezone": selectedTimezone,
                        "podio": {
                            "userID": user.settings.podio.userID,
                            "spacesID": user.settings.podio.spacesID
                        },
                        "google": {
                            "rootFolderID": user.settings.google.rootFolderID,
                            "propertyFolderID": user.settings.google.propertyFolderID
                        }
                    },
                    "isAdmin": user.isAdmin,
                    "isActive": user.isActive,
                    "isProfessional": user.isProfessional,
                    "isScaling": user.isScaling,
                    "isStarter": user.isStarter
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Timezone updated successfully!', {
                    position: toast.POSITION.TOP_CENTER,
                });
                updateUser();
            } else {
                throw new Error('Failed to update timezone');
            }
        } catch (err) {
            const status = err.response.data.errors;
            // console.log(err.response.data.errors)

            if (status === 401 || status === 403) {
                logout();
                return;
            }

            const errorMsgs = {
                default: 'Failed to update timezone. Please try again. Contact support if this issue persists.',
            };
            toast.error(status || errorMsgs.default, {
                position: toast.POSITION.TOP_CENTER,
            });
            console.error('Failed to update user:', err);
        }
    };

    useEffect(() => {
        if (user?.settings?.timezone == "" && !toast.isActive('timezone-toast')) {
            toast.error('Please select a timezone', {
                position: toast.POSITION.TOP_CENTER,
                toastId: 'timezone-toast',
            });
        }
    }, [user?.settings?.timezone]);

    if (loading || !timezones) {
        return <div className='flex items-center justify-center w-full h-full'>Loading...</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center w-full h-full gap-4 overflow-y-auto'>
            <form onSubmit={handleSubmit} className="px-4 py-6 border border-gray-100 rounded-md">
                <h1 className='text-xl font-semibold text-center'>User Profile</h1>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="name">Name: </label>
                    <p>{user?.name}</p>
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="displayName">Display Name: </label>
                    <p>{user?.displayName}</p>
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="email">Email: </label>
                    <p>{user?.email}</p>
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <label htmlFor="timezone">Timezone:</label>
                    <p>{user?.settings?.timezone && user.settings.timezone}</p>

                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    {
                        timezones ?
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
                            :
                            <EllipsisLoader />
                    }
                </section>
                <section className='flex flex-row gap-2 p-2 rounded-md'>
                    <button type="submit" className='z-10 px-4 py-2 mx-auto mt-4 border rounded-md border-gray hover:bg-gray-100 hover:text-blue-800'>Save</button>
                </section>
            </form>
        </div>
    );
}

export default withAuth(UserProfilePage);