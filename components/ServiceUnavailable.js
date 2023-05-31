// ServiceUnavailable.js
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ServiceUnavailable({ small = false }) {
    const smallStyles = small ? 'text-sm' : 'text-2xl';
    
    return (
        <div className={`flex items-center justify-center  text-center bg-white rounded-md shadow-super-4 ${small ? 'text-sm flex-row gap-1 px-2 py-1 h-8' : 'text-lg flex-col px-4 py-2 w-full h-full'}`}>
            <FontAwesomeIcon
                icon={faExclamationTriangle}
                size={small ? "1x" : "3x"}
                className='text-red-500'
            />
            <h1 className={`font-bold text-gray-700 ${smallStyles}`}>
                Service Unavailable
            </h1>
            <p className={`text-gray-500 ${small ? 'hidden' : 'text-base'}`}>
                Please try again later.
            </p>
        </div>
    );
}
