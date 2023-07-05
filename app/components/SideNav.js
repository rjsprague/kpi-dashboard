"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiGrid, FiCpu, FiPlayCircle, FiUsers, FiSettings, FiArrowRightCircle, FiMenu, FiChevronsRight } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faGaugeHigh, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import fetchClients from '../lib/fetchClients';
import SideNavDropdown from './SideNavDropdown';


export default function SideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);
    const [clients, setClients] = useState({});
    const [clientsNamesArray, setClientsNamesArray] = useState([]);
    const sideNavRef = useRef(null);
    const sideNavContentRef = useRef(null);
    const [clientsOpen, setClientsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);


    useEffect(() => {
        if (isOpen) {
            const contentElement = sideNavContentRef.current;
            if (contentElement) {
                setContentWidth(contentElement.scrollWidth);
            }
        } else {
            setContentWidth(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Use dropdownRef to check if click was inside or outside
            if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
                // Check if the click was on the dropdown
                if (clientsOpen && event.target.closest('.dropdown')) {
                    // Click was on the dropdown, do nothing
                } else {
                    setClientsOpen(false); // Close dropdown
                    setIsOpen(false); // Close sidebar
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [clientsOpen, isOpen]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        async function getClients() {
            const clientsObj = await fetchClients();
            setClients(clientsObj);
            setClientsNamesArray(Object.keys(clientsObj));
        }
        getClients();
    }, []);

    const handleClientSelect = (clientName) => {
        // Do something with the selected client name and spaceid
        const spaceid = clients[clientName];
        setSelectedClient(clientName);
        console.log(clientName, spaceid);
    };


    const navItems = [
        { icon: <FiGrid className='text-xl' />, text: 'Overview', link: '/' },
        { icon: <FontAwesomeIcon icon={faCheckDouble} size="lg" />, text: 'To Dos', link: '/' },
        { icon: <FontAwesomeIcon icon={faGaugeHigh} size="lg" />, text: 'KPIs', link: '/kpi-dashboard' },
        { icon: <FiCpu className='text-xl' />, text: 'Automations', link: '/' },
        { icon: <FontAwesomeIcon icon={faScrewdriverWrench} size="lg" />, text: 'Tools', link: '/' },
        { icon: <FiPlayCircle className='text-xl' />, text: 'Training', link: '/' },
        { icon: <FiUsers className='text-xl' />, text: 'Clients', link: '/', dropdown: true, onClick: () => setClientsOpen(!clientsOpen) },
    ];

    const teamItems = [
        { color: 'bg-blue-300', text: 'Lead Management', link: '/' },
        { color: 'bg-green-400', text: 'Deal Analysis', link: '/' },
        { color: 'bg-yellow-400', text: 'Acquisition Management', link: '/' },
        { color: 'bg-red-400', text: 'Marketing', link: '/' },
    ];

    return (

        <div className="relative z-10">
            <div
                className={`relative flex z-20 transition-all duration-500 ease-out`}
                ref={sideNavRef}
            >
                <div className="relative">
                    <nav className={`absolute top-0 bottom-0 left-0 z-30 flex flex-col px-4 overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 shadow-super-2 lg:shadow-black transition-all duration-500 ease-out ${isOpen ? 'w-68 h-screen' : 'w-20 h-20 lg:h-screen'}`}>
                        <div className="relative flex flex-col flex-grow">
                            <Link className="flex items-center justify-center gap-2 pt-4 pb-2 mx-auto text-xl font-semibold text-white" href="#">
                                <img src="/reia-icon.webp" className="w-6 h-6 mx-auto" alt="" />
                                <p className={`transition-opacity duration-200 ease-in-out whitespace-nowrap ${isOpen ? 'flex opacity-100 overflow-hidden' : 'hidden transition-opacity opacity-0'}`}>REI AUTOMATED</p>
                            </Link>
                            <div>
                                <FiChevronsRight className={`flex text-2xl text-white transition-all duration-300 ease-in-out ${isOpen ? 'transform rotate-180 ml-1.5' : 'mx-auto'}`} onClick={toggleOpen} />
                            </div>
                            <ul className={`relative flex flex-col mt-4 lg:mt-8 lg:space-y-2 ${isOpen ? '' : 'items-center'}`}>
                                {navItems.map((item, index) => (
                                    <li key={index}>
                                        {item.dropdown ? (
                                            <button className="relative flex items-center w-full p-2 space-x-2 text-gray-100 transition-colors duration-200 ease-in-out hover:bg-blue-500 rounded-xl"
                                                onClick={item.onClick}
                                            >
                                                <div className='flex flex-row gap-2 '>
                                                    {item.icon}
                                                    <div className={`flex items-center transition-opacity duration-200 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 w-40' : 'hidden transition-opacity opacity-0'}`}>
                                                        <span className="truncate">{item.text}{selectedClient && `: ` + selectedClient}</span>
                                                    </div>
                                                </div>
                                                {clientsOpen && (
                                                    <div className='absolute top-0 z-40 left-[90%]' onClick={(e) => e.stopPropagation()}>
                                                        <SideNavDropdown
                                                            className="z-50 dropdown"
                                                            options={clientsNamesArray}
                                                            selectedOption={selectedClient}
                                                            onOptionSelected={handleClientSelect}
                                                            defaultValue="Select a client..."
                                                        />
                                                    </div>
                                                )}
                                            </button>

                                        ) : (
                                            <Link href={item.link} className="flex items-center p-2 space-x-2 text-gray-100 transition-colors duration-200 ease-in-out hover:bg-blue-500 rounded-xl">
                                                {item.icon}
                                                <span className={`transition-opacity duration-200 ease-in-out whitespace-nowrap ${isOpen ? 'flex opacity-100 overflow-hidden' : 'hidden transition-opacity opacity-0'}`}>{item.text}</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col items-center mt-4 lg:mt-8">
                                <span className="block mb-2 text-xs font-semibold text-gray-100 uppercase lg:mb-4">Teams</span>
                                <ul>
                                    {teamItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.link}
                                                className="flex items-center p-2 space-x-2 text-gray-100 transition-colors duration-200 ease-in-out hover:bg-blue-500 rounded-xl"
                                            >
                                                <div className={`w-2 h-2 mr-2 rounded-full ${item.color}`}></div>
                                                <span className={`transition-opacity duration-200 ease-in-out whitespace-nowrap ${isOpen ? 'flex opacity-100 overflow-hidden' : 'hidden transition-opacity opacity-0'}`}>{item.text}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col lg:space-y-2">
                            <Link
                                href="/"
                                className="flex items-center p-2 space-x-2 text-gray-100 transition-colors duration-200 ease-in-out hover:bg-blue-500 rounded-xl"
                            >
                                <FiSettings className='text-xl' />
                                <span className={`transition-opacity duration-200 ease-in-out whitespace-nowrap ${isOpen ? 'flex opacity-100 overflow-auto' : 'hidden opacity-0'}`}>Settings</span>
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center p-2 space-x-2 text-gray-100 transition-colors duration-200 ease-in-out hover:bg-blue-500 rounded-xl"
                            >
                                <FiArrowRightCircle className='text-xl' />
                                <span className={`transition-opacity duration-200 ease-in-out whitespace-nowrap ${isOpen ? 'flex opacity-100 overflow-auto' : 'hidden opacity-0'}`}>Log Out</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </div>

    );
}
