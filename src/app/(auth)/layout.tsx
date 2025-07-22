'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import ResponsiveTest from '@/components/ui/ResponsiveTest';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Close mobile menu when window is resized to desktop size
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Sidebar - handles both mobile and desktop states */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileMenuOpen}
      />

      {/* Top Bar */}
      <TopBar
        onSidebarToggle={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ease-in-out
          ${/* Mobile: no left margin */ ''}
          ml-0
          ${/* Desktop: left margin based on sidebar state */ ''}
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-fadeIn">
            {children}
          </div>
        </div>
      </main>

      {/* Responsive Test Component - Only in development */}
      {process.env.NODE_ENV === 'development' && <ResponsiveTest />}
    </div>
  );
} 