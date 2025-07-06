import React from 'react';

export default function BulkOperations() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bulk Operations</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Import/Export Data</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
            <input 
              type="file" 
              accept=".csv"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Import Data
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 