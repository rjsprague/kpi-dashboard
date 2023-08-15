"use client";
import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi';
import DataTable from './kpi-components/dataTable';
import ReactDOM from 'react-dom';
import useSWR from 'swr';
import fetchSingleKpi from '../lib/fetchSingleKpi';
import LoadingQuotes from './LoadingQuotes';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../app/GlobalRedux/Features/client/clientSlice'

const RightSlideModal = ({
    isOpen,
    handleCloseModal,
    prop,
    viewKpis,
    VIEW_KPIS,
    selectedView,
    modalType,
    selectedKpis,
    setSelectedKpis,
    selectedDepartment,
    className,
    tableProps,
    leadSources,
    departments
}) => {
    const [selectedViewKpiList, setSelectedViewKpiList] = useState([]);
    const [dataTable1, setDataTable1] = useState(null);
    const [dataTable1Key, setDataTable1Key] = useState(null);
    const [dataTable2, setDataTable2] = useState(null);
    const [dataTable2Key, setDataTable2Key] = useState(null);
    const clientSpaceId = useSelector(selectSpaceId);

    // console.log("RightSlideModal: ", selectedView, selectedDepartment, selectedViewKpiList, dataTable1, dataTable1Key, dataTable2, dataTable2Key)

    const { startDate, endDate, leadSource, kpiView, teamMembers, apiName } = tableProps;
    const { data, error } = useSWR({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName }, fetchSingleKpi);
    // console.log(data)

    useEffect(() => {
        if (data) {
            setDataTable1(Object.values(data)[0])
            setDataTable1Key(Object.keys(data)[0])
            setDataTable2(Object.values(data)[1])
            setDataTable2Key(Object.keys(data)[1])
        }
    }, [data])

    useEffect(() => {
        if (clientSpaceId == process.env.NEXT_PUBLIC_CLOSERS_SPACEID) {
            if (selectedView === 'Team') {
                setSelectedViewKpiList(VIEW_KPIS[selectedView]["Closers"][selectedDepartment]);
            } else {
                setSelectedViewKpiList(VIEW_KPIS[selectedView]["Closers"]);
            }
        } else {
            if (selectedView === 'Team') {
                setSelectedViewKpiList(VIEW_KPIS[selectedView]["Clients"][selectedDepartment]);
            } else {
                setSelectedViewKpiList(VIEW_KPIS[selectedView]["Clients"]);
            }
        }
    }, [selectedView, selectedDepartment]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCloseModal();
            }
        };
        const handleClickOutside = (e) => {
            if (!e.target.closest('.infoModal')) {
                handleCloseModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKpiCheckboxChange = (e, kpi) => {
        setSelectedKpis(prevKpis => {
            if (e.target.checked) {
                return [...prevKpis, kpi];
            } else {
                return prevKpis.filter(item => item !== kpi);
            }
        });
    };



    return ReactDOM.createPortal(
        <div
            className={`z-[9999] flex fixed top-0 right-0 ${modalType === 'table' ? 'w-screen' : 'w-screen md:w-3/4 xl:w-2/3 4xl:2-1/2'} h-full transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 9999 }}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    handleCloseModal();
                }
            }}
        >
            <div className="absolute top-0 right-0 flex-col w-full h-screen bg-blue-900 bg-opacity-50 infoModal">
                <button className="absolute font-semibold right-2 top-2" onClick={handleCloseModal}>
                    <FiX />
                </button>
                {modalType === "info" && prop && prop.kpiFactors && (
                    <>
                        <div className="mt-4 text-xl font-bold text-center">
                            {prop.kpiFactors[0].title}
                        </div>
                        <ul>
                            {prop.kpiFactors.map((factor, index) => {
                                if (index > 0) {
                                    return (
                                        <li
                                            key={factor.id}
                                            className="flex flex-row justify-start px-2 py-2 text-sm font-medium text-gray-100 border-b border-gray-200"
                                        >
                                            <div className="flex flex-row items-center w-2/3">
                                                <div className="flex-shrink-0 w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                                                <div className="">{factor.desc}</div>
                                            </div>
                                            <div className="flex flex-row items-center w-1/3 mr-2">
                                                <div className="italic underline transition-colors ease-in-out underline-offset-4 hover:text-white decoration-teal-400">
                                                    <a
                                                        href={factor.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {factor.linkName}
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </ul>
                    </>
                )}

                {modalType === "settings" && (
                    <div className="flex flex-col px-5">
                        <div className="mt-4 text-xl font-bold text-center">{selectedView}</div>
                        <ul className="flex flex-wrap items-center gap-8 px-10 justify-evenly">
                            {/* KPI checkboxes */}
                            {selectedViewKpiList.map((kpi, index) => (
                                <li key={index} className="flex items-center my-2">
                                    <input
                                        type="checkbox"
                                        id={`kpi-checkbox-${index}`}
                                        checked={selectedKpis.includes(kpi)}
                                        onChange={(e) => handleKpiCheckboxChange(e, kpi)}
                                        className="text-blue-600 form-checkbox"
                                    />
                                    <label htmlFor={`kpi-checkbox-${index}`} className="ml-2 text-gray-100">
                                        {kpi}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {modalType === "table" ? (
                    data ? (
                        <div className="flex flex-row justify-center">
                            {error && <div className="text-red-500">Error fetching data</div>}
                            {dataTable1 && <DataTable className="flex" selectedTableKey={dataTable1Key} data={dataTable1} leadSources={leadSources} departments={departments} />}
                            {dataTable2 && <DataTable className="flex" selectedTableKey={dataTable2Key} data={dataTable2} leadSources={leadSources} departments={departments} />}
                        </div>
                    ) : (
                        <LoadingQuotes />
                    )
                ) : null}

            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default RightSlideModal;
