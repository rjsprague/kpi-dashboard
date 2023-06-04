import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Leaderboard() {
    const [costPerContractData, setCostPerContractData] = useState([]);
    const [costPerQualifiedLeadData, setCostPerQualifiedLeadData] = useState([]);
    const [speedToLeadData, setSpeedToLeadData] = useState([]);
    const [signedContractsData, setSignedContractsData] = useState([]);
    const [dealsData, setDealsData] = useState([]);
    const [year, setYear] = useState('2023');
    const [month, setMonth] = useState('February');
    const [error, setError] = useState(null);

    const years = ['2023'];  // update this list as needed
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/leaderboard?year=${year}&month=${month}`);
                const data = response.data;
    
                const costPerContractData = [];
                const costPerQualifiedLeadData = [];
                const speedToLeadData = [];
                const signedContractsData = [];
                const dealsData = [];
    
                data.forEach(item => {
                    const costPerContract = parseFloat(item.cost_per_contract.replace('$', '') || 0);
                    const costPerQualifiedLead = parseFloat(item.cost_per_qualified_lead.replace('$', '') || 0);
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
    
                setCostPerContractData(costPerContractData.sort((a, b) => a.metric - b.metric).slice(0, 3));
                setCostPerQualifiedLeadData(costPerQualifiedLeadData.sort((a, b) => a.metric - b.metric).slice(0, 3));
                setSpeedToLeadData(speedToLeadData.sort((a, b) => a.metric - b.metric).slice(0, 3));
                setSignedContractsData(signedContractsData.sort((a, b) => b.metric - a.metric).slice(0, 3));
                setDealsData(dealsData.sort((a, b) => b.metric - a.metric).slice(0, 3));
    
                setError(null);
            } catch (error) {
                setError('Failed to fetch data');
            }
        };
    
        fetchData();
    }, [year, month]);
    
    
    

    console.log("costPerContractData", costPerContractData);
    console.log("costPerQualifiedLeadData", costPerQualifiedLeadData);
    console.log("speedToLeadData", speedToLeadData);
    console.log("signedContractsData", signedContractsData);
    console.log("dealsData", dealsData);
    



    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center text-blue-900">
            <label>
                Year:
                <select value={year} onChange={handleYearChange}>
                    {years.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
            </label>

            <label>
                Month:
                <select value={month} onChange={handleMonthChange}>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>
            </label>

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Rank
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Cost Per Contract
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Cost Per Qualified Lead
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Speed to Lead
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            # of Signed Contracts
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            # of Deals
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {['1st', '2nd', '3rd'].map((rank, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{rank}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{costPerContractData[i]?.workspace}: {costPerContractData[i]?.metric}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{costPerQualifiedLeadData[i]?.workspace}: {costPerQualifiedLeadData[i]?.metric}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{speedToLeadData[i]?.workspace}: {speedToLeadData[i]?.metric}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{signedContractsData[i]?.workspace}: {signedContractsData[i]?.metric}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{dealsData[i]?.workspace}: {dealsData[i]?.metric}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
