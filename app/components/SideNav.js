"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiPlayCircle, FiUsers, FiSettings, FiArrowRightCircle, FiMenu, FiChevronsRight } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faCheckDouble, faGaugeHigh, faScrewdriverWrench, faThLarge, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import fetchClients from '../lib/fetchClients';
import { setClientName, setSpaceId } from '../GlobalRedux/Features/client/clientSlice'
import { useDispatch } from 'react-redux';
import UniversalDropdown from './kpi-components/UniversalDropdown';
import SidenavDropdownButton from './SidenavDropdownButton';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SideNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);
    const [clients, setClients] = useState({});
    const [clientsNamesArray, setClientsNamesArray] = useState([]);
    const sideNavRef = useRef(null);
    const sideNavContentRef = useRef(null);
    const [clientsOpen, setClientsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const buttonRef = useRef(null);
    const router = useRouter();

    const { data: user, error: userError } = useSWR('/auth/getUser', fetcher);

    // console.log(user)
    const IsAdmin = user && user.IsAdmin === true ? true : false;
    // console.log(IsAdmin)
    // console.log(userError)

    const dispatch = useDispatch();

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
            if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
                if (clientsOpen && event.target.closest('.dropdown')) {
                } else {
                    setIsOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                if (clientsOpen && event.target.closest('.dropdown')) {
                } else {
                    setClientsOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [clientsOpen]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (user && user.IsAdmin) {
            async function getClients() {
                const clientsObj = await fetchClients();
                setClients(clientsObj);
                setClientsNamesArray(Object.keys(clientsObj));
            }
            getClients();
        }
    }, [user]);

    const handleClientSelect = (clientName) => {
        // Do something with the selected client name and spaceid
        const spaceid = clients[clientName];
        setSelectedClient(clientName);
        dispatch(setClientName(clientName));
        dispatch(setSpaceId(spaceid));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            setClientsOpen(false);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                // Redirect to login page
                router.push('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        } finally {
            router.push('/login');
        }
    };

    const navItems = [
        // { icon: <FontAwesomeIcon icon={faThLarge} size="lg" />, text: 'Overview', link: '/' },
        // { icon: <FontAwesomeIcon icon={faCheckDouble} size="lg" />, text: 'To Dos', link: '/' },
        { icon: <FontAwesomeIcon icon={faGaugeHigh} size="lg" />, text: 'KPIs', link: '/kpi-dashboard' },
        // { icon: <FontAwesomeIcon icon={faRobot} size="lg" />, text: 'Automations', link: '/' },
        // { icon: <FontAwesomeIcon icon={faScrewdriverWrench} size="lg" />, text: 'Tools', link: '/' },
        // { icon: <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />, text: 'Training', link: '/' },
        { icon: <FiUsers className='text-xl' />, text: 'Clients', link: '/', dropdown: true, onClick: () => setClientsOpen(!clientsOpen) },
    ];

    // const teamItems = [
    //     { color: 'bg-blue-300', text: 'Lead Management', link: '/' },
    //     { color: 'bg-green-400', text: 'Deal Analysis', link: '/' },
    //     { color: 'bg-yellow-400', text: 'Acquisition Management', link: '/' },
    //     { color: 'bg-red-400', text: 'Marketing', link: '/' },
    // ];

    return (

        <div className="relative z-10 overflow-visible">
            <div
                className={`relative flex`}
                ref={sideNavRef}
            >
                <div className="relative">
                    <nav className={`absolute top-0 bottom-0 left-0 flex flex-col pl-5 pr-2 bg-gradient-to-r from-blue-900 to-blue-700 shadow-super-2 lg:shadow-black transition-all duration-300 ease-in-out ${isOpen ? 'w-60 h-screen' : 'w-20 h-20 lg:h-screen overflow-hidden lg:overflow-visible'}`}>
                        <div className={`relative flex flex-col flex-grow`}>
                            <div className={`relative flex flex-row top-5 left-1 mb-10`}>
                                <img
                                    src="/reia-icon.webp"
                                    alt="REI Automated Logo"
                                    className="w-8 h-8 text-white transition-all duration-300 ease-in-out"
                                    onClick={toggleOpen}
                                    style={{ transform: `${isOpen ? 'rotate(360deg)' : 'rotate(0deg)'}` }}
                                />
                                <p className={`text-xl transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? 'ml-2 w-40 opacity-100' : 'w-0 opacity-0'}`}>REI AUTOMATED</p>
                            </div>
                            <ul className={`relative flex flex-col mt-8 lg:space-y-2 gap-2 ${isOpen ? '' : ''}`}>
                                {navItems.map((item, index) => (
                                    <li key={index}>
                                        {item.dropdown ? (
                                            user && IsAdmin && (
                                                <div
                                                    ref={buttonRef}
                                                    className="relative flex w-full rounded-md hover:bg-blue-500"
                                                    onClick={item.onClick}
                                                    onKeyDown={handleKeyDown}
                                                >
                                                    <div className='flex flex-row gap-2 p-1 text-left whitespace-nowrap '>
                                                        <span className={`transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>{item.icon}</span>
                                                        <span className={`truncate transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>{item.text}{selectedClient && `: ` + selectedClient}</span>
                                                    </div>
                                                    {clientsOpen && (
                                                        <div
                                                            className='absolute top-0 left-[50%]'
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <UniversalDropdown
                                                                options={clientsNamesArray}
                                                                onOptionSelected={handleClientSelect}
                                                                selectedOptions={selectedClient ? [selectedClient] : []}
                                                                queryId={null}
                                                                isSingleSelect={true}
                                                                isLoadingData={null}
                                                                className={"dropdown"}
                                                                ButtonComponent={SidenavDropdownButton}
                                                                defaultValue={"Select a client..."}
                                                                showButton={clientsOpen}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )

                                        ) : (
                                            <Link href={item.link} className={`flex flex-row gap-2 whitespace-nowrap hover:bg-blue-500 rounded-md ${isOpen ? '' : ''}`}>
                                                <div className='flex flex-row gap-2 p-1 text-left whitespace-nowrap '>
                                                    <span className={`transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>{item.icon}</span>
                                                    <span className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>{item.text}</span>
                                                </div>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {/* <span className={`block mt-4 mb-2 text-xs font-semibold uppercase lg:mb-4 transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>Teams</span>
                            <ul className='flex flex-col gap-2'>
                                {teamItems.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.link} className="flex flex-row items-center rounded-md hover:bg-blue-500">
                                            <div className='flex flex-row gap-1 text-left whitespace-nowrap '>
                                                <div className={`w-2 h-2 m-2 rounded-full transition-all duration-300 ease-out ${item.color} ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100 overflow-hidden'}`}></div>
                                                <span className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>{item.text}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                        <div className="flex flex-col mb-4 space-y-2 lg:space-y-4">
                            <Link href="/user-profile" className="flex items-center gap-2 rounded-md hover:bg-blue-500">
                                <div className='flex flex-row gap-2 text-left whitespace-nowrap '>
                                    <span className={`transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100 overflow-hidden'}`}><FiSettings className='text-xl' /></span>
                                    <span className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>Settings</span>
                                </div>
                            </Link>
                            <button type="button" onClick={logout} className="flex items-center gap-2 rounded-md hover:bg-blue-500">
                                <div className='flex flex-row gap-2 text-left whitespace-nowrap '>
                                    <span className={`transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100 overflow-hidden'}`}><FiArrowRightCircle className='text-xl' /></span>
                                    <span className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>Log Out</span>
                                </div>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </div>

    );
}
