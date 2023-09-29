"use client"

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import useSWR from 'swr';
import fetchClients from '@/lib/fetchClients';
import axios from 'axios';
import { toast } from 'react-toastify';

const fetcher = (url) => fetch(url).then((res) => res.json())

const UserForm = ({ user }) => {

    // console.log(user)
    const [clientNamesArray, setClientNamesArray] = useState([]);
    const [selectedClientName, setSelectedClientName] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState('');
    const [formType, setFormType] = useState('create');

    // State variables for each tier
    const [isStarter, setIsStarter] = useState(false);
    const [isProfessional, setIsProfessional] = useState(false);
    const [isScaling, setIsScaling] = useState(false);

    const { control, setValue, getValues } = useForm({
        defaultValues: user,
    });

    useEffect(() => {
        if (user && user['_id']) {
            setFormType('updat');
        } else {
            setFormType('creat');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = getValues();

        try {

            if (user && user['_id']) {
                // Update user
                const updateUserResponse = await axios.put('/api/temp/users/' + user['_id'], formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (updateUserResponse.status !== 200) {
                    throw new Error('Error creating or updating user.');
                }

            } else {
                // console.log('Creating user')
                // console.log(formData)

                const createUserResponse = await axios.post('/api/temp/users', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                // console.log(createUserResponse)
                if (createUserResponse.status !== 200) {
                    throw new Error('Error creating or updating user.');
                }

            }

            toast.success('User' + formType + 'ed successfully.')

        } catch (error) {
            console.error('Error creating or updating user:', error);
            toast.error('Error ' + formType + 'ing user.');
        }
    };

    const { data: clientsObj, error: clientsError } = useSWR('/api/spaces', fetchClients)
    const { data: timezones, error: tzError } = useSWR('/api/timezones', fetcher);

    useEffect(() => {
        if (user) {
            // Set form values based on the user object
            setValue('email', user.email || '');
            setValue('name', user.name || '');
            setValue('displayName', user.displayname || '');
            setValue('settings.timezone', user.settings?.timezone && user.settings.timezone  || '');
            setValue('settings.google.rootFolderID', user.settings.google.rootfolderid || '');
            setValue('settings.google.propertyFolderID', user.settings.google.propertyfolderid || '');
            setValue('settings.podio.userID', user.settings.podio.userid || 0);
            setValue('isAdmin', user.isadmin || false);
            setValue('isStarter', user.isstarter || false);
            setValue('isProfessional', user.isprofessional || false);
            setValue('isScaling', user.isscaling || false);

            // Set state variables for tier
            setIsStarter(user.isstarter);
            setIsProfessional(user.isprofessional);
            setIsScaling(user.isscaling);

            // Set state variables for dropdowns
            setSelectedTimezone(user.settings?.timezone && user.settings.timezone || '');
            setSelectedClientName(user.settings.podio.spaceid || 0); // Assuming you can map spaceid to client name
        }
    }, [user]);

    useEffect(() => {
        if (clientsObj) {
            setClientNamesArray(Object.keys(clientsObj));
        }
    }, [clientsObj]);

    useEffect(() => {
        if (selectedClientName && selectedClientName !== 'Starter' && selectedClientName !== 'Professional') {
            const spacesID = clientsObj[selectedClientName];
            setValue('settings.podio.spacesID', spacesID);
        }
    }, [selectedClientName, clientsObj]);

    useEffect(() => {
        if (selectedTimezone) {
            setValue('settings.timezone', selectedTimezone);
        }
    }, [selectedTimezone]);

    useEffect(() => {
        // Update form values based on state variables
        if (isStarter || isProfessional) {
            setValue('settings.podio.spacesID', 0);
        }

        setValue('isStarter', isStarter);
        setValue('isProfessional', isProfessional);
        setValue('isScaling', isScaling);
    }, [isStarter, isProfessional, isScaling]);

    // Function to handle tier change
    const handleTierChange = (selectedTier) => {
        setIsStarter(selectedTier === 'isStarter');
        setIsProfessional(selectedTier === 'isProfessional');
        setIsScaling(selectedTier === 'isScaling');
    };

    if (!clientsObj || !timezones) return <div>Loading...</div>
    if (clientsError || tzError) return <div>Error...</div>

    return (
        <form onSubmit={handleSubmit} className="w-auto space-y-4">
            <div className='flex flex-row items-center gap-2'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Email</label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <input {...field} type="email" className='w-full px-2 py-1 text-black border rounded' required />}
                />
            </div>

            <div className='flex flex-row items-center gap-2'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Name</label>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" required />}
                />
            </div>

            <div className='flex flex-row items-center gap-2'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Display Name</label>
                <Controller
                    name="displayName"
                    control={control}
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" required />}
                />
            </div>

            {/* Timezones */}
            <div className='flex flex-row items-center gap-2'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Timezone</label>
                <select onChange={(e) => setSelectedTimezone(e.target.value)} className="w-full px-2 py-1 text-black border rounded">
                    <option value="" disabled>Select Timezone</option>
                    {timezones.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Google Settings */}
            <h2 className='text-lg font-semibold sm:whitespace-nowrap'>Google Settings</h2>
            <div className='flex flex-row items-center gap-2 pl-4'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Root Folder ID</label>
                <Controller
                    name="settings.google.rootFolderID"
                    control={control}
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" required />}
                />
            </div>

            <div className='flex flex-row items-center gap-2 pl-4'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Property Folder ID</label>
                <Controller
                    name="settings.google.propertyFolderID"
                    control={control}
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" required />}
                />
            </div>

            {/* Podio Settings */}
            <h2 className='text-lg font-semibold sm:whitespace-nowrap'>Podio Settings</h2>
            <div className='flex flex-row items-center gap-2 pl-4'>
                <label className='font-normal text-md sm:whitespace-nowrap'>User ID</label>
                <Controller
                    name="settings.podio.userID"
                    control={control}
                    render={({ field }) => <input {...field} type="number" className="w-full px-2 py-1 text-black border rounded" required />}
                />
            </div>

            {/* Podio Client Name Dropdown */}
            <div className='flex flex-row items-center gap-2 pl-4'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Client</label>
                <select onChange={(e) => setSelectedClientName(e.target.value)} className="w-full px-2 py-1 text-black border rounded">
                    <option value="" disabled>Select Client</option>
                    <option>Starter</option>
                    <option>Professional</option>
                    {clientNamesArray.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* User Types */}
            <div className='relative flex flex-row items-center justify-start gap-2'>
                <label className='flex font-normal text-md sm:whitespace-nowrap'>Is Admin?</label>
                <Controller
                    name="isAdmin"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            onClick={(e) => e.stopPropagation()}
                            className={`${field.value ? 'bg-blue-100' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}>
                            <span className="sr-only">Is Admin?</span>
                            <span className={`${field.value ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`} />
                        </Switch>
                    )} />
            </div>

            <div className='flex flex-col gap-2'>
                <label className='text-lg font-semibold sm:whitespace-nowrap'>User Tier</label>
                {['Starter', 'Professional', 'Scaling'].map((tier) => (
                    <Controller
                        key={tier}
                        name={`is${tier}`}
                        control={control}
                        render={({ field }) => (
                            <label className='flex gap-2 pl-4'>
                                <Switch
                                    checked={field.value}
                                    onChange={() => {
                                        field.onChange(!field.value);
                                        handleTierChange(`is${tier}`);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`${field.value ? 'bg-blue-100' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}>
                                    <span className="sr-only">{tier}</span>
                                    <span className={`${field.value ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`} />
                                </Switch>
                                {tier}
                            </label>
                        )}
                        required
                    />
                ))}
            </div>

            <button type="submit" className="px-2 py-1 border border-white border-double rounded">Submit</button>
        </form>
    );
};

export default UserForm;
