import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import useSWR from 'swr';
import fetchClients from '@/lib/fetchClients';
import axios from 'axios';

const fetcher = (url) => fetch(url).then((res) => res.json())

const CreateUserForm = () => {
    const [clientNamesArray, setClientNamesArray] = useState([]);
    const [selectedClientName, setSelectedClientName] = useState(null);
    const [selectedTimezone, setSelectedTimezone] = useState('');

    // State variables for each tier
    const [isStarter, setIsStarter] = useState(false);
    const [isProfessional, setIsProfessional] = useState(false);
    const [isScaling, setIsScaling] = useState(false);

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
        isStart: false,
        isProfessional: false,
        isScaling: false,
    };

    const { control, setValue, getValues } = useForm({
        defaultValues,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = getValues();

        try {
            const createUserResponse = await axios.post('/api/temp/users', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log(createUserResponse, createUserResponse.status)
            const { id } = createUserResponse.data;

            const activateUserResponse = await axios.put(`/api/temp/users/${id}/toggle`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log(activateUserResponse, activateUserResponse.status)

            toast.success('User created and activated successfully.');

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const { data: clientsObj, error: clientsError } = useSWR('/api/spaces', fetchClients)
    const { data: timezones, error: tzError } = useSWR('/api/timezones', fetcher);


    useEffect(() => {
        if (clientsObj) {
            setClientNamesArray(Object.keys(clientsObj));
        }
    }, [clientsObj]);

    useEffect(() => {
        if (selectedClientName) {
            const spacesID = clientsObj[selectedClientName];
            setValue('settings.podio.spacesID', spacesID);
        }
    }, [selectedClientName, clientsObj]);

    useEffect(() => {
        // Update form values based on state variables
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

    if (!clientsObj) return <div>Loading...</div>
    if (clientsError) return <div>Error...</div>



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
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" />}
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
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" />}
                />
            </div>

            <div className='flex flex-row items-center gap-2 pl-4'>
                <label className='font-normal text-md sm:whitespace-nowrap'>Property Folder ID</label>
                <Controller
                    name="settings.google.propertyFolderID"
                    control={control}
                    render={({ field }) => <input {...field} type="text" className="w-full px-2 py-1 text-black border rounded" />}
                />
            </div>

            {/* Podio Settings */}
            <h2 className='text-lg font-semibold sm:whitespace-nowrap'>Podio Settings</h2>
            <div className='flex flex-row items-center gap-2 pl-4'>
                <label className='font-normal text-md sm:whitespace-nowrap'>User ID</label>
                <Controller
                    name="settings.podio.userID"
                    control={control}
                    render={({ field }) => <input {...field} type="number" className="w-full px-2 py-1 text-black border rounded" />}
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
                    />
                ))}
            </div>

            <button type="submit" className="px-2 py-1 border border-white border-double rounded">Submit</button>
        </form>
    );
};

export default CreateUserForm;
