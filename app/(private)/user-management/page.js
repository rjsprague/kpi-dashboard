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
import cookies from 'js-cookie';



function UserManagementPage() {

    const accessToken = cookies.get('accessToken');

    console.log("accessToken: " + accessToken)

    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [token, setToken] = useState(''); // Replace with the actual token

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create Temp User
        try {
            const response = await axios.post('/temp/users', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const { id } = response.data;

            // Activate Temp User
            await axios.put(`/temp/users/${id}/toggle`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('User created and activated successfully.');

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-4 mx-auto left-5 top-20">
            <h1 className="mb-4 text-2xl text-white">User Management</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-100" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-100" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Create User
                </button>
            </form>
        </div>
    );
}

export default withAuth(UserManagementPage);