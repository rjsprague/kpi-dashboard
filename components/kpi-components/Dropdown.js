// Define a Dropdown component

function Dropdown({ selectedOption, onOptionSelected, data, queryId }) {
    return (
        <select
            className="px-1 h-8 rounded-md text-blue-800 ${isLoading && animate-pulse}"
            value={selectedOption}
            onChange={(e) => onOptionSelected(e, queryId)}>
                <option>All</option>
            {Object.entries(data).map(([key, value]) => (
                <option key={key} value={key}>
                    {value}
                </option>
            ))}
        </select>
    );
}


export default Dropdown;