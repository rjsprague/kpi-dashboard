"use client"
import { AiOutlineMail, AiOutlineBell, AiOutlineSearch } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import Link from 'next/link'
import Image from 'next/image'


export default function Header() {
    

    return (
        <section className="absolute right-0 flex flex-col min-h-screen max-w-screen left-20">
            <div className="flex flex-col justify-between p-4 bg-blue-800">
                <div className="flex items-center justify-center w-auto md:justify-between ">
                    <div className="px-2 mb-2 text-center sm:w-full md:w-auto lg:mb-0 md:text-left">
                        <h4 className="hidden mb-1 text-2xl font-bold leading-7 tracking-wide text-white sm:flex">Header</h4>
                        <p className="hidden text-xs text-gray-100 md:block">Get your work done!</p>
                    </div>
                    <div className="items-center px-2 align-middle sm:w-full md:w-auto">
                        <div className="flex flex-row justify-center gap-2">
                            <div className="w-full lg:mb-6 sm:w-auto sm:mb-0 sm:mr-4">
                                <div className="flex items-center">
                                    <a className="inline-flex items-center justify-center w-12 h-12 p-1 mr-2 text-gray-100 transition duration-150 bg-blue-500 rounded-full md:mr-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                                        <AiOutlineMail size={20} />
                                    </a>
                                    <a className="inline-flex items-center justify-center w-12 h-12 p-1 mr-2 text-gray-100 transition duration-150 bg-blue-500 rounded-full md:mr-4 hover:bg-blue-400 hover:bg-opacity-40" href="#">
                                        <AiOutlineBell size={20} />
                                    </a>
                                    <a className="inline-flex items-center justify-center w-12 h-12 p-1 text-gray-100 transition duration-150 bg-blue-500 rounded-full hover:bg-blue-400 hover:bg-opacity-40" href="#">
                                        <AiOutlineSearch size={20} />
                                    </a>
                                </div>
                            </div>
                            <div className="w-auto">
                                <a className="inline-flex items-center justify-center p-2 transition duration-150 bg-blue-500 rounded-full hover:bg-blue-400 hover:bg-opacity-40" href="#">
                                    <img className="object-cover w-8 h-8 rounded-full sm:mr-3 lg:h-8" src="/Ryan.webp" alt="" />
                                    <h4 className="hidden overflow-hidden tracking-wide text-white whitespace-nowrap lg:font-extrabold sm:flex">Ryan Sprague</h4>
                                    <BsPerson size={10} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
