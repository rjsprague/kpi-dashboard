"use client"
import { AiOutlineMail, AiOutlineBell, AiOutlineSearch } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { Menu } from '@headlessui/react'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Header() {

    const { data: user, error: userError } = useSWR('/auth/getUser', fetcher)
    // console.log("user", user)

    return (
        <section className="fixed top-0 right-0 z-10 flex flex-col max-w-screen left-20">
            <div className="flex flex-row items-center justify-between h-20 px-4 bg-blue-800">
                <div className="flex px-2">
                    <h4 className="hidden text-xl font-bold leading-7 tracking-wide text-white sm:flex">Welcome!</h4>
                </div>
                <div className="flex gap-4">
                    {/* <a className="flex items-center justify-center w-12 h-12 p-1 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-full hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                        <AiOutlineMail size={20} />
                    </a>
                    <a className="flex items-center justify-center w-12 h-12 p-1 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-full hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                        <AiOutlineBell size={20} />
                    </a>
                    <a className="flex items-center justify-center w-12 h-12 p-1 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-full hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                        <AiOutlineSearch size={20} />
                    </a> */}
                    <Menu as="div" className="flex items-center justify-center w-40 px-4 py-2 text-blue-800 transition duration-150 bg-blue-100 border-2 border-gray-100 rounded-md hover:shadow-none hover:text-gray-100 shadow-super-4 hover:bg-blue-400 hover:bg-opacity-40">
                        <Menu.Button className="flex flex-row items-center w-40 gap-2">
                            {user && user.avatar ? (
                                <Image className="object-cover w-8 h-8 rounded-full sm:mr-3 lg:h-8" src={user.avatar} alt="" />
                            ) : (
                                <BsPerson size={20} />
                            )}
                            <h4 className="hidden overflow-hidden tracking-wide whitespace-nowrap lg:font-semibold sm:flex">
                                {user && user.displayName ? user.displayName : user && user.name ? user.name : "Loading..."}
                            </h4>
                        </Menu.Button>
                        <Menu.Items className="absolute w-40 mt-20 bg-white rounded-md shadow-super-4">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link href="/user-profile" className={`block px-4 py-2 text-sm rounded-md shadow-super-4 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                                        Profile
                                    </Link>
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
