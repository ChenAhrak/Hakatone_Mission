import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const COLORS = [
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#D946EF', // Fuchsia
];

const DataVisualization = ({ items }) => {
    const [activeChart, setActiveChart] = useState('bar');
    const [chartData, setChartData] = useState([]);
    const [numericKeys, setNumericKeys] = useState([]);
    const [categoricalKeys, setCategoricalKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (items && items.length > 0) {
            prepareData();
        }
    }, [items]);

    const prepareData = () => {
        setIsLoading(true);

        // Get all keys from the first item
        const allKeys = Object.keys(items[0]).filter(key => key !== 'id');

        // Separate numeric and categorical keys
        const numeric = [];
        const categorical = [];

        allKeys.forEach(key => {
            if (typeof items[0][key] === 'number') {
                numeric.push(key);
            } else {
                categorical.push(key);
            }
        });

        setNumericKeys(numeric);
        setCategoricalKeys(categorical);

        // Prepare data for charts
        const preparedData = items.map((item, index) => {
            // Get the first key and its value
            const firstKey = allKeys[0];
            const firstValue = item[firstKey];

            // Create data point with the first value as name
            const dataPoint = { name: `${firstValue}` };

            allKeys.forEach(key => {
                if (typeof item[key] === 'number') {
                    dataPoint[key] = item[key];
                } else if (typeof item[key] === 'object') {
                    // For objects, try to extract numeric values
                    const objValues = Object.values(item[key]).filter(val => typeof val === 'number');
                    if (objValues.length > 0) {
                        dataPoint[`${key}_avg`] = objValues.reduce((a, b) => a + b, 0) / objValues.length;
                    }
                }
            });

            return dataPoint;
        });

        setChartData(preparedData);

        // Select first 3 numeric keys by default
        setSelectedKeys(numeric.slice(0, 3));
        setIsLoading(false);
    };

    const handleKeyToggle = (key) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter(k => k !== key));
        } else {
            setSelectedKeys([...selectedKeys, key]);
        }
    };

    const renderChart = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            );
        }

        switch (activeChart) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
                            <Legend />
                            {selectedKeys.map((key, index) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={COLORS[index % COLORS.length]}
                                    name={key.replace(/([A-Z])/g, ' $1').trim()}
                                    radius={[4, 4, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
                            <Legend />
                            {selectedKeys.map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COLORS[index % COLORS.length]}
                                    name={key.replace(/([A-Z])/g, ' $1').trim()}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
                            <Legend />
                            {selectedKeys.map((key, index) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke={COLORS[index % COLORS.length]}
                                    name={key.replace(/([A-Z])/g, ' $1').trim()}
                                    fillOpacity={0.6}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No data available for visualization</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveChart('bar')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === 'bar'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Bar Chart
                    </button>
                    <button
                        onClick={() => setActiveChart('line')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === 'line'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Line Chart
                    </button>
                    <button
                        onClick={() => setActiveChart('area')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === 'area'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Area Chart
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {numericKeys.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleKeyToggle(key)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedKeys.includes(key)
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-80">
                    {renderChart()}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">סיכום נתונים</h3>
                    <div className="space-y-4">
                        {numericKeys.map((key) => {
                            const values = chartData.map(item => item[key]).filter(val => !isNaN(val));
                            const sum = values.reduce((a, b) => a + b, 0);
                            const avg = sum / values.length;
                            const min = Math.min(...values);
                            const max = Math.max(...values);

                            return (
                                <div key={key} className="border-b border-gray-100 pb-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-gray-50 p-2 rounded text-center">
                                            <p className="text-xs text-gray-500">ממוצע</p>
                                            <p className="text-sm font-medium text-indigo-600">{avg.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded text-center">
                                            <p className="text-xs text-gray-500">טווח</p>
                                            <p className="text-sm font-medium text-indigo-600">{min.toFixed(2)} - {max.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataVisualization; 