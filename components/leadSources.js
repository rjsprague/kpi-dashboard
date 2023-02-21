import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function leadSources() {
    const [leadSource, setLeadSource] = useState("All");
    const { data, error, isLoading } = useSWR(`/api/lead-sources`, fetcher);

    if (error) return <div> "An error has occurred."</div>;
    if (isLoading) return <div> "Loading..." </div>;

    return (
      <div>
        <label>
            Lead Source:
        </label>
        <select id="leadSource" className="p-2 border rounded text-blue-800" value={leadSource} onChange={e => setLeadSource(e.target.value)}>
          <option value="all">All</option>
          {data.map(value => ( <option key={value} value={value}>{value}</option> ))}
        </select>
      </div>
    )
}