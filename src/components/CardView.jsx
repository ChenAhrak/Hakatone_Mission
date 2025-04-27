import React from 'react';

const CardView = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-gray-500 bg-white rounded-2xl shadow-md border border-gray-200">
                <svg
                    className="h-14 w-14 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">No data available</h3>
                <p className="text-sm text-gray-500 mt-2">Please select a different data source.</p>
            </div>
        );
    }

    const keys = Array.from(
        new Set(items.flatMap(item => Object.keys(item)))
    ).filter(key => key !== 'id');

    return (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <div
                    key={item.id || index}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
                >
                    <div className="p-6 space-y-5">
                        {keys.map(key => (
                            <div key={key} className="flex flex-col">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </h4>
                                <div className="text-base text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                                    {typeof item[key] === 'object' ? (
                                        <pre className="bg-gray-50 text-sm rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(item[key], null, 2)}
                                        </pre>
                                    ) : (
                                        item[key]?.toString() || '-'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardView; 