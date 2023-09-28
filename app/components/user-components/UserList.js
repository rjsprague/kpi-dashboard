"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const UserList = ({usersArray, clientsObj}) => {
    const [users, setUsers] = useState(usersArray);
    const [clients, setClients] = useState({});
    // reverse the clientsObj object so that we can use the spaceid as the key
    useEffect(() => {
        const reversedClientsObj = {};
        for (const [key, value] of Object.entries(clientsObj)) {
            reversedClientsObj[value] = key;
        }
        setClients(reversedClientsObj);
    }, [clientsObj]);

    const toggleActiveStatus = async (userId) => {
        // Toggle the active status of the user with the given userId
        // Update your state or make an API call here
        const toggleUserResponse = await axios.put(`/api/temp/users/${userId}/toggle`, {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (toggleUserResponse.status === 200) {
            const updatedUsers = users.map((user) => {
                if (user["_id"] === userId) {
                    return {
                        ...user,
                        isactive: !user.isactive
                    };
                }
                return user;
            });
            setUsers(updatedUsers);
        }
    };

    return (
        <div className="flex flex-row flex-wrap">
            {users.map((user) => (
                <UserCard key={user["_id"]} user={user} onToggleActive={toggleActiveStatus} clients={clients} />
            ))}
        </div>
    );
};

export default UserList;