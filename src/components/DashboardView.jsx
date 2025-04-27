import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
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
import trends from '../data/trends.json';
import correlations from '../data/correlations.json';
import analysisByDay from '../data/analysisByDay.json';
import analysisByHours from '../data/analysisByHours.json';
import analysisSeasons from '../data/analysisSeasons.json';
import peakDays from '../data/peakDays.json';
import earlyResolution from '../data/earlyResolution.json';

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

const DashboardView = () => {
    const [activeTab, setActiveTab] = useState('trends');
    const [timeRange, setTimeRange] = useState('all');

    // Format date from timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Format day name to Hebrew
    const formatDayName = (dayName) => {
        const dayMap = {
            'Sunday': 'ראשון',
            'Monday': 'שני',
            'Tuesday': 'שלישי',
            'Wednesday': 'רביעי',
            'Thursday': 'חמישי',
            'Friday': 'שישי',
            'Saturday': 'שבת'
        };
        return dayMap[dayName] || dayName;
    };

    // Format peak day for display
    const formatPeakDay = (day) => {
        // Extract the day number from the Hebrew day name (e.g., "יום ראשון" -> "1")
        const dayMap = {
            'יום ראשון': '1',
            'יום שני': '2',
            'יום שלישי': '3',
            'יום רביעי': '4',
            'יום חמישי': '5',
            'יום שישי': '6',
            'יום שבת': '7'
        };
        return dayMap[day] || day;
    };

    // Filter trends data based on time range
    const getFilteredTrends = () => {
        if (timeRange === 'all') return trends;

        const now = new Date();
        const ranges = {
            'year': new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
            '6months': new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
            '3months': new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
            'month': new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        };

        return trends.filter(item => new Date(item.תאריך) >= ranges[timeRange]);
    };

    // Calculate summary statistics for trends
    const getTrendsSummary = () => {
        const filteredData = getFilteredTrends();

        const totalRequests = filteredData.reduce((sum, item) => sum + item['מספר פניות'], 0);
        const avgProcessingTime = filteredData.reduce((sum, item) => sum + item['זמן טיפול ממוצע'], 0) / filteredData.length;
        const avgDeviationRate = filteredData.reduce((sum, item) => sum + item['אחוז פניות בחריגה'], 0) / filteredData.length;

        return {
            totalRequests,
            avgProcessingTime: Number(avgProcessingTime.toFixed(2)),
            avgDeviationRate: Number(avgDeviationRate.toFixed(2))
        };
    };

    // Prepare data for correlation heatmap
    const prepareCorrelationData = () => {
        const metrics = correlations.map(item => item['Unnamed: 0']);
        const data = [];

        metrics.forEach((metric, i) => {
            const row = { metric };
            metrics.forEach((otherMetric, j) => {
                row[otherMetric] = correlations[i][otherMetric];
            });
            data.push(row);
        });

        return data;
    };

    // Render correlation heatmap
    const renderCorrelationHeatmap = () => {
        const data = prepareCorrelationData();
        const metrics = correlations.map(item => item['Unnamed: 0']);

        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-right">מטריצת קורלציות</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-right">מדד</th>
                                {metrics.map(metric => (
                                    <th key={metric} className="px-4 py-2 text-center">{metric}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="border-t">
                                    <td className="px-4 py-2 font-medium text-right">{row.metric}</td>
                                    {metrics.map(metric => {
                                        const value = row[metric];
                                        const color = value > 0.5 ? 'bg-green-100' :
                                            value > 0 ? 'bg-blue-100' :
                                                value < -0.5 ? 'bg-red-100' :
                                                    'bg-gray-100';

                                        return (
                                            <td key={metric} className={`px-4 py-2 text-center ${color}`}>
                                                {Number(value).toFixed(2)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render trends charts
    const renderTrendsCharts = () => {
        const filteredData = getFilteredTrends();
        const summary = getTrendsSummary();

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm text-right">סה"כ פניות</h3>
                        <p className="text-2xl font-bold text-right">{summary.totalRequests.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm text-right">זמן טיפול ממוצע</h3>
                        <p className="text-2xl font-bold text-right">{summary.avgProcessingTime} שעות</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm text-right">אחוז חריגה ממוצע</h3>
                        <p className="text-2xl font-bold text-right">{summary.avgDeviationRate}%</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Requests Over Time */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">פניות לאורך זמן</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="תאריך" tickFormatter={formatDate} />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip labelFormatter={formatDate} />
                                    <Legend />
                                    <Line type="monotone" dataKey="מספר פניות" stroke="#8884d8" name="מספר פניות" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Processing Time Trend */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">מגמת זמן טיפול</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="תאריך" tickFormatter={formatDate} />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip labelFormatter={formatDate} />
                                    <Legend />
                                    <Line type="monotone" dataKey="זמן טיפול ממוצע" stroke="#82ca9d" name="זמן טיפול ממוצע" />
                                    <Line type="monotone" dataKey="זמן טיפול חציוני" stroke="#ffc658" name="זמן טיפול חציוני" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Deviation Rate Trend */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">מגמת אחוז חריגה</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="תאריך" tickFormatter={formatDate} />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip labelFormatter={formatDate} />
                                    <Legend />
                                    <Area type="monotone" dataKey="אחוז פניות בחריגה" fill="#ff8042" stroke="#ff8042" name="אחוז חריגה" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Monthly Comparison */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">השוואה חודשית</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="תאריך" tickFormatter={formatDate} />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip labelFormatter={formatDate} />
                                    <Legend />
                                    <Bar dataKey="מספר פניות" fill="#8884d8" name="מספר פניות" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render analysis by day charts
    const renderAnalysisByDay = () => {
        // Convert day names to Hebrew
        const hebrewAnalysisByDay = analysisByDay.map(item => {
            return {
                ...item,
                'יום בחודש': formatDayName(item['יום בחודש'])
            };
        });

        return (
            <div className="space-y-6">
                {/* Summary Cards - Added to match Trends section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm text-right">סה"כ פניות</h3>
                        <p className="text-2xl font-bold text-right">{hebrewAnalysisByDay.reduce((sum, item) => sum + item['מספר פניות'], 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm text-right">זמן טיפול ממוצע</h3>
                        <p className="text-2xl font-bold text-right">{Number((hebrewAnalysisByDay.reduce((sum, item) => sum + item['זמן טיפול ממוצע'], 0) / hebrewAnalysisByDay.length).toFixed(2))} שעות</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm text-right">אחוז חריגה ממוצע</h3>
                        <p className="text-2xl font-bold text-right">{Number((hebrewAnalysisByDay.reduce((sum, item) => sum + item['אחוז פניות בחריגה'], 0) / hebrewAnalysisByDay.length).toFixed(2))}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Requests by Day of Month */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">פניות לפי יום בחודש</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hebrewAnalysisByDay}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="יום בחודש" />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="מספר פניות" fill="#8884d8" name="מספר פניות" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Processing Time by Day */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">זמן טיפול לפי יום</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analysisByDay}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="יום בחודש" />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="זמן טיפול ממוצע" stroke="#82ca9d" name="זמן טיפול ממוצע" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Deviation Rate by Day */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">אחוז חריגה לפי יום</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analysisByDay}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="יום בחודש" />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="אחוז פניות בחריגה" fill="#ff8042" stroke="#ff8042" name="אחוז חריגה" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Peak Days */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-right">ימים עמוסים</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakDays}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="יום בשבוע"
                                        tickFormatter={formatPeakDay}
                                        tick={{ fontSize: 14, fontWeight: 'bold' }}
                                    />
                                    <YAxis width={60} tick={{ fontSize: 12, textAnchor: 'end' }} />
                                    <Tooltip
                                        formatter={(value) => [`${value} פניות`, 'מספר פניות']}
                                        labelFormatter={(label) => `יום ${formatPeakDay(label)}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="מספר פניות" fill="#8884d8" name="מספר פניות" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 w-full max-w-full px-2" dir="rtl">
            {/* Tabs */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded-lg ${activeTab === 'trends' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('trends')}
                    >
                        מגמות
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${activeTab === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('daily')}
                    >
                        ניתוח יומי
                    </button>
                </div>
            </div>

            {/* Time Range Filter (only for trends tab) */}
            {activeTab === 'trends' && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg ${timeRange === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setTimeRange('all')}
                        >
                            כל הזמן
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setTimeRange('year')}
                        >
                            שנה אחרונה
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${timeRange === '6months' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setTimeRange('6months')}
                        >
                            6 חודשים אחרונים
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${timeRange === '3months' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setTimeRange('3months')}
                        >
                            3 חודשים אחרונים
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setTimeRange('month')}
                        >
                            חודש אחרון
                        </button>
                    </div>
                </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'trends' && renderTrendsCharts()}
            {activeTab === 'daily' && renderAnalysisByDay()}
        </div>
    );
};

export default DashboardView; 