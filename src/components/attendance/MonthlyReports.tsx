import React from 'react';

export default function MonthlyReports() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Monthly Reports</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
            <input 
              type="month" 
              className="border border-gray-300 rounded-lg px-3 py-2"
              defaultValue={new Date().toISOString().slice(0, 7)}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
} 