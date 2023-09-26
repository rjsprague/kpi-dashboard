import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import CreateUserForm from './CreateUserForm';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';

const CreateUserModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <div>
            <button onClick={openModal} className="p-2 text-white bg-blue-500 rounded">
                Create User
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
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

                            <div className="fixed top-0 bottom-0 right-0 inline-block w-full max-w-2xl overflow-hidden text-center align-middle transition-all transform bg-blue-700 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 sm:align-middle"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Dialog.Title
                                    as="h3"
                                    className="mt-6 text-xl font-bold leading-6 text-white uppercase"
                                >
                                    Create User
                                </Dialog.Title>
                                <button
                                    type="button"
                                    className="absolute p-1 text-lg font-semibold bg-blue-800 rounded-full top-4 right-4 hover:bg-gray-100 hover:text-blue-800"
                                    onClick={closeModal}
                                >
                                    <FiX />
                                </button>

                                <div className="relative inline-block w-full max-w-md p-4 pt-8 overflow-hidden text-left align-middle transition-all transform">

                                    <CreateUserForm />
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default CreateUserModal;
