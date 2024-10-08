"use client"
import { BsPerson } from 'react-icons/bs';
import { FiUsers, FiSettings, FiCreditCard, FiExternalLink } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Transition } from '@headlessui/react'
import useAuth from '@/hooks/useAuth';


export default function Header() {
    const { logout, user, loading, setIsLoggingOut } = useAuth();

    return (
        <section className="fixed top-0 right-0 z-10 flex flex-col max-w-screen left-20">
            <div className="flex flex-row items-center justify-between h-20 px-4 bg-blue-800">
                <div className="flex px-2">
                    <h4 className="hidden text-xl font-bold leading-7 tracking-wide text-white sm:flex">Welcome!</h4>
                </div>
                <div className="">
                    {/* <a className="flex items-center justify-center w-12 h-12 p-1 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-full hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                        <AiOutlineMail size={20} />
                    </a>
                    <a className="flex items-center justify-center w-12 h-12 p-1 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-full hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                        <AiOutlineBell size={20} />
                    </a>
                    <a className="flex items-center justify-center w-12 h-12 p-1 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-full hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                        <AiOutlineSearch size={20} />
                    </a> */}
                    <Menu as="div" className="relative inline-block text-left text-white transition duration-150 bg-blue-500 border-2 border-gray-100 rounded-2xl hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40">
                        <Menu.Button className="flex flex-row items-center w-40 gap-2 px-4 py-2">
                            {user && user.avatar ? (
                                <Image className="object-cover w-8 h-8 rounded-full sm:mr-3 lg:h-8" src={user.avatar} alt="" />
                            ) : (
                                <BsPerson size={20} />
                            )}
                            <h4 className="flex tracking-wide truncate whitespace-nowrap lg:font-semibold">
                                {user && user.displayName ? user.displayName : user && user.name ? user.name : "Loading..."}
                            </h4>
                        </Menu.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        ></Transition>
                        <Menu.Items className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white shadow-lg rounded-2xl focus:outline-none ring-1 ring-teal-950">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link href="/user-profile" className={`flex items-center w-full px-4 py-2 rounded-t-2xl ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                                        <FiSettings className='mr-2 text-xl hover:animate-spin' />
                                        Settings
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        href="https://billing.stripe.com/p/login/6oEbLhbLHaL62xW6oo"
                                        className={`flex items-center w-full px-4 py-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <FiCreditCard className='mr-2 text-xl' />
                                        Billing
                                        <FiExternalLink className='ml-2 text-md' />
                                    </Link>
                                )}
                            </Menu.Item>
                            {user && user.isAdmin && (
                                <>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href="/user-management" className={`flex items-center w-full px-4 py-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                                                <FiUsers className='mr-2 text-xl' />
                                                Users
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href="/client-sites" className={`flex items-center w-full px-4 py-2 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                                                <FiUsers className='mr-2 text-xl' />
                                                Client Sites
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </>
                            )}
                            <Menu.Item>
                                {({ active }) => (
                                    <button type="button" onClick={() => { setIsLoggingOut(true); logout(); }} className={`flex items-center text-left w-full px-4 py-2 rounded-b-2xl ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                                        <FontAwesomeIcon icon={faSignOut} size="lg" className='mr-2' />
                                        Logout
                                    </button>
                                )}
                            </Menu.Item>
                            {/* Add more links as needed */}
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
        </section>
    )
}
