import { useState, useEffect } from "react";
import Dropdown from './Dropdown';
//import fetchSeats from '../../lib/fetchSeats';

function SeatDropdown(props) {
    const [seats, setSeats] = useState([]);
    
    setSeats["All", "Lead Manager", "Acquisition Manager", "Deal Analyst"]
    /*
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await fetchSeats();
            setSeats(sources);
        };
        fetchSources();
    }, []);
*/
    const optionDisplayName = (optionValue) => {
        // Return the display name for the given option value
        return Object.keys(seats).find(key => seats[key] === optionValue);
    }

    return (
        <Dropdown
            options={seats}
            optionDisplayName={optionDisplayName}
            {...props}
        />
    );
}

export default SeatDropdown;