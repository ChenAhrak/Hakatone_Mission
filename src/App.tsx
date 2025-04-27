import { useState, useEffect } from 'react'
import TableView from './components/TableView'
import ListView from './components/ListView'
import CardView from './components/CardView'
import sampleData from './data/sampleData.json'

type ViewType = 'table' | 'list' | 'card';

function App() {
    const [viewType, setViewType] = useState<ViewType>('table');
    const [data, setData] = useState(sampleData.items);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="view-select" className="text-sm font-medium text-gray-700">
                            View:
                        </label>
                        <select
                            id="view-select"
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value as ViewType)}
                            className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="table">Table View</option>
                            <option value="list">List View</option>
                            <option value="card">Card View</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    {viewType === 'table' && <TableView items={data} />}
                    {viewType === 'list' && <ListView items={data} />}
                    {viewType === 'card' && <CardView items={data} />}
                </div>
            </div>
        </div>
    )
}

export default App 