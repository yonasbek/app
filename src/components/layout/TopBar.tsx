'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Bell,
    User,
    ChevronDown,
    Menu,
    LogOut,
    Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
    onSidebarToggle: () => void;
    sidebarCollapsed: boolean;
    isMobileMenuOpen?: boolean;
}

export default function TopBar({ onSidebarToggle, sidebarCollapsed, isMobileMenuOpen }: TopBarProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [userInfo, setUserInfo] = useState({
        fullName: 'John Doe',
        email: 'john.doe@company.com',
        role: 'Administrator'
    });
    const router = useRouter();

    // Access localStorage only on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const fullName = localStorage.getItem('fullName');
            const email = localStorage.getItem('email');
            const role = localStorage.getItem('role');

            setUserInfo({
                fullName: fullName ? JSON.parse(fullName) : 'John Doe',
                email: email ? JSON.parse(email) : 'john.doe@company.com',
                role: role ? JSON.parse(role) : 'Administrator'
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <header
            className={`fixed top-0 right-0 h-16 z-20 transition-all duration-300 ease-in-out
                ${/* Mobile: full width */ ''}
                left-0
                ${/* Desktop: adjust for sidebar */ ''}
                ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
            `}
        >
            <div className="h-full bg-app-card border-b border-app-secondary px-4 sm:px-6 flex items-center justify-between shadow-sm">
                {/* Left Section - Mobile Menu & Welcome */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onSidebarToggle}
                        className="lg:hidden p-2 rounded-lg hover:bg-app-accent transition-colors"
                    >
                        <Menu className="w-5 h-5 text-neutral-600" />
                    </button>

                    <div className="hidden md:block">
                        <h1 className="text-lg font-medium text-neutral-800">Welcome back!</h1>
                        <p className="text-sm text-neutral-500">Manage your office operations efficiently</p>
                    </div>
                </div>

                {/* Right Section - Notifications & User */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg hover:bg-app-accent transition-colors relative"
                        >
                            <Bell className="w-5 h-5 text-neutral-500" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-neutral-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">3</span>
                            </span>
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-app-card rounded-lg shadow-lg border border-app-secondary">
                                <div className="p-4 border-b border-app-secondary">
                                    <h3 className="font-medium text-neutral-800">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 border-b border-app-accent hover:bg-app-accent transition-colors">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 bg-app-secondary rounded-full flex items-center justify-center">
                                                    <Bell className="w-4 h-4 text-neutral-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-800">New task assigned</p>
                                                    <p className="text-xs text-neutral-500">You have a new task in Annual Plans</p>
                                                    <p className="text-xs text-neutral-400 mt-1">2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-app-secondary">
                                    <button className="text-sm text-neutral-600 hover:text-neutral-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-lg hover:bg-app-accent transition-colors"
                        >
                            <div className="w-8 h-8 bg-app-foreground rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-neutral-800">{userInfo.fullName}</p>
                                <p className="text-xs text-neutral-500">{userInfo.role}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-neutral-400" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-app-card rounded-lg shadow-lg border border-app-secondary">
                                <div className="p-4 border-b border-app-secondary">
                                    <p className="font-medium text-neutral-800">{userInfo.fullName}</p>
                                    <p className="text-sm text-neutral-500">{userInfo.email}</p>
                                </div>

                                <button className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-app-accent hover:text-app-foreground transition-colors duration-200">
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium text-sm text-neutral-600">Settings</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium text-sm text-neutral-600 hover:text-red-700">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 