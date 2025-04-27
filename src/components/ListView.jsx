import React from 'react';

const ListView = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                <p className="mt-1 text-sm text-gray-500">Please select a different data source.</p>
            </div>
        );
    }

    // Get all unique keys from the items
    const keys = Array.from(
        new Set(
            items.flatMap(item => Object.keys(item))
        )
    ).filter(key => key !== 'id');

    return (
        <div className="space-y-6">
            {items.map((item, index) => (
                <div key={item.id || index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {keys.map((key) => (
                                <div key={key} className="flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </h3>
                                    <div className="text-base text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                                        {typeof item[key] === 'object'
                                            ? <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-lg">{JSON.stringify(item[key], null, 2)}</pre>
                                            : item[key]?.toString() || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListView; 