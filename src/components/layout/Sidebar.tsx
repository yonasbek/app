'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Home,
    Calendar,
    Users,
    BookOpen,
    FileText,
    Clock,
    MapPin,
    Phone,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/plans', name: 'Annual Plans', icon: Calendar },
    { path: '/knowledge-base', name: 'Knowledge Base', icon: BookOpen },
    { path: '/memos', name: 'Memos & Proposals', icon: FileText },
    { path: '/attendance', name: 'Attendance', icon: Clock },
    { path: '/rooms', name: 'Meeting Rooms', icon: MapPin },
    { path: '/contacts', name: 'Contacts', icon: Phone },
    { path: '/users', name: 'Users', icon: Users },
    { path: '/reports', name: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isMobileOpen?: boolean;
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const showFullContent = !isCollapsed || isHovered;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out
                    ${/* Mobile: hidden by default, show as overlay when isMobileOpen */ ''}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                    ${/* Desktop: responsive width based on collapsed state */ ''}
                    lg:z-30 ${isCollapsed ? 'lg:w-16 lg:hover:w-64' : 'lg:w-64'}
                    ${/* Fixed width on mobile */ ''}
                    w-64
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="h-full bg-app-card border-r border-app-secondary flex flex-col shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-app-secondary">
                        <div className="flex items-center space-x-3">
                            <div className={`bg-app-foreground rounded-lg flex items-center justify-center ${(showFullContent || isMobileOpen) ? 'w-8 h-8' : 'w-10 h-10'}`}>
                                <span className={`text-white font-bold ${(showFullContent || isMobileOpen) ? 'text-sm' : 'text-base'}`}>ML</span>
                            </div>
                            {(showFullContent || isMobileOpen) && (
                                <span className="font-semibold text-lg text-app-foreground">
                                    MSLeo
                                </span>
                            )}
                        </div>

                        <button
                            onClick={onToggle}
                            className="p-1.5 rounded-md hover:bg-app-accent transition-colors"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 text-neutral-500" />
                            ) : (
                                <ChevronLeft className="w-4 h-4 text-neutral-500" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-1`}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-app-accent text-app-foreground border-l-3 border-app-foreground'
                                        : 'text-neutral-600 hover:bg-app-accent hover:text-app-foreground'
                                        }`}
                                    onClick={() => {
                                        // Close mobile menu when clicking a link
                                        if (isMobileOpen) {
                                            onToggle();
                                        }
                                    }}
                                >
                                    {/* Icon - always visible with larger size when collapsed */}
                                    <Icon
                                        className={`transition-colors duration-200 ${isActive ? 'text-neutral-700' : 'text-neutral-500'
                                            } ${(showFullContent || isMobileOpen) ? 'w-5 h-5 mr-3' : 'w-8 h-8 mx-auto'}`}
                                    />
                                    {/* Text - only visible when expanded or on mobile */}
                                    {(showFullContent || isMobileOpen) && (
                                        <span className="font-medium text-sm">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-app-secondary p-3 space-y-1">
                        <button className="flex items-center w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-app-accent hover:text-app-foreground transition-colors duration-200">
                            {/* Settings Icon - always visible with larger size when collapsed */}
                            <Settings className={`${(showFullContent || isMobileOpen) ? 'w-5 h-5 mr-3' : 'w-6 h-6 mx-auto'}`} />
                            {/* Settings Text - only visible when expanded or on mobile */}
                            {(showFullContent || isMobileOpen) && (
                                <span className="font-medium text-sm">Settings</span>
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                        >
                            {/* Logout Icon - always visible with larger size when collapsed */}
                            <LogOut className={`${(showFullContent || isMobileOpen) ? 'w-5 h-5 mr-3' : 'w-6 h-6 mx-auto'}`} />
                            {/* Logout Text - only visible when expanded or on mobile */}
                            {(showFullContent || isMobileOpen) && (
                                <span className="font-medium text-sm">Logout</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 