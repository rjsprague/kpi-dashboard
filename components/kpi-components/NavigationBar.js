export default function NavigationBar({ onQueryTypeChange }) {
  
  const handleQueryTypeClick = (type) => {
    onQueryTypeChange(type);
  };

  return (
    <div className="flex flex-row flex-wrap bg-blue-600 shadow-super-4">
      {/* Add your existing navigation bar content here */}
      <ul className="flex flex-wrap items-center gap-4 m-4 lg:mt-4">        
        <li className="">
          <button
            className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg"
            onClick={() => handleQueryTypeClick('Acquisitions')}
          >
            Acquisitions
          </button>
        </li>        
        <li className="">
          <button
            className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg"
            onClick={() => handleQueryTypeClick('Team')}
          >
            Team
          </button>
        </li>
        <li className="">
          <button
            className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg"
            onClick={() => handleQueryTypeClick('Financial')}
          >
            Financials
          </button>
        </li>
        <li className="">
          <button
            className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg"
            onClick={() => handleQueryTypeClick('Leaderboard')}
          >
            Leaderboard
          </button>
        </li>
      </ul>
    </div>
  );
}
