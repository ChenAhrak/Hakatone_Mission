import React from 'react';

const COLORS = {
    primary: '#6366F1',
    secondary: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    error: '#EF4444',
};

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

    const getValueColor = (value) => {
        if (typeof value === 'number') {
            if (value > 0) return 'text-emerald-600';
            if (value < 0) return 'text-red-600';
            return 'text-gray-600';
        }
        return 'text-gray-700';
    };

    return (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <div
                    key={item.id || index}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden hover:border-indigo-200"
                >
                    <div className="p-6 space-y-5">
                        {keys.map((key, keyIndex) => (
                            <div key={key} className="flex flex-col">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </h4>
                                <div className={`text-base ${getValueColor(item[key])} group-hover:text-indigo-600 transition-colors duration-200`}>
                                    {typeof item[key] === 'object' ? (
                                        <pre className="bg-gray-50 text-sm rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-gray-100">
                                            {JSON.stringify(item[key], null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <span>{item[key]?.toString() || '-'}</span>
                                            {typeof item[key] === 'number' && (
                                                <span className={`text-xs ${getValueColor(item[key])}`}>
                                                    {item[key] > 0 ? '↑' : item[key] < 0 ? '↓' : '−'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Item {index + 1}</span>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardView; 