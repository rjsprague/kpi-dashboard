import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


const ClosersDateSelector = ({ selectedDay, selectedWeek, selectedMonth, selectedYear, days, weeks, months, years, onDayChange, onWeekChange, onMonthChange, onYearChange }) => {

    const handleDaySelection = (value) => {
        onDayChange(selectedYear, selectedMonth, value);
    };

    const handleWeekSelection = (value) => {
        onWeekChange(selectedYear, selectedMonth, value, selectedDay);
    };

    const handleMonthSelection = (value) => {
        onMonthChange(selectedYear, value);
    };

    const handleYearSelection = (value) => {
        onYearChange(value, selectedMonth);
    };

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
             <Listbox as="div" value={selectedYear} onChange={handleYearSelection} className="relative flex flex-row items-center justify-center gap-2">
                {/* Year Selector */}
                <Listbox.Label>Year:</Listbox.Label>
                <Listbox.Button className="relative w-full py-1 pl-3 pr-10 text-left text-black bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedYear}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 w-full py-1 overflow-y-scroll text-base text-black bg-white rounded-md shadow-lg h-60 top-10 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {years.map((year, index) => (
                            <Listbox.Option
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                key={index}
                                value={year}>
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {year}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>

            <Listbox as="div" value={selectedMonth} onChange={handleMonthSelection} className="relative flex flex-row items-center justify-center gap-2">
                {/* Month Selector */}
                <Listbox.Label>Month:</Listbox.Label>
                <Listbox.Button className="relative w-full py-1 pl-3 pr-10 text-left text-black bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedMonth}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 w-full py-1 overflow-y-scroll text-base text-black bg-white rounded-md shadow-lg h-60 top-10 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {months.map((month, index) => (
                            <Listbox.Option
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                key={index}
                                value={month}>
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {month}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>

            <Listbox as="div" value={selectedDay} onChange={handleDaySelection} className="relative flex flex-row items-center justify-center gap-2">
                {/* Day Selector */}
                <Listbox.Label>Day:</Listbox.Label>
                <Listbox.Button className="relative w-full py-1 pl-3 pr-10 text-left text-black bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedDay}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 w-full py-1 overflow-auto text-base text-black bg-white rounded-md shadow-lg h-60 top-10 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {days.map((day, index) => (
                            <Listbox.Option
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                key={index}
                                value={day}>
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {day}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>

            <Listbox as="div" value={selectedWeek} onChange={handleWeekSelection} className="relative flex flex-row items-center justify-center gap-2">
                {/* Week Selector */}
                <Listbox.Label>Week:</Listbox.Label>
                <Listbox.Button className="relative w-full py-1 pl-3 pr-10 text-left text-black bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedWeek}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 w-full py-1 overflow-auto text-base text-black bg-white rounded-md shadow-lg top-10 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {weeks.map((week, index) => (
                            <Listbox.Option
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                key={index}
                                value={week}>
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {week}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox>

        </div>
    );
};

export default ClosersDateSelector;
