import React, { useState } from 'react'
import TableView from './components/TableView'
import CardView from './components/CardView'
import DataVisualization from './components/DataVisualization'
import DashboardView from './components/DashboardView'
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
  const [selectedData, setSelectedData] = useState('trends');
  const [viewType, setViewType] = useState('dashboard');

  const dataOptions = {
    // correlations: { name: 'קורלציות', data: correlations },
    complexityOverSeason: { name: 'מורכבות לאורך העונה', data: complexityOverSeason },
    trends: { name: 'מגמות', data: trends },
    busyDays: { name: 'ימים עמוסים', data: busyDays },
    unusualCities: { name: 'ערים יוצאות דופן', data: unusualCities },
    easyToHardRelation: { name: 'יחס קל-קשה', data: easyToHardRelation },
    classEffective: { name: 'יעילות לפי מחלקה', data: classEffective },
    peakDays: { name: 'ימי שיא', data: peakDays },
    earlyResolution: { name: 'פתרון מוקדם', data: earlyResolution },
    analysisSeasons: { name: 'ניתוח לפי עונות', data: analysisSeasons },
    analysisByHours: { name: 'ניתוח לפי שעות', data: analysisByHours },
    analysisByAbnormality: { name: 'ניתוח לפי חריגות', data: analysisByAbnormality },
    analysisByDay: { name: 'ניתוח לפי ימים', data: analysisByDay },
    // urgentSubjects: { name: 'נושאים דחופים', data: urgentSubjects },
    dominantSubjects: { name: 'נושאים דומיננטיים', data: dominantSubjects },
  };

  const currentData = dataOptions[selectedData].data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            לוח בקרה נתונים
          </h1>
          <button
            onClick={() => setViewType('dashboard')}
            className="flex items-center justify-center p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
            title="לוח בקרה"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={selectedData}
            onChange={(e) => setSelectedData(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
          >
            {/* <option value="correlations">קורלציות</option> */}
            <option value="complexityOverSeason">מורכבות פנייה לפי יום</option>
            <option value="trends">נתונים לפי חודשים</option>
            <option value="busyDays">ימים עמוסים</option>
            <option value="unusualCities">ערים יוצאות דופן</option>
            <option value="easyToHardRelation">יחס קל-קשה</option>
            <option value="classEffective">יעילות לפי מחלקה</option>
            <option value="peakDays">ימי שיא</option>
            <option value="earlyResolution">פתרון מוקדם</option>
            <option value="analysisSeasons">ניתוח לפי עונות</option>
            <option value="analysisByHours">ניתוח לפי שעות</option>
            <option value="analysisByAbnormality">ניתוח לפי חריגות</option>
            <option value="analysisByDay">ניתוח לפי ימים</option>
            {/* <option value="urgentSubjects">נושאים דחופים</option> */}
            <option value="dominantSubjects">נושאים דומיננטיים</option>
          </select>

          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
          >
            <option value=""></option>
            <option value="table">תצוגת טבלה</option>
            <option value="card">תצוגת כרטיסים</option>
            <option value="visualization">תצוגת ויזואליזציה</option>
          </select>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 inline-block px-6 py-2 rounded-lg bg-white shadow-sm">
            {dataOptions[selectedData].name}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {viewType === 'table' && <TableView items={currentData} />}
          {viewType === 'card' && <CardView items={currentData} />}
          {viewType === 'visualization' && <DataVisualization items={currentData} />}
          {viewType === 'dashboard' && <DashboardView />}
        </div>
      </div>
    </div>
  )
}

export default App
