import React from 'react';

const TableView = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {keys.map((key) => (
                            <th
                                key={key}
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50 transition-colors duration-150 group">
                            {keys.map((key) => (
                                <td key={key} className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                                        {typeof item[key] === 'object'
                                            ? <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(item[key], null, 2)}</pre>
                                            : item[key]?.toString() || '-'}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableView; 