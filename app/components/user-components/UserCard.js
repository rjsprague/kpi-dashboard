"use client"

import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import UserModal from './UserModal';
import { FiEdit } from 'react-icons/fi';

const UserCard = ({ user, onToggleActive, clients }) => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <div className="relative flex flex-col justify-between h-32 p-4 mb-4 mr-4 bg-blue-700 rounded-md w-46 shadow-super-3 ">
            <FiEdit className="absolute text-xl text-white cursor-pointer top-5 right-5" onClick={toggleModal} />
            {showModal && <UserModal user={user} isOpen={showModal} setIsOpen={setShowModal} />}
            <h3 className="font-semibold text-md">{user.name}</h3>
            <p className="text-sm text-gray-100 truncate">{user.settings.podio.spaceid === 0 ? 'Starter or Pro' : clients[user.settings.podio.spaceid]}</p>
            <div className="">
                <Switch.Group as="div" className="flex flex-col">
                    <Switch.Label>Status</Switch.Label>
                    <Switch
                        as="button"
                        index={user["_id"]}
                        checked={user.isactive}
                        onChange={() => onToggleActive(user["_id"])}
                        className={`${user.isactive ? 'bg-blue-100' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        {/* Render the switch */}
                        <span className="text-white sr-only">{user.isactive ? 'Active' : 'Inactive'}</span>
                        <span className={`${user.isactive ? 'translate-x-5' : 'translate-x-0'} inline-block w-5 h-5 transition-transform duration-200 ease-in-out transform bg-white rounded-full`} />
                    </Switch>
                </Switch.Group>
            </div>
        </div>
    );
};

export default UserCard;
