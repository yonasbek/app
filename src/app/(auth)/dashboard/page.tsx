'use client';

import Link from 'next/link';

const modules = [
  { 
    path: '/plans', 
    name: 'Annual Plans',
    description: 'Track and manage annual plans and activities'
  },
  { 
    path: '/indicators', 
    name: 'Medical Indicators',
    description: 'Monitor medical service performance indicators'
  },
  { 
    path: '/knowledge-base', 
    name: 'Knowledge Base',
    description: 'Access and manage organizational knowledge'
  },
  { 
    path: '/memos', 
    name: 'Memos & Proposals',
    description: 'Handle memos and proposal workflows'
  },
  { 
    path: '/attendance', 
    name: 'Attendance',
    description: 'Manage attendance and time tracking'
  },
  { 
    path: '/rooms', 
    name: 'Meeting Rooms',
    description: 'Book and manage meeting rooms'
  },
  { 
    path: '/contacts', 
    name: 'Contacts',
    description: 'Access the organization contact directory'
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to MSLeo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            key={module.path}
            href={module.path}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {module.name}
            </h2>
            <p className="text-gray-600">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 