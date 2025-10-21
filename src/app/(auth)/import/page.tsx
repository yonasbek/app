'use client';

import React, { useState } from 'react';
import { Upload, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
import { toast } from 'sonner';

interface ImportReport {
  id: string;
  name: string;
  filename: string;
  totalRows: number;
  totalColumns: number;
  headers: string[];
  status: string;
  createdAt: string;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importName, setImportName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [reports, setReports] = useState<ImportReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ImportReport | null>(null);
  const [reportData, setReportData] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const isCSV = selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv');
      const isXLSX = selectedFile.type.includes('spreadsheetml') || 
                     selectedFile.type.includes('excel') || 
                     selectedFile.name.endsWith('.xlsx') || 
                     selectedFile.name.endsWith('.xls');
      
      if (isCSV || isXLSX) {
        setFile(selectedFile);
        if (!importName) {
          const nameWithoutExt = selectedFile.name.replace(/\.(csv|xlsx|xls)$/, '');
          setImportName(nameWithoutExt);
        }
      } else {
        toast.error('Please select a CSV or XLSX file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !importName) {
      toast.error('Please select a file and enter a name');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', importName);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/import/csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('CSV imported successfully!');
        setFile(null);
        setImportName('');
        setSelectedReport(result);
        setReportData([]);
        fetchReports();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to import CSV');
      }
    } catch (error) {
      toast.error('Failed to import CSV');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/import/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const fetchReportData = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/import/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    }
  };

  const handleReportSelect = (report: ImportReport) => {
    setSelectedReport(report);
    fetchReportData(report.id);
  };

  // Load reports on component mount
  React.useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
          <p className="text-gray-600">Import CSV files and view imported data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-6 w-6 text-app-primary" />
            <h2 className="text-lg font-semibold">Import CSV File</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Name
              </label>
              <input
                type="text"
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-app-primary"
                placeholder="Enter import name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV or XLSX File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {file ? file.name : 'Click to select CSV or XLSX file'}
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || !importName || isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Import File'}
            </button>
          </div>
        </Card>

        {/* Reports List */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-app-primary" />
            <h2 className="text-lg font-semibold">Import Reports</h2>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? 'border-app-primary bg-app-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleReportSelect(report)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.filename}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'SUCCESS' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {report.totalRows} rows • {report.totalColumns} columns •{' '}
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data Table */}
      {selectedReport && reportData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-app-primary" />
            <h2 className="text-lg font-semibold">
              Data Preview: {selectedReport.name}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selectedReport.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.slice(0, 100).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {selectedReport.headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row[header] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length > 100 && (
              <div className="px-6 py-3 text-sm text-gray-500 bg-gray-50">
                Showing first 100 rows of {reportData.length} total rows
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
