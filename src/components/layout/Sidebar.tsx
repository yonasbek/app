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
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const showFullContent = !isCollapsed || isHovered;

    return (
        <div
            className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16 hover:w-64' : 'w-64'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="h-full bg-app-card border-r border-app-secondary flex flex-col shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-app-secondary">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-app-foreground rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">ML</span>
                        </div>
                        {showFullContent && (
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
                <nav className="flex-1 px-4 py-6 space-y-1">
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
                            >
                                <Icon
                                    className={`w-5 h-5  mr-2 transition-colors duration-200 ${isActive ? 'text-neutral-700' : 'text-neutral-500'
                                        }`}
                                />
                                {showFullContent && (
                                    <span className="font-medium text-sm">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-app-secondary p-3 space-y-1">
                    <button className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-app-accent hover:text-app-foreground transition-colors duration-200">
                        <Settings className="w-5 h-5" />
                        {showFullContent && (
                            <span className="font-medium text-sm">Settings</span>
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        {showFullContent && (
                            <span className="font-medium text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
} 