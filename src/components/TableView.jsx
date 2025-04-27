import React, { useState } from 'react';

const TableView = ({ items }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

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

    const keys = Array.from(
        new Set(items.flatMap(item => Object.keys(item)))
    ).filter(key => key !== 'id');

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedItems = () => {
        if (!sortConfig.key) return items;

        return [...items].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const getFilteredItems = () => {
        if (!searchTerm) return getSortedItems();

        return getSortedItems().filter(item =>
            Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const getValueColor = (value) => {
        if (typeof value === 'number') {
            if (value > 0) return 'text-emerald-600';
            if (value < 0) return 'text-red-600';
            return 'text-gray-600';
        }
        return 'text-gray-700';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="חיפוש..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {keys.map((key) => (
                                <th
                                    key={key}
                                    onClick={() => handleSort(key)}
                                    className="px-8 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                >
                                    <div className="flex items-center justify-end space-x-1">
                                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                        {sortConfig.key === key && (
                                            <span className="text-indigo-600">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredItems().map((item, index) => (
                            <tr
                                key={item.id || index}
                                className="hover:bg-gray-50 transition-colors duration-150 group"
                            >
                                {keys.map((key) => (
                                    <td key={key} className="px-8 py-5 whitespace-normal">
                                        <div className={`text-base ${getValueColor(item[key])} group-hover:text-indigo-600 transition-colors duration-150`}>
                                            {typeof item[key] === 'object' ? (
                                                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    {JSON.stringify(item[key], null, 2)}
                                                </pre>
                                            ) : (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <span>{item[key]?.toString() || '-'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableView; 