import { useState } from 'react'
import TableView from './components/TableView'
import ListView from './components/ListView'
import CardView from './components/CardView'
import sampleData from './data/sampleData.json'
import correlations from './data/correlations.json'
import complexityOverSeason from './data/complexityOverSeason.json'
import trends from './data/trends.json'
import busyDays from './data/busyDays.json'
import unusualCities from './data/unusualCities.json'
import easyToHardRelation from './data/easyToHardRelation.json'
import classEffective from './data/classEffective.json'
import peakDays from './data/peakDays.json'
import earlyResolution from './data/earlyResolution.json'
import analysisSeasons from './data/analysisSeasons.json'
import analysisByHours from './data/analysisByHours.json'
import analysisByAbnormality from './data/analysisByAbnormality.json'
import analysisByDay from './data/analysisByDay.json'
import urgentSubjects from './data/urgentSubjects.json'
import dominantSubjects from './data/dominantSubjects.json'
import './App.css'

function App() {
  const [viewType, setViewType] = useState('table');
  const [selectedData, setSelectedData] = useState('sample');

  const dataOptions = {
    sample: { name: 'Sample Data', data: sampleData.items },
    correlations: { name: 'Correlations', data: correlations },
    complexityOverSeason: { name: 'Complexity Over Season', data: complexityOverSeason },
    trends: { name: 'Trends', data: trends },
    busyDays: { name: 'Busy Days', data: busyDays },
    unusualCities: { name: 'Unusual Cities', data: unusualCities },
    easyToHardRelation: { name: 'Easy to Hard Relation', data: easyToHardRelation },
    classEffective: { name: 'Class Effective', data: classEffective },
    peakDays: { name: 'Peak Days', data: peakDays },
    earlyResolution: { name: 'Early Resolution', data: earlyResolution },
    analysisSeasons: { name: 'Analysis Seasons', data: analysisSeasons },
    analysisByHours: { name: 'Analysis By Hours', data: analysisByHours },
    analysisByAbnormality: { name: 'Analysis By Abnormality', data: analysisByAbnormality },
    analysisByDay: { name: 'Analysis By Day', data: analysisByDay },
    urgentSubjects: { name: 'Urgent Subjects', data: urgentSubjects },
    dominantSubjects: { name: 'Dominant Subjects', data: dominantSubjects },
  };

  const currentData = dataOptions[selectedData].data;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="data-select" className="text-sm font-medium text-gray-700">
                Data:
              </label>
              <select
                id="data-select"
                value={selectedData}
                onChange={(e) => setSelectedData(e.target.value)}
                className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {Object.entries(dataOptions).map(([key, { name }]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="view-select" className="text-sm font-medium text-gray-700">
                View:
              </label>
              <select
                id="view-select"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="table">Table View</option>
                <option value="list">List View</option>
                <option value="card">Card View</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {viewType === 'table' && <TableView items={currentData} />}
          {viewType === 'list' && <ListView items={currentData} />}
          {viewType === 'card' && <CardView items={currentData} />}
        </div>
      </div>
    </div>
  )
}

export default App
