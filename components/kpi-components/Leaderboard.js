import { useState, useEffect } from 'react';
import axios from 'axios';
import QueryPanel from './QueryPanel';
import AnimateHeight from 'react-animate-height';
import ServiceUnavailable from '../ServiceUnavailable';
import RightSlideModal from '../RightSlideModal';
import SelectDropdown from './SelectDropdown';

const currencyToNumber = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[$,]/g, ''));
};

const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter(item => {
        const duplicate = seen.has(item.workspace);
        seen.add(item.workspace);
        return !duplicate;
    });
};

export default function Leaderboard({
    view,
    VIEW_KPIS,
    query,
    kpiList,
    onKpiListChange,
    onToggleQuery,
    onRemoveQuery,
}) {
    const [costPerContractTop3, setCostPerContractTop3] = useState([]);
    const [costPerQualifiedLeadTop3, setCostPerQualifiedLeadTop3] = useState([]);
    const [speedToLeadTop3, setSpeedToLeadTop3] = useState([]);
    const [signedContractsTop3, setSignedContractsTop3] = useState([]);
    const [dealsTop3, setDealsTop3] = useState([]);
    const [year, setYear] = useState('2023');
    const [month, setMonth] = useState('February');
    const [error, setError] = useState(null);
    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedKpis, setSelectedKpis] = useState(kpiList);

    const kpis = [
        {
            name: 'Cost Per Contract',
            data: costPerContractTop3,
        },
        {
            name: 'Cost Per Qualified Lead',
            data: costPerQualifiedLeadTop3,
        },
        {
            name: 'Speed to Lead',
            data: speedToLeadTop3,
        },
        {
            name: '# of Signed Contracts',
            data: signedContractsTop3,
        },
        {
            name: '# of Deals',
            data: dealsTop3,
        },
    ];

    const years = ['2023'];  // update this list as needed
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/leaderboard?year=${year}&month=${month}`);
                const data = response.data;

                //console.log('data', data)

                const costPerContractData = [];
                const costPerQualifiedLeadData = [];
                const speedToLeadData = [];
                const signedContractsData = [];
                const dealsData = [];

                data.forEach(item => {
                    const costPerContract = currencyToNumber(item.cost_per_contract);
                    const costPerQualifiedLead = currencyToNumber(item.cost_per_qualified_lead);
                    const speedToLeadMedian = parseInt(item.speed_to_lead_median || 0, 10);
                    const contracts = parseInt(item.contracts || 0, 10);
                    const deals = parseInt(item.deals || 0, 10);

                    if (costPerContract !== 0) {
                        costPerContractData.push({ workspace: item.workspace, metric: costPerContract });
                    }
                    if (costPerQualifiedLead !== 0) {
                        costPerQualifiedLeadData.push({ workspace: item.workspace, metric: costPerQualifiedLead });
                    }
                    if (speedToLeadMedian !== 0) {
                        speedToLeadData.push({ workspace: item.workspace, metric: speedToLeadMedian });
                    }
                    if (contracts !== 0) {
                        signedContractsData.push({ workspace: item.workspace, metric: contracts });
                    }
                    if (deals !== 0) {
                        dealsData.push({ workspace: item.workspace, metric: deals });
                    }
                });

                //console.log('costPerContractData', costPerContractData)
                //console.log('costPerQualifiedLeadData', costPerQualifiedLeadData)
                //console.log('speedToLeadData', speedToLeadData)
                //console.log('signedContractsData', signedContractsData)
                //console.log('dealsData', dealsData)

                setCostPerContractTop3(removeDuplicates(costPerContractData).sort((a, b) => a.metric - b.metric).slice(0, 3));
                setCostPerQualifiedLeadTop3(removeDuplicates(costPerQualifiedLeadData).sort((a, b) => a.metric - b.metric).slice(0, 3));
                setSpeedToLeadTop3(removeDuplicates(speedToLeadData).sort((a, b) => a.metric - b.metric).slice(0, 3));
                setSignedContractsTop3(removeDuplicates(signedContractsData).sort((a, b) => b.metric - a.metric).slice(0, 3));
                setDealsTop3(removeDuplicates(dealsData).sort((a, b) => b.metric - a.metric).slice(0, 3));

                setError(null);
            } catch (error) {
                setError('Failed to fetch data');
                return <ServiceUnavailable />
            }
        };

        fetchData();
    }, [year, month]);

    //console.log("costPerContractTop3", costPerContractTop3);
    //console.log("costPerQualifiedLeadTop3", costPerQualifiedLeadTop3);
    //console.log("speedToLeadTop3", speedToLeadTop3);
    //console.log("signedContractsTop3", signedContractsTop3);
    //console.log("dealsTop3", dealsTop3);

    const handleToggleQuery = () => {
        onToggleQuery(query.id);
        setHeight(height === 0 ? 'auto' : 0);
    };

    const handleRemoveQuery = () => {
        onRemoveQuery && onRemoveQuery(query.id);
    };

    const handleGearIconClick = () => {
        setModalType("settings");
        setOpenModal(true);
    };

    const handleYearChange = (selectedYear) => {
        setYear(selectedYear);
    };

    const handleMonthChange = (selectedMonth) => {
        setMonth(selectedMonth);
    };

    if (error) {
        return <ServiceUnavailable />;
    }

    return (
        <div className="mb-2">
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleGearIconClick={handleGearIconClick} handleRemoveQuery={handleRemoveQuery}>
                <SelectDropdown
                    options={years}
                    onOptionSelected={handleYearChange}
                    defaultValue={year}
                />
                <SelectDropdown
                    options={months}
                    onOptionSelected={handleMonthChange}
                    defaultValue={month}
                />
            </QueryPanel>
            <AnimateHeight duration={500} height={height}>

                <div className="flex flex-col flex-wrap justify-center w-full gap-2 px-2 py-2 bg-blue-300 rounded-lg sm:flex-row shadow-super-4">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-blue-100 rounded-lg xl:w-76 shadow-super-4">
                            <div className="px-2 py-4 m-2 font-bold tracking-wider text-center text-blue-900 uppercase bg-white rounded-lg text-md shadow-super-4">
                                {kpi.name}
                            </div>
                            {['1st', '2nd', '3rd'].map((rank, i) => (
                                <div key={i} className="flex flex-row justify-between gap-2 px-4 py-3 mx-3 my-2 text-sm text-blue-800 bg-white rounded-lg shadow-super-4">
                                    <div className={` mr-1 ${i === 0 ? 'font-extrabold' : i === 1 ? 'font-bold' : 'font-semibold'}`}>{rank}</div>
                                    {
                                        kpi.data[i]?.metric ?
                                            <div className='w-40 overflow-clip whitespace-nowrap'>
                                                <span className={`${i === 0 ? 'font-extrabold' : i === 1 ? 'font-bold' : 'font-semibold'}`}>{kpi.data[i]?.workspace}</span>
                                            </div>
                                            :
                                            <div className=''>
                                                <span className={` ${i === 0 ? 'font-extrabold' : i === 1 ? 'font-bold' : 'font-semibold'}`}>-</span>
                                            </div>
                                    }
                                    <div>
                                        {
                                            kpi.data[i]?.metric ?
                                                <span className={` ${i === 0 ? 'font-extrabold' : i === 1 ? 'font-bold' : 'font-semibold'}`}>{kpi.name === "Cost Per Contract" || kpi.name === "Cost Per Qualified Lead" ? " $" + kpi.data[i]?.metric : " " + kpi.data[i]?.metric}</span>
                                                :
                                                <span className={` ${i === 0 ? 'font-extrabold' : i === 1 ? 'font-bold' : 'font-semibold'}`}>-</span>
                                        }

                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <RightSlideModal
                    isOpen={openModal}
                    handleCloseModal={() => setOpenModal(false)}
                    prop={null}
                    viewKpis={kpiList}
                    VIEW_KPIS={VIEW_KPIS}
                    selectedView={view}
                    onKpiListChange={onKpiListChange}
                    modalType={modalType}
                    selectedKpis={selectedKpis}
                    setSelectedKpis={setSelectedKpis}
                />
            </AnimateHeight>
        </div>
    );
}
