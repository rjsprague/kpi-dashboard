"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiUsers, FiChevronsRight } from "react-icons/fi";
import { FaGoogleDrive } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGaugeHigh,
    faFileAlt,
    faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import fetchClients from "../lib/fetchClients";
import {
    client,
    setClientName,
    setSpaceId,
} from "../GlobalRedux/Features/client/clientSlice";
import { useDispatch } from "react-redux";
import UniversalDropdown from "./kpi-components/UniversalDropdown";
import SidenavDropdownButton from "./SidenavDropdownButton";
import useAuth from "@/hooks/useAuth";

export default function SideNav() {
    const { user, loading, logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);
    const [clients, setClients] = useState({});
    const [clientsNamesArray, setClientsNamesArray] = useState([]);
    const [clientsOpen, setClientsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientFolderID, setClientFolderID] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isScaling, setIsScaling] = useState(false);
    const [isProfessional, setIsProfessional] = useState(false);
    const [isStarter, setIsStarter] = useState(false);

    const sideNavRef = useRef(null);
    const sideNavContentRef = useRef(null);
    const buttonRef = useRef(null);

    const dispatch = useDispatch();

    // console.log(user)

    useEffect(() => {
        if (user && user.isScaling) {
            setClientFolderID(user.settings.google.rootFolderID);
            setIsScaling(true);
        } else if (user && user.isProfessional) {
            setClientFolderID(user.settings.google.propertyFolderID);
            setIsProfessional(true);
        } else if (user && user.isStarter) {
            setClientFolderID(user.settings.google.propertyFolderID);
            setIsStarter(true);
        }

        if (user && user.isAdmin) {
            setIsAdmin(true);
        }
    }, [user]);

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
                if (clientsOpen && event.target.closest(".dropdown")) {
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
                if (clientsOpen && event.target.closest(".dropdown")) {
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
        if (user && user.isAdmin) {
            async function getClients() {
                const clientsObj = await fetchClients();
                setClients(clientsObj);
                setClientsNamesArray(Object.keys(clientsObj));
            }
            getClients();
        }
    }, [user]);

    const handleClientSelect = (clientName) => {
        const spaceid = clients[clientName];
        setSelectedClient(clientName);
        dispatch(setClientName(clientName));
        dispatch(setSpaceId(spaceid));
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsOpen(false);
            setClientsOpen(false);
        }
    };

    const navItems = [
        // { icon: <FontAwesomeIcon icon={faThLarge} size="lg" />, text: 'Overview', link: '/' },
        // { icon: <FontAwesomeIcon icon={faCheckDouble} size="lg" />, text: 'To Dos', link: '/' },
        {
            icon: <FontAwesomeIcon icon={faGaugeHigh} size="xl" />,
            text: "KPIs",
            link: "/kpi-dashboard",
            onClick: () => setIsOpen(false),
        },
        {
            icon: <FontAwesomeIcon icon={faFileAlt} size="xl" />,
            text: "Call Scripts",
            link: "/call-scripts",
            scripts: true,
            onClick: () => setIsOpen(false),
        },
        clientFolderID ? {
                icon: <FaGoogleDrive className="block text-xl" />,
                text: isScaling
                    ? `Files`
                    : isProfessional
                        ? `Property Folders`
                        : isStarter
                            ? `Property Folders`
                            : ``,
                link: `https://drive.google.com/drive/folders/${clientFolderID}`,
                target: "_blank",
                rel: "noopener noreferrer",
            }
            : null,
        {
            icon: <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />,
            text: "Training",
            link: "https://knowledge.reiautomated.io/enrollments",
            target: "_blank",
            rel: "noopener noreferrer",
        },
        {
            icon: <FiUsers className="text-xl" />,
            text: "Clients",
            link: "/",
            clients: true,
            onClick: () => setClientsOpen(!clientsOpen),
        },
    ].filter(Boolean);

    // const teamItems = [
    //     { color: 'bg-blue-300', text: 'Lead Management', link: '/' },
    //     { color: 'bg-green-400', text: 'Deal Analysis', link: '/' },
    //     { color: 'bg-yellow-400', text: 'Acquisition Management', link: '/' },
    //     { color: 'bg-red-400', text: 'Marketing', link: '/' },
    // ];

    return (
        <>
            <div className="fixed z-20 overflow-visible ">
                <div className={`relative flex`} ref={sideNavRef}>
                    <div className="relative">
                        <nav
                            className={`fixed top-0 bottom-0 left-0 flex flex-col pl-3 pr-2 bg-gradient-to-r from-blue-900 to-blue-700 shadow-super-2 lg:shadow-black transition-all duration-300 ease-in-out ${isOpen
                                ? "w-60 h-screen"
                                : "w-20 h-20 lg:h-screen overflow-hidden lg:overflow-visible"
                                }`}
                        >
                            <div className={`relative flex flex-col w-full`}>
                                <div
                                    className={`relative flex flex-row top-0 left-0 mb-10 items-center cursor-pointer gap-1`}
                                    onClick={toggleOpen}
                                >
                                    <Image
                                        src="/reia-icon.webp"
                                        alt="REI Automated Logo"
                                        className="text-white transition-all duration-300 ease-in-out animate-pulse"
                                        width={24}
                                        height={24}
                                        style={{
                                            transform: `${isOpen ? "rotate(360deg)" : "rotate(0deg)"}`,
                                        }}
                                    />
                                    <p className={`text-xl transition-all duration-300 ease-in-out whitespace-nowrap ${isOpen ? "ml-2 w-40 opacity-100" : "w-0 opacity-0"}`}>
                                        REI AUTOMATED
                                    </p>
                                    <FiChevronsRight
                                        className="w-10 h-20 text-xl text-white transition-all duration-300"
                                        style={{
                                            transform: `${isOpen ? "rotate(180deg)" : "rotate(0deg)"}`,
                                        }}
                                    />
                                </div>
                                <ul
                                    className={`relative transition-all ease-in delay-300 flex flex-col mt-8 lg:space-y-2 gap-2 ${isOpen ? "" : "pl-2"
                                        }`}
                                >
                                    {navItems.map((item, index) => (
                                        <li key={index}>
                                            {item.clients ? (
                                                user &&
                                                isAdmin && (
                                                    <div
                                                        ref={buttonRef}
                                                        className="relative flex w-full rounded-md"
                                                        onClick={item.onClick}
                                                        onKeyDown={handleKeyDown}
                                                    >
                                                        <div className="flex flex-row gap-2 p-1 text-left cursor-pointer whitespace-nowrap">
                                                            <span
                                                                className={`transition-all duration-300 ease-out hover:animate-bounce ${isOpen
                                                                    ? "opacity-100"
                                                                    : "opacity-0 lg:opacity-100"
                                                                    }`}
                                                            >
                                                                {item.icon}
                                                            </span>
                                                            <span
                                                                className={`truncate transition-all duration-300 ease-out whitespace-nowrap ${isOpen
                                                                    ? "w-44 overflow-visible opacity-100"
                                                                    : "w-0 overflow-hidden opacity-0"
                                                                    }`}
                                                            >
                                                                {item.text}
                                                                {selectedClient && `: ` + selectedClient}
                                                            </span>
                                                        </div>
                                                        {clientsOpen && (
                                                            <div
                                                                className="absolute top-0 left-[50%]"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <UniversalDropdown
                                                                    options={clientsNamesArray}
                                                                    onOptionSelected={handleClientSelect}
                                                                    selectedOptions={
                                                                        selectedClient ? [selectedClient] : []
                                                                    }
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
                                                <Link
                                                    href={item.link}
                                                    onClick={item.onClick ? item.onClick : null}
                                                    target={item.target ? item.target : ""}
                                                    rel={item.rel ? item.rel : ""}
                                                    className={`flex flex-row gap-2 whitespace-nowrap rounded-md ${isOpen ? "" : ""
                                                        }`}
                                                >
                                                    <div className="flex flex-row gap-2 p-1 text-left whitespace-nowrap ">
                                                        <span
                                                            className={`transition-all duration-300 ease-out hover:animate-bounce ${isOpen
                                                                ? "opacity-100"
                                                                : "opacity-0 lg:opacity-100"
                                                                }`}
                                                        >
                                                            {item.icon}
                                                        </span>
                                                        <span
                                                            className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen
                                                                ? "w-44 overflow-visible opacity-100"
                                                                : "w-0 overflow-hidden opacity-0"
                                                                }`}
                                                        >
                                                            {item.text}
                                                        </span>
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
                            {/* <div className="flex flex-col mb-4 space-y-2 lg:space-y-4">
                            <Link href="/user-profile" className="flex items-center gap-2 rounded-md">
                                <div className='flex flex-row gap-2 text-left whitespace-nowrap '>
                                    <span className={`transition-all duration-300 ease-out origin-center hover:animate-spin ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100 overflow-hidden'}`}><FiSettings className='text-2xl' /></span>
                                    <span className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>Settings</span>
                                </div>
                            </Link>
                            <button type="button" onClick={logout} className="flex items-center gap-2 rounded-md">
                                <div className='flex flex-row gap-2 text-left whitespace-nowrap '>
                                    <span className={`transition-all duration-300 ease-out hover:animate-bounce ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100 overflow-hidden'}`}><FontAwesomeIcon icon={faSignOut} size="xl" /></span>
                                    <span className={`transition-all duration-300 ease-out whitespace-nowrap ${isOpen ? 'w-44 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>Log Out</span>
                                </div>
                            </button>
                        </div> */}
                        </nav>
                    </div>
                </div>
                {isOpen && <div className="w-screen h-screen bg-black bg-opacity-25 -z-50"></div>}
            </div>
        </>
    );
}
