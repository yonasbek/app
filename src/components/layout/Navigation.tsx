'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/plans', name: 'Annual Plans' },
  { path: '/indicators', name: 'Medical Indicators' },
  { path: '/knowledge-base', name: 'Knowledge Base' },
  { path: '/memos', name: 'Memos & Proposals' },
  { path: '/attendance', name: 'Attendance' },
  { path: '/rooms', name: 'Meeting Rooms' },
  { path: '/contacts', name: 'Contacts' },
  { path: '/users', name: 'Users' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-800">
                MSLeo
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Simple hamburger icon */}
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.path
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-3 py-2 text-base font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
} 