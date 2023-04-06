import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi';


const RightSlideModal = ({ isOpen, handleCloseModal, prop }) => {

  console.log("prop", prop)

  // Close the modal on escape key press and on clicking outside the modal
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

  return (
    <div
  className={`fixed top-0 right-0 w-1/4 h-full transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1000 }}
>
  <div className="absolute top-0 right-0 w-full h-screen bg-blue-900 bg-opacity-50 infoModal">
    <button className="absolute right-2 top-2" onClick={handleCloseModal}>
      <FiX />
    </button>
    {prop && prop.kpiFactors && (
      <div className="mt-4 text-xl font-bold text-center">
        {prop.kpiFactors[0].title}
      </div>
    )}
    <ul>
      {prop && prop.kpiFactors ? (
        prop.kpiFactors.map((factor, index) => {
          if (index > 0) {
            return (
              <li
                key={factor.id}
                className="flex flex-row justify-start px-2 py-2 text-sm font-medium text-gray-100 border-b border-gray-200"
              >
                <div className="flex flex-row items-center w-2/3">
                  <div className="flex-shrink-0 w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                  <div className=''>{factor.desc}</div>
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
        })
      ) : (
        <div>"TBD"</div>
      )}
    </ul>
  </div>
</div>

  );
};

export default RightSlideModal;
