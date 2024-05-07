import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import UserForm from './UserForm';
import { FiX } from 'react-icons/fi';

const UserModal = ({user, isOpen, setIsOpen, accessToken}) => {

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-scroll"
                    static={false}
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center sm:block sm:p-0"
                        onClick={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-300 sm:duration-500"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-300 sm:duration-500"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >

                            <div className="fixed top-0 bottom-0 right-0 inline-block w-full h-screen max-w-2xl overflow-y-scroll text-center align-middle transition-all transform bg-blue-700 sm:w-3/4 md:w-1/2 xl:w-1/3 sm:align-middle"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Dialog.Title
                                    as="h3"
                                    className="mt-6 text-xl font-bold leading-6 text-white uppercase"
                                >
                                   {user['_id'] ? 'Update ' : 'Create '} User
                                </Dialog.Title>
                                <button
                                    type="button"
                                    className="absolute p-1 text-lg font-semibold bg-blue-800 rounded-full top-4 right-4 hover:bg-gray-100 hover:text-blue-800"
                                    onClick={closeModal}
                                >
                                    <FiX />
                                </button>
                                <div className="relative inline-block w-full max-w-md p-4 pt-8 overflow-y-scroll text-left align-middle transition-all transform">
                                    <UserForm user={user} accessToken={accessToken} />
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default UserModal;
